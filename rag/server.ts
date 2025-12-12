import express from "express"
import cors from "cors"
import fs from "fs/promises"
import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"
import dotenv from "dotenv"

// Lade .env Datei
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3030

// Middleware
app.use(cors())
app.use(express.json())

// Initialisiere APIs
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface DocumentChunk {
  id: string
  content: string
  metadata: {
    source: string
    type: "markdown" | "pdf"
    title?: string
    category?: string
  }
  embedding?: number[]
}

interface VectorStore {
  version: string
  createdAt: string
  chunks: DocumentChunk[]
  stats: {
    totalChunks: number
    markdownFiles: number
    pdfFiles: number
  }
}

// Lade Vector Store beim Start
let vectorStore: VectorStore | null = null

async function loadVectorStore() {
  try {
    const data = await fs.readFile("rag/vector-store.json", "utf-8")
    vectorStore = JSON.parse(data)
    console.log(`✅ Vector Store geladen: ${vectorStore?.chunks.length} Chunks`)
  } catch (error) {
    console.error("❌ Fehler beim Laden des Vector Stores:", error)
    console.log("\n💡 Führe zuerst 'npm run rag:index' aus!")
  }
}

/**
 * Berechne Kosinus-Ähnlichkeit zwischen zwei Vektoren
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Finde die relevantesten Chunks für eine Query
 */
