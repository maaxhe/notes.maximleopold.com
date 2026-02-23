import fs from "fs/promises"
import path from "path"
import { globby } from "globby"
import matter from "gray-matter"
import pdfParse from "pdf-parse"
import OpenAI from "openai"
import dotenv from "dotenv"

// Lade .env Datei
dotenv.config()

interface DocumentChunk {
  id: string
  content: string
  metadata: {
    source: string
    type: "markdown" | "pdf"
    title?: string
    category?: string
    page?: number
  }
  embedding?: number[]
}

// Initialisiere OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Chunk-Größe für Fallback (wenn kein Heading vorhanden)
const CHUNK_SIZE = 800
const CHUNK_OVERLAP = 150
const MIN_CHUNK_SIZE = 80  // Zu kurze Chunks ignorieren

/**
 * Heading-basiertes Chunking — teilt Markdown an ## / ### Grenzen auf.
 * Jeder Chunk enthält einen semantisch zusammenhängenden Abschnitt.
 * Sehr lange Abschnitte werden zusätzlich per Satz-Splitting aufgeteilt.
 */
function chunkMarkdownByHeadings(rawMarkdown: string): string[] {
  const chunks: string[] = []

  // Splitte an H2 oder H3 Headings (## oder ###)
  const sections = rawMarkdown.split(/\n(?=#{1,3}\s)/g)

  for (const section of sections) {
    const trimmed = section.trim()
    if (trimmed.length < MIN_CHUNK_SIZE) continue

    // Abschnitt passt direkt als Chunk
    if (trimmed.length <= CHUNK_SIZE * 1.5) {
      chunks.push(trimmed)
    } else {
      // Zu langer Abschnitt: Heading als Präfix behalten, Rest per Satz aufteilen
      const lines = trimmed.split("\n")
      const heading = lines[0].startsWith("#") ? lines[0] + "\n" : ""
      const body = heading ? lines.slice(1).join("\n") : trimmed

      const sentences = body.split(/(?<=[.!?])\s+/)
      let current = heading

      for (const sentence of sentences) {
        if ((current + sentence).length > CHUNK_SIZE && current.length > MIN_CHUNK_SIZE) {
          chunks.push(current.trim())
          // Überlappung: letzten Satz des vorherigen Chunks mitnehmen
          const prevSentences = current.trim().split(/(?<=[.!?])\s+/)
          const overlap = prevSentences.slice(-1).join(" ")
          current = (heading || "") + overlap + " " + sentence
        } else {
          current += " " + sentence
        }
      }

      if (current.trim().length > MIN_CHUNK_SIZE) {
        chunks.push(current.trim())
      }
    }
  }

  return chunks.filter(c => c.length >= MIN_CHUNK_SIZE)
}

/**
 * Fallback: Satz-basiertes Chunking für PDFs und plain text
 */
function chunkText(text: string, maxChunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
  const chunks: string[] = []
  const sentences = text.split(/(?<=[.!?])\s+/)
  let currentChunk = ""

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim())
      const words = currentChunk.split(" ")
      const overlapWords = words.slice(-Math.floor(overlap / 5))
      currentChunk = overlapWords.join(" ") + " " + sentence
    } else {
      currentChunk += " " + sentence
    }
  }

  if (currentChunk.trim().length > 0) chunks.push(currentChunk.trim())
  return chunks
}

/**
 * Extrahiere Kategorie aus dem Dateipfad
 */
function extractCategory(filePath: string): string {
  const parts = filePath.split("/")
  const baIndex = parts.findIndex(p => p === "Bachelorarbeit")
  if (baIndex !== -1 && baIndex + 1 < parts.length) {
    return parts[baIndex + 1].replace(/^\d+\.\s*/, "") // Entferne Nummern wie "1. "
  }
  return "Unknown"
}

/**
 * Verarbeite eine Markdown-Datei
 */