async function findRelevantChunks(
  query: string,
  topK = 5
): Promise<Array<DocumentChunk & { score: number }>> {
  if (!vectorStore) {
    throw new Error("Vector Store nicht geladen")
  }

  // 1. Extrahiere Page Context: [Kontext: Nutzer ist auf Seite "FEF"]
  const pageContextMatch = query.match(/\[Kontext: Nutzer ist auf Seite "([^"]+)"\]/)
  const currentPage = pageContextMatch ? pageContextMatch[1] : null

  // 2. Extrahiere Wikilinks: (Suche gezielt nach Informationen über: FEF, IFJ)
  const wikilinkMatch = query.match(/\(Suche gezielt nach Informationen über: ([^\)]+)\)/)
  const wikilinks = wikilinkMatch ? wikilinkMatch[1].split(", ").map(s => s.trim().toUpperCase()) : []

  // 3. Extrahiere spezifische Dateinamen aus Query (z.B. "FEF", "IFJ")
  const fileNameMatch = query.match(/(?:über|nach|zu|von|aus)\s+[:\s]*([A-Z0-9]+)/i)
  const specificFile = fileNameMatch ? fileNameMatch[1].toUpperCase() : null

  // Erstelle Embedding für Query
  const queryEmbedding = await openai.embeddings.create({
    input: query,
    model: "text-embedding-3-large",
    dimensions: 1536,
  })

  const queryVector = queryEmbedding.data[0].embedding

  // Filtere Chunks (bevorzuge spezifische Dateien, falls angegeben)
  let chunks = vectorStore.chunks.filter(chunk => chunk.embedding && chunk.embedding.length > 0)

  // PRIORITÄT 1: Wikilinks (explizite [[File]]-Referenzen haben immer Vorrang!)
  if (wikilinks.length > 0) {
    const wikilinkChunks = chunks.filter(chunk =>
      wikilinks.some(link =>
        chunk.metadata.source.toUpperCase().includes(link) ||
        chunk.metadata.title?.toUpperCase().includes(link)
      )
    )

    if (wikilinkChunks.length > 0) {
      console.log(`📌 WIKILINKS: ${wikilinkChunks.length} Chunks für [${wikilinks.join(", ")}]`)
      chunks = wikilinkChunks
    } else {
      console.log(`⚠️  Keine Chunks für Wikilinks [${wikilinks.join(", ")}] gefunden`)
    }
  }

  // PRIORITÄT 2: Current Page (nur wenn keine Wikilinks vorhanden sind)
  else if (currentPage) {
    const pageChunks = chunks.filter(chunk =>
      chunk.metadata.title?.toUpperCase() === currentPage.toUpperCase() ||
      chunk.metadata.source.toUpperCase().includes(`/${currentPage.toUpperCase()}.MD`)
    )

    if (pageChunks.length > 0) {
      console.log(`📌 CURRENT PAGE: ${pageChunks.length} Chunks von "${currentPage}"`)
      chunks = pageChunks
    } else {
      console.log(`⚠️  Keine Chunks für Current Page "${currentPage}" gefunden`)
    }
  }

  // PRIORITÄT 3: Specific File (alter Mechanismus als letzter Fallback)
  else if (specificFile) {
    const fileChunks = chunks.filter(chunk =>
      chunk.metadata.source.toUpperCase().includes(specificFile) ||
      chunk.metadata.title?.toUpperCase().includes(specificFile)
    )

    if (fileChunks.length > 0) {
      console.log(`📌 SPECIFIC FILE: ${fileChunks.length} Chunks für "${specificFile}"`)
      chunks = fileChunks
    }
  }

  // Berechne Ähnlichkeiten
  const scoredChunks = chunks
    .map(chunk => ({
      ...chunk,
      score: cosineSimilarity(queryVector, chunk.embedding!),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)

  return scoredChunks
}

/**
 * Formatiere Kontext für Claude
 */
function formatContext(chunks: Array<DocumentChunk & { score: number }>): string {
  return chunks
    .map((chunk, idx) => {
      const source = chunk.metadata.title || chunk.metadata.source.split("/").pop()
      const category = chunk.metadata.category || "Unknown"
      return `[Quelle ${idx + 1}: ${source} (${category}, Relevanz: ${(chunk.score * 100).toFixed(1)}%)]
${chunk.content}
`
    })
    .join("\n---\n\n")
}

// API Endpoints

/**
 * Health Check
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    vectorStore: vectorStore ? "loaded" : "not loaded",
    chunks: vectorStore?.chunks.length || 0,
  })
})

/**
 * Chat Endpoint mit RAG
 */
app.post("/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body

    if (!message) {
      return res.status(400).json({ error: "Message ist erforderlich" })
    }

    if (!vectorStore) {
      return res.status(503).json({ error: "Vector Store nicht geladen" })
    }

    console.log(`\n💬 Query: "${message}"`)

    // Finde relevante Chunks
    const relevantChunks = await findRelevantChunks(message, 8) // Top 8 für besseren Kontext

    if (relevantChunks.length === 0) {
      return res.json({
        response:
          "Ich konnte keine relevanten Informationen in deinen Bachelorarbeit-Dokumenten finden. Kannst du deine Frage anders formulieren?",
        sources: [],
      })
    }

    console.log(`📚 ${relevantChunks.length} relevante Chunks gefunden`)
    console.log(
      `   Top Scores: ${relevantChunks
        .slice(0, 3)
        .map(c => (c.score * 100).toFixed(1) + "%")
        .join(", ")}`
    )

    // Formatiere Kontext
    const context = formatContext(relevantChunks)

    // Erkenne den Anfrage-Typ
    const isSummaryRequest = message.toLowerCase().includes("zusammenfassen") ||
                            message.toLowerCase().includes("fasse") ||
                            message.toLowerCase().includes("zusammenfassung")
    const isMainPointsRequest = message.toLowerCase().includes("hauptpunkte") ||
                               message.toLowerCase().includes("key points")

    // System Prompt für akademische Zusammenfassungen
    let specificInstructions = ""

    if (isSummaryRequest) {
      specificInstructions = `
ZUSAMMENFASSUNG ANGEFORDERT:
- Gib eine echte ZUSAMMENFASSUNG in 2-3 Sätzen
- Konzentriere dich auf die KERNAUSSAGE, nicht auf Details
- Verwende EIGENE WORTE, keine Ausschnitte aus den Quellen
- Formuliere ÜBERGREIFEND und ABSTRAHIEREND`
    } else if (isMainPointsRequest) {
      specificInstructions = `
HAUPTPUNKTE ANGEFORDERT:
- Gib EXAKT 3 kurze Bullet Points aus (verwende • als Symbol)
- Jeder Punkt: MAXIMAL 1 Zeile
- Nur die WICHTIGSTEN Kernaussagen
- Keine Details, keine Erklärungen`
    }

    const systemPrompt = `Du bist Mika, ein hilfreicher wissenschaftlicher Assistent, der Fragen zur Bachelorarbeit über auditorische Streams im Gehirn beantwortet.

WICHTIGE REGELN:
1. Beantworte Fragen ausschließlich basierend auf den bereitgestellten Quellen
2. Sei EXTREM PRÄGNANT - keine ausschweifenden Erklärungen
3. Zitiere immer die Quellen (z.B. "[Quelle 1]" oder "[Quelle 2, 3]")
4. Wenn die Informationen nicht in den Quellen enthalten sind, sage das klar
5. Verwende wissenschaftliche, aber zugängliche Sprache
6. Bei widersprüchlichen Informationen, erwähne beide Perspektiven kurz
7. Antworte auf Deutsch
${specificInstructions}

KONTEXT AUS DEN DOKUMENTEN:
${context}`

    // Bereite Konversationshistorie vor
    const messages: Anthropic.MessageParam[] = [
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ]

    // Rufe Claude API auf
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    })

    const assistantMessage =
      response.content[0].type === "text" ? response.content[0].text : ""

    // Extrahiere verwendete Quellen
    const sources = relevantChunks
      .filter(chunk => chunk.score > 0.5) // Nur wirklich relevante
      .map(chunk => ({
        title: chunk.metadata.title,
        category: chunk.metadata.category,
        type: chunk.metadata.type,
        score: chunk.score,
        excerpt: chunk.content.substring(0, 200) + "...",
      }))

    console.log(`✅ Antwort generiert (${assistantMessage.length} Zeichen)`)

    res.json({
      response: assistantMessage,
      sources,
      debug: {
        topScores: relevantChunks.slice(0, 3).map(c => c.score),
        chunksUsed: relevantChunks.length,
      },
    })
  } catch (error: any) {
    console.error("❌ Fehler:", error)
    res.status(500).json({
      error: "Interner Serverfehler",
      details: error.message,
    })
  }
})

/**
 * Such-Endpoint (optional, für direkten Zugriff auf Chunks)
 */
app.post("/search", async (req, res) => {
  try {
    const { query, topK = 10 } = req.body

    if (!query) {
      return res.status(400).json({ error: "Query ist erforderlich" })
    }

    const relevantChunks = await findRelevantChunks(query, topK)

    res.json({
      results: relevantChunks.map(chunk => ({
        id: chunk.id,
        content: chunk.content,
        metadata: chunk.metadata,
        score: chunk.score,
      })),
    })
  } catch (error: any) {
    console.error("❌ Fehler:", error)
    res.status(500).json({
      error: "Interner Serverfehler",
      details: error.message,
    })
  }
})

/**
 * Stats Endpoint
 */
app.get("/stats", (req, res) => {
  if (!vectorStore) {
    return res.status(503).json({ error: "Vector Store nicht geladen" })
  }

  const categoryCounts: Record<string, number> = {}
  vectorStore.chunks.forEach(chunk => {
    const cat = chunk.metadata.category || "Unknown"
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  })

  res.json({
    ...vectorStore.stats,
    createdAt: vectorStore.createdAt,
    categoryCounts,
  })
})

/**
 * Files Endpoint - Liste aller verfügbaren Dateien für Autocomplete
 */
app.get("/files", (req, res) => {
  if (!vectorStore) {
    return res.status(503).json({ error: "Vector Store nicht geladen" })
  }

  // Extrahiere einzigartige Dateinamen aus allen Chunks
  const filesSet = new Set<string>()
  vectorStore.chunks.forEach(chunk => {
    if (chunk.metadata.title) {
      filesSet.add(chunk.metadata.title)
    }
  })

  const files = Array.from(filesSet).sort()

  res.json({
    files,
    count: files.length,
  })
})

/**
 * Re-index Endpoint - Startet die Indexierung neu
 */
app.post("/reindex", async (req, res) => {
  try {
    console.log("\n🔄 Re-Indexierung gestartet...")

    // Starte Indexierung in einem separaten Prozess
    const { spawn } = await import("child_process")
    const indexProcess = spawn("npm", ["run", "rag:index"], {
      cwd: process.cwd(),
      shell: true,
    })

    let output = ""
    let errorOutput = ""

    indexProcess.stdout?.on("data", (data) => {
      const text = data.toString()
      output += text
      console.log(text)
    })

    indexProcess.stderr?.on("data", (data) => {
      const text = data.toString()
      errorOutput += text
      console.error(text)
    })

    indexProcess.on("close", async (code) => {
      if (code === 0) {
        console.log("✅ Re-Indexierung erfolgreich abgeschlossen")
        // Lade Vector Store neu
        await loadVectorStore()
      } else {
        console.error(`❌ Re-Indexierung fehlgeschlagen mit Code ${code}`)
      }
    })

    // Sende sofortige Bestätigung zurück
    res.json({
      message: "Re-Indexierung gestartet. Dies kann einige Minuten dauern.",
      status: "started",
    })
  } catch (error: any) {
    console.error("❌ Fehler beim Starten der Re-Indexierung:", error)
    res.status(500).json({
      error: "Fehler beim Starten der Re-Indexierung",
      details: error.message,
    })
  }
})

// Server starten
async function startServer() {
  // Überprüfe API-Keys
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY nicht gesetzt!")
    console.log("\n💡 Setze die API-Keys:")
    console.log("   export ANTHROPIC_API_KEY='your-key'")
    process.exit(1)
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY nicht gesetzt!")
    console.log("   export OPENAI_API_KEY='your-key'")
    process.exit(1)
  }

  // Lade Vector Store
  await loadVectorStore()

  // Starte Server
  app.listen(PORT, () => {
    console.log(`\n🚀 RAG Server läuft auf http://localhost:${PORT}`)
    console.log(`\n📍 Endpoints:`)
    console.log(`   GET  /health    - Health Check`)
    console.log(`   POST /chat      - Chat mit RAG`)
    console.log(`   POST /search    - Direkte Suche`)
    console.log(`   GET  /stats     - Statistiken`)
    console.log(`   POST /reindex   - Vector Store neu indizieren`)
    console.log(`\n💡 Teste mit:`)
    console.log(
      `   curl -X POST http://localhost:${PORT}/chat -H "Content-Type: application/json" -d '{"message":"Was sind auditorische Streams?"}'`
    )
  })
}

startServer().catch(console.error)