async function processMarkdownFile(filePath: string): Promise<DocumentChunk[]> {
  try {
    const content = await fs.readFile(filePath, "utf-8")
    const { data: frontmatter, content: markdownContent } = matter(content)

    // Bereinige Markdown minimal — Headings BEHALTEN für heading-basiertes Chunking
    const cleanContent = markdownContent
      .replace(/\[\[([^\]]+)\]\]/g, "$1") // Wikilinks flatten
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Regular links flatten
      .replace(/[*_~`]/g, "") // Formatting entfernen
      .trim()

    if (cleanContent.length < 50) {
      console.log(`⚠️  Skipping ${path.basename(filePath)} (zu kurz)`)
      return []
    }

    // Heading-basiertes Chunking für Markdown
    const chunks = chunkMarkdownByHeadings(cleanContent)
    const category = extractCategory(filePath)

    return chunks.map((chunk, idx) => ({
      id: `${path.basename(filePath, ".md")}_${idx}`,
      content: chunk,
      metadata: {
        source: filePath,
        type: "markdown" as const,
        title: frontmatter.title || path.basename(filePath, ".md"),
        category,
      },
    }))
  } catch (error) {
    console.error(`Fehler bei ${filePath}:`, error)
    return []
  }
}

/**
 * Verarbeite eine PDF-Datei
 */
async function processPdfFile(filePath: string): Promise<DocumentChunk[]> {
  try {
    const dataBuffer = await fs.readFile(filePath)
    const pdfData = await pdfParse(dataBuffer)

    const cleanContent = pdfData.text
      .replace(/\s+/g, " ")
      .trim()

    if (cleanContent.length < 100) {
      console.log(`⚠️  Skipping ${path.basename(filePath)} (zu kurz)`)
      return []
    }

    const chunks = chunkText(cleanContent)

    return chunks.map((chunk, idx) => ({
      id: `${path.basename(filePath, ".pdf")}_${idx}`,
      content: chunk,
      metadata: {
        source: filePath,
        type: "pdf" as const,
        title: path.basename(filePath, ".pdf"),
        category: "Sources (PDF)",
      },
    }))
  } catch (error) {
    console.error(`Fehler bei PDF ${filePath}:`, error)
    return []
  }
}

/**
 * Erstelle Embeddings mit OpenAI
 */
async function createEmbeddings(chunks: DocumentChunk[]): Promise<DocumentChunk[]> {
  console.log(`\n🔮 Erstelle Embeddings für ${chunks.length} Chunks...`)

  // Batch-Verarbeitung (OpenAI unterstützt bis zu 2048 Inputs pro Request)
  // Aber Token-Limit ist 300k, also müssen wir kleinere Batches nutzen
  const batchSize = 1000
  const chunksWithEmbeddings: DocumentChunk[] = []

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize)
    const texts = batch.map(c => c.content)

    try {
      const response = await openai.embeddings.create({
        input: texts,
        model: "text-embedding-3-large", // Bestes Modell
        dimensions: 1536, // Standard-Dimensionen (kann auf 3072 erhöht werden)
      })

      batch.forEach((chunk, idx) => {
        chunk.embedding = response.data[idx].embedding
        chunksWithEmbeddings.push(chunk)
      })

      console.log(`  ✓ Batch ${i / batchSize + 1}/${Math.ceil(chunks.length / batchSize)} fertig`)
    } catch (error) {
      console.error(`Fehler bei Batch ${i / batchSize + 1}:`, error)
      // Füge Chunks ohne Embedding hinzu (besser als alles zu verlieren)
      chunksWithEmbeddings.push(...batch)
    }
  }

  return chunksWithEmbeddings
}

/**
 * Hauptfunktion: Indexiere alle Dokumente
 */
async function indexDocuments() {
  console.log("🚀 Starte Indexierung der Bachelorarbeit-Dokumente...\n")

  // Überprüfe API-Key
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY nicht gesetzt!")
    console.log("\n💡 Setze den API-Key:")
    console.log("   export OPENAI_API_KEY='your-api-key'")
    process.exit(1)
  }

  // Finde alle Markdown-Dateien
  console.log("📄 Suche Markdown-Dateien...")
  const markdownFiles = await globby([
    "content/Bachelorarbeit/**/*.md",
    "!content/Bachelorarbeit/**/Dashboard*.md", // Exkludiere Dashboard
    "!content/Bachelorarbeit/**/To-Do*.md", // Exkludiere To-Dos
  ])
  console.log(`  ✓ ${markdownFiles.length} Markdown-Dateien gefunden`)

  // Finde alle PDFs
  console.log("\n📚 Suche PDF-Dateien...")
  const pdfFiles = await globby([
    "content/a Literatur-Notizen/PDFs/*.pdf",
    "!content/a Literatur-Notizen/PDFs/Exam*.pdf", // Exkludiere Exams
    "!content/a Literatur-Notizen/PDFs/*Studien*.pdf", // Exkludiere Studienpläne
  ])
  console.log(`  ✓ ${pdfFiles.length} PDF-Dateien gefunden`)

  // Verarbeite alle Dateien
  console.log("\n⚙️  Verarbeite Dokumente...")
  const allChunks: DocumentChunk[] = []

  // Verarbeite Markdown
  for (const file of markdownFiles) {
    const chunks = await processMarkdownFile(file)
    allChunks.push(...chunks)
  }
  console.log(`  ✓ ${allChunks.length} Markdown-Chunks erstellt`)

  // Verarbeite PDFs
  let pdfChunkCount = 0
  for (const file of pdfFiles) {
    const chunks = await processPdfFile(file)
    allChunks.push(...chunks)
    pdfChunkCount += chunks.length
  }
  console.log(`  ✓ ${pdfChunkCount} PDF-Chunks erstellt`)
  console.log(`\n📊 Gesamt: ${allChunks.length} Chunks`)

  // Erstelle Embeddings
  const chunksWithEmbeddings = await createEmbeddings(allChunks)

  // Speichere Index
  const outputPath = "rag/vector-store.json"
  await fs.mkdir("rag", { recursive: true })
  await fs.writeFile(
    outputPath,
    JSON.stringify({
      version: "1.0",
      createdAt: new Date().toISOString(),
      chunks: chunksWithEmbeddings,
      stats: {
        totalChunks: chunksWithEmbeddings.length,
        markdownFiles: markdownFiles.length,
        pdfFiles: pdfFiles.length,
      },
    }, null, 2)
  )

  console.log(`\n✅ Indexierung abgeschlossen!`)
  console.log(`   Gespeichert in: ${outputPath}`)
  console.log(`   Größe: ${((await fs.stat(outputPath)).size / 1024 / 1024).toFixed(2)} MB`)
}

// Führe Indexierung aus
indexDocuments().catch(console.error)
