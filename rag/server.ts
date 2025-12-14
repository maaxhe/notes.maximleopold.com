import express from "express"
import cors from "cors"
import fs from "fs/promises"
import Anthropic from "@anthropic-ai/sdk"
import OpenAI from "openai"
import dotenv from "dotenv"

// Lade .env Datei (nur lokal, auf Railway werden ENV vars direkt gesetzt)
if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}

const app = express()
const apiRouter = express.Router()
const PORT = process.env.PORT || 3030

// Middleware
app.use(cors())
app.use(express.json())

// Debug: Log ob API Keys verfügbar sind (ohne sie preiszugeben!)
console.log("🔑 Environment Check:")
console.log("  ANTHROPIC_API_KEY:", process.env.ANTHROPIC_API_KEY ? "✅ Set" : "❌ Missing")
console.log("  OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "✅ Set" : "❌ Missing")
console.log("  NODE_ENV:", process.env.NODE_ENV || "development")

// Initialisiere APIs
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("❌ ANTHROPIC_API_KEY nicht gesetzt!")
  process.exit(1)
}

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY nicht gesetzt!")
  process.exit(1)
}

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

  // Berechne Ähnlichkeiten für ALLE Chunks
  const scoredChunks = chunks
    .map(chunk => {
      let score = cosineSimilarity(queryVector, chunk.embedding!)

      // PRIORITÄT 2: Boost Current Page Chunks (moderate Bevorzugung, nicht Exklusivität!)
      if (currentPage) {
        const isCurrentPage =
          chunk.metadata.title?.toUpperCase() === currentPage.toUpperCase() ||
          chunk.metadata.source.toUpperCase().includes(`/${currentPage.toUpperCase()}.MD`)

        if (isCurrentPage) {
          score *= 1.3  // 30% Boost für aktuelle Seite
        }
      }

      // PRIORITÄT 3: Boost Specific File (falls erwähnt in Query)
      else if (specificFile) {
        const isSpecificFile =
          chunk.metadata.source.toUpperCase().includes(specificFile) ||
          chunk.metadata.title?.toUpperCase().includes(specificFile)

        if (isSpecificFile) {
          score *= 1.2  // 20% Boost für spezifisch erwähnte Dateien
        }
      }

      return { ...chunk, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)

  // Logging für besseres Debugging
  if (currentPage) {
    const currentPageCount = scoredChunks.filter(c =>
      c.metadata.title?.toUpperCase() === currentPage.toUpperCase()
    ).length
    console.log(`📌 CONTEXT: Auf Seite "${currentPage}" (${currentPageCount}/${scoredChunks.length} Chunks von aktueller Seite)`)
  }

  return scoredChunks
}

/**
 * Formatiere Kontext für Claude
 */
function formatContext(chunks: Array<DocumentChunk & { score: number }>): string {
  return chunks
    .map((chunk, idx) => {
      const sourceTitle = chunk.metadata.title || chunk.metadata.source.split("/").pop()?.replace(/\.md$/, '') || 'Unknown'
      const category = chunk.metadata.category || "Unknown"

      // Verwende den Titel als Zitier-Key (statt Nummer)
      return `[${sourceTitle}] (${category}, Relevanz: ${(chunk.score * 100).toFixed(1)}%)
${chunk.content}
`
    })
    .join("\n---\n\n")
}

const INTERNAL_SOURCE_PATTERNS = [
  "notes.maximleopold.com",
  "maximleopold.com",
  "server.maximleopold.com",
  "localhost",
  "127.0.0.1",
]

const CITATION_REGEX = /(?<!\[)\[([^\]\[]+)\](?!\])/g

interface ChunkSourceMetadata {
  rawTitle: string
  authors: string
  year: string
  title: string
  venue: string
  citationLabel: string
  shortLabel: string
  sourceId: string
  path?: string
  url?: string | null
}

interface MatchedSourceChunk {
  chunk: DocumentChunk & { score: number }
  meta: ChunkSourceMetadata
}

interface SourcePayload {
  id: string
  title: string
  category?: string
  type?: string
  score?: number
  excerpt: string
  source?: string
  url?: string | null
  citation: {
    label: string
    shortLabel: string
    authors: string
    year: string
    title: string
    venue: string
  }
  bibliography: {
    authors: string
    year: string
    title: string
    venue: string
    url?: string | null
  }
  chunkIds: string[]
}

function containsInvalidCitation(text: string): boolean {
  if (!text) return false
  return /\bquelle\b/i.test(text) || /\bsource\s+\d+/i.test(text)
}

function normalizeCitationKey(value?: string): string {
  return (value || "")
    .toLowerCase()
    .replace(/[\[\]\(\)\.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function extractCitationMentions(text: string): Map<string, string> {
  const matches = new Map<string, string>()
  if (!text) return matches
  CITATION_REGEX.lastIndex = 0
  let match
  while ((match = CITATION_REGEX.exec(text)) !== null) {
    const raw = match[1].trim()
    const key = normalizeCitationKey(raw)
    if (key) {
      matches.set(key, raw)
    }
  }
  return matches
}

function buildPublicUrlFromSource(rawSource?: string | null) {
  if (!rawSource) return null
  if (rawSource.startsWith("http")) {
    return rawSource
  }
  const normalized = rawSource.replace(/^content\//i, "").replace(/\.md$/i, "")
  const slug = normalized
    .split("/")
    .map(segment =>
      segment
        .trim()
        .replace(/\s+/g, "-")
        .replace(/&/g, "-and-")
        .replace(/%/g, "-percent")
        .replace(/\?/g, "")
        .replace(/#/g, "")
    )
    .join("/")
  return `/${slug}`
}

function parseSourceMetadata(rawTitle: string, fallbackCategory?: string) {
  const trimmed = rawTitle?.trim() || "Unbenannte Quelle"
  const fallbackVenue = fallbackCategory?.replace(/\.md$/i, "") || "Internal Notes"

  const pattern = /^(?<authors>.+?)\s*\((?<year>\d{4})\)\s*(?:[-–:]\s*(?<rest>.+))?$/
  const match = trimmed.match(pattern)

  let authors = trimmed
  let year = ""
  let rest = ""
  if (match?.groups) {
    authors = match.groups.authors.trim()
    year = match.groups.year
    rest = match.groups.rest?.trim() || ""
  }

  let title = trimmed
  let venue = fallbackVenue

  if (rest) {
    const restParts = rest.split(" - ").map(part => part.trim()).filter(Boolean)
    if (restParts.length > 1) {
      title = restParts.shift() || trimmed
      venue = restParts.join(" - ")
    } else {
      title = rest
    }
  }

  if (!title) {
    title = trimmed
  }

  if (!authors) {
    authors = title
  }

  const citationLabel = `${authors}${year ? ` (${year})` : ""}`
  const shortLabel = year ? `${authors.split(/[,&]/)[0].trim()}, ${year}` : title

  return {
    rawTitle: trimmed,
    authors,
    year,
    title,
    venue,
    citationLabel,
    shortLabel,
  }
}

function buildChunkSourceMetadata(chunk: DocumentChunk & { score: number }): ChunkSourceMetadata | null {
  const rawSource = chunk.metadata.source
  if (rawSource && INTERNAL_SOURCE_PATTERNS.some(pattern => rawSource.toLowerCase().includes(pattern))) {
    return null
  }

  const rawTitle =
    chunk.metadata.title ||
    rawSource?.split("/").pop()?.replace(/\.md$/i, "") ||
    "Unbekannte Quelle"

  const parsed = parseSourceMetadata(rawTitle, chunk.metadata.category)
  const sourceId = canonicalChunkKey(chunk)
  if (!sourceId) {
    return null
  }
  const url = buildPublicUrlFromSource(rawSource)

  return {
    ...parsed,
    sourceId,
    path: rawSource,
    url,
  }
}

function buildCandidateCitationKeys(meta: ChunkSourceMetadata) {
  const candidates = new Set<string>()
  candidates.add(normalizeCitationKey(meta.rawTitle))
  candidates.add(normalizeCitationKey(meta.citationLabel))
  candidates.add(normalizeCitationKey(meta.shortLabel))
  candidates.add(normalizeCitationKey(meta.title))
  return Array.from(candidates).filter(Boolean)
}

function collectChunksForSources(titles: string[], maxPerSource = 3): Array<DocumentChunk & { score: number }> {
  if (!vectorStore || !titles.length) {
    return []
  }

  const normalized = titles.map(title => title.toUpperCase())
  const collected: Array<DocumentChunk & { score: number }> = []

  normalized.forEach((title, titleIndex) => {
    const matches = vectorStore!.chunks.filter(chunk => {
      const chunkTitle = chunk.metadata.title?.toUpperCase() || ""
      if (chunkTitle === title) return true
      // Fallback: allow partial match
      return chunkTitle.includes(title)
    })

    matches.slice(0, maxPerSource).forEach((chunk, idx) => {
      collected.push({
        ...chunk,
        score: 1 - titleIndex * 0.01 - idx * 0.001,
      })
    })
  })

  return collected
}

function buildWritingSystemPrompt(language: string, context: string): string {
  if (language === "de") {
    return `Du bist ein Writing Partner, der jedes Briefing strukturiert verarbeitet.

Arbeitsweise:
1. Lies den gesamten Session Brief aufmerksam.
2. Nutze ausschließlich die unten aufgeführten Quellen; zitiere sie exakt mit Ankern wie [[docs/brief.md#L42]].
3. Verwende IMMER den exakten Namen/Titel der Quelle (z.B. "Rauschecker & Scott (2009) - Nature Neuroscience"), niemals generische Labels wie "Quelle 4".
4. Antworte IMMER in zwei Teilen:
   a. Outline & Questions – liefere eine Gliederung und alle Rückfragen oder Datenlücken.
   b. Draft – nur nachdem der Nutzer ausdrücklich "approve outline" geschrieben hat.
5. Beende jede Antwort mit einer Liste "Need from you:" (Bullet Points).
6. Erfinde niemals Quellen oder Zahlen. Wenn Informationen fehlen, bitte gezielt darum.
7. Antworte im selben Language-Setting wie angefragt.

WRITING SOURCES:
${context}`
  }

  return `You are a writing partner who treats each session as a structured brief.

Workflow:
1. Read the entire Session Brief carefully.
2. Use ONLY the sources listed below; cite anchors exactly like [[notes/doc.md#L42]].
3. Always use the exact source title (e.g. "Rauschecker & Scott (2009) - Nature Neuroscience"); never cite placeholders like "Source 4".
4. Always reply in two parts:
   a. Outline & Questions – provide structure plus clarifying questions or missing data.
   b. Draft – only after the user explicitly says "approve outline".
5. Finish every response with "Need from you:" bullet points.
6. Never invent sources, numbers, or quotes. Ask when information is missing.
7. Respond in the requested language.

WRITING SOURCES:
${context}`
}

/**
 * Extrahiere tatsächlich zitierte Quellen aus Claude's Antwort
 */
function filterReferencedSources(
  responseText: string,
  allChunks: Array<DocumentChunk & { score: number }>
) {
  const citationMap = extractCitationMentions(responseText)
  console.log(`📝 Gefundene Zitate im Text: ${Array.from(citationMap.values()).join(", ")}`)

  if (!citationMap.size) {
    return {
      matches: [] as MatchedSourceChunk[],
      citationCount: 0,
      unmatchedCitations: [] as string[],
    }
  }

  const matchedChunks: MatchedSourceChunk[] = []
  const matchedKeys = new Set<string>()

  allChunks.forEach(chunk => {
    const meta = buildChunkSourceMetadata(chunk)
    if (!meta) return
    const candidates = buildCandidateCitationKeys(meta)
    const hit = candidates.find(key => citationMap.has(key))
    if (hit) {
      matchedChunks.push({ chunk, meta })
      matchedKeys.add(hit)
    }
  })

  const unmatchedCitations = Array.from(citationMap.entries())
    .filter(([key]) => !matchedKeys.has(key))
    .map(([, raw]) => raw)

  console.log(
    `✂️  Reduziert von ${allChunks.length} auf ${matchedChunks.length} tatsächlich zitierte Quellen`
  )

  return {
    matches: matchedChunks,
    citationCount: citationMap.size,
    unmatchedCitations,
  }
}

function buildSourcePayloads(matchedChunks: MatchedSourceChunk[]): SourcePayload[] {
  const sourceMap = new Map<string, SourcePayload>()

  matchedChunks.forEach(({ chunk, meta }) => {
    const existing = sourceMap.get(meta.sourceId)
    const excerpt = chunk.content.substring(0, 200) + "..."
    if (!existing) {
      sourceMap.set(meta.sourceId, {
        id: meta.sourceId,
        title: meta.rawTitle,
        category: chunk.metadata.category,
        type: chunk.metadata.type,
        score: chunk.score,
        excerpt,
        source: chunk.metadata.source,
        url: meta.url,
        citation: {
          label: meta.citationLabel,
          shortLabel: meta.shortLabel,
          authors: meta.authors,
          year: meta.year,
          title: meta.title,
          venue: meta.venue,
        },
        bibliography: {
          authors: meta.authors,
          year: meta.year,
          title: meta.title,
          venue: meta.venue,
          url: meta.url,
        },
        chunkIds: [chunk.id],
      })
    } else {
      existing.chunkIds = Array.from(new Set([...(existing.chunkIds || []), chunk.id]))
      if ((chunk.score ?? 0) > (existing.score ?? 0)) {
        existing.score = chunk.score
        existing.excerpt = excerpt
      }
    }
  })

  return Array.from(sourceMap.values())
}

// API Endpoints

/**
 * Health Check
 */
apiRouter.get("/health", (req, res) => {
  res.json({
    status: "ok",
    vectorStore: vectorStore ? "loaded" : "not loaded",
    chunks: vectorStore?.chunks.length || 0,
  })
})

/**
 * Chat Endpoint mit RAG und Streaming
 */
apiRouter.post("/chat-stream", async (req, res) => {
  try {
    const { message, conversationHistory = [], language = "de", mode, writingSources = [] } = req.body

    if (!message) {
      return res.status(400).json({ error: "Message ist erforderlich" })
    }

    if (!vectorStore) {
      return res.status(503).json({ error: "Vector Store nicht geladen" })
    }

    console.log(`\n💬 Query (Stream): "${message}"`)

    const isWritingMode = mode === "writing_assistant"
    let finalChunks: Array<DocumentChunk & { score: number }>
    let context = ""
    let systemPrompt = ""

    if (isWritingMode) {
      finalChunks = collectChunksForSources(writingSources, 3)

      if (finalChunks.length === 0) {
        return res.status(400).json({ error: "Keine passenden Quellen für den Writing Assistant gefunden." })
      }

      context = formatContext(finalChunks)
      systemPrompt = buildWritingSystemPrompt(language, context)
    } else {
      // Finde relevante Chunks (erhöht auf 30 für mehr Diversität!)
      const relevantChunks = await findRelevantChunks(message, 30)

      if (relevantChunks.length === 0) {
        return res.json({
          response: "Ich konnte keine relevanten Informationen finden.",
          sources: [],
        })
      }

      console.log(`📚 ${relevantChunks.length} relevante Chunks gefunden`)
      console.log(`   Top Scores: ${relevantChunks.slice(0, 3).map(c => `${Math.round(c.score * 100)}%`).join(", ")}`)

      // Filtere Duplikate: Nur beste Chunk pro Datei (WICHTIG: VOR dem Senden an Claude!)
      const uniqueChunks = relevantChunks.reduce((acc: typeof relevantChunks, chunk) => {
        const existingIndex = acc.findIndex(c => c.metadata.source === chunk.metadata.source)
        if (existingIndex === -1) {
          acc.push(chunk)
        } else if (chunk.score > acc[existingIndex].score) {
          acc[existingIndex] = chunk
        }
        return acc
      }, [])

      // Limitiere auf maximal 8 eindeutige Quellen (erhöht von 5 für mehr Kontext!)
      finalChunks = uniqueChunks.slice(0, 8)

      console.log(`📚 Verwende ${finalChunks.length} eindeutige Quellen (von ${relevantChunks.length} Chunks)`)
      finalChunks.forEach((c, i) => console.log(`   [${i+1}] ${c.metadata.title} (${Math.round(c.score * 100)}%)`))

      // Formatiere Kontext
      context = formatContext(finalChunks)

      // Erkenne Anfrage-Typ
      const isSummaryRequest = message.toLowerCase().includes("zusammenfassen") ||
                              message.toLowerCase().includes("fasse") ||
                              message.toLowerCase().includes("zusammenfassung")
      const isMainPointsRequest = message.toLowerCase().includes("hauptpunkte") ||
                                 message.toLowerCase().includes("key points")

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

      systemPrompt = language === "de"
        ? `Du bist Mika, ein hilfreicher wissenschaftlicher Assistent, der Fragen zur Bachelorarbeit über auditorische Streams im Gehirn beantwortet.

WICHTIGE REGELN:
1. Beantworte Fragen ausschließlich basierend auf den bereitgestellten Quellen
2. Sei EXTREM PRÄGNANT - keine ausschweifenden Erklärungen
3. Zitiere Quellen DIREKT mit ihrem Namen in eckigen Klammern (z.B. "[FEF]" oder "[Bedini & Baldauf (2021)]")
4. Verwende IMMER den exakten Dokumenttitel (z.B. "Rauschecker & Scott (2009) - Nature Neuroscience"), niemals generische Labels wie "Quelle 4"
5. NIEMALS Quellen in Überschriften (##, ###) einfügen - nur im Fließtext!
6. Verwende NUR Quellen, die du auch wirklich zitierst
7. Wenn die Informationen nicht in den Quellen enthalten sind, sage das klar
8. Verwende wissenschaftliche, aber zugängliche Sprache
9. Bei widersprüchlichen Informationen, erwähne beide Perspektiven kurz
10. Antworte auf Deutsch
${specificInstructions}

KONTEXT AUS DEN DOKUMENTEN:
${context}`
        : `You are Mika, a helpful scientific assistant answering questions about the bachelor thesis on auditory streams in the brain.

IMPORTANT RULES:
1. Answer questions exclusively based on the provided sources
2. Be EXTREMELY CONCISE - no lengthy explanations
3. Always cite sources (e.g. "[Source 1]" or "[Source 2, 3]")
4. Use the exact document title when citing (e.g. "Rauschecker & Scott (2009) - Nature Neuroscience"); never write placeholders like "Source 4"
5. If information is not in the sources, state this clearly
6. Use scientific but accessible language
7. For contradictory information, briefly mention both perspectives
8. Answer in English
${specificInstructions}

CONTEXT FROM DOCUMENTS:
${context}`
    }

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

    // Setup SSE
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // Stream Response
    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    })

    let fullText = ""

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        const text = chunk.delta.text
        fullText += text
        // Sende Text-Chunk an Client
        res.write(`data: ${JSON.stringify({ type: 'text', content: text })}\n\n`)
      }
    }

    console.log(`✅ Stream abgeschlossen (${fullText.length} Zeichen)`)

    if (containsInvalidCitation(fullText)) {
      throw new Error("Ungültige Zitierweise erkannt. Bitte erneut versuchen, ohne generische 'Quelle'-Referenzen.")
    }

    // Filtere: Nur tatsächlich zitierte Quellen
    const { matches, citationCount, unmatchedCitations } = filterReferencedSources(fullText, finalChunks)
    if (unmatchedCitations.length > 0) {
      throw new Error(`Zitate ohne Quelle gefunden: ${unmatchedCitations.join(", ")}`)
    }

    const sources = buildSourcePayloads(matches)
    if (citationCount > 0 && sources.length === 0) {
      throw new Error("Keine gültigen Quellenmetadaten für die verwendeten Zitate gefunden.")
    }

    const provenance = {
      retrievedChunkIds: finalChunks.map(chunk => chunk.id),
      usedChunkIds: sources.flatMap(source => source.chunkIds),
    }

    console.log(`📚 Sende ${sources.length} Quellen an Frontend`)

    // Sende Quellen am Ende
    res.write(`data: ${JSON.stringify({ type: 'sources', sources, provenance })}\n\n`)
    res.write('data: [DONE]\n\n')
    res.end()

  } catch (error: any) {
    console.error("❌ Fehler:", error)
    res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`)
    res.end()
  }
})

function canonicalChunkKey(chunk: DocumentChunk & { score: number }) {
  const sourcePath = chunk.metadata.source
    ?.replace(/^content\//, "")
    ?.replace(/\.md$/i, "")
    ?.toLowerCase()
    ?.replace(/\s+/g, " ")
  const titleKey = chunk.metadata.title
    ?.trim()
    ?.toLowerCase()
    ?.replace(/\s+/g, " ")
  return sourcePath || titleKey || chunk.id
}

/**
 * Chat Endpoint mit RAG (Non-Streaming für Kompatibilität)
 */
apiRouter.post("/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [], language = "de" } = req.body

    if (!message) {
      return res.status(400).json({ error: "Message ist erforderlich" })
    }

    if (!vectorStore) {
      return res.status(503).json({ error: "Vector Store nicht geladen" })
    }

    console.log(`\n💬 Query: "${message}"`)

    // Finde relevante Chunks (erhöht auf 30 für mehr Diversität!)
    const relevantChunks = await findRelevantChunks(message, 30)

    if (relevantChunks.length === 0) {
      return res.json({
        response:
          "Ich konnte keine relevanten Informationen in deinen Bachelorarbeit-Dokumenten finden. Kannst du deine Frage anders formulieren?",
        sources: [],
      })
    }

    console.log(`📚 ${relevantChunks.length} relevante Chunks gefunden`)
    console.log(`   Top Scores: ${relevantChunks.slice(0, 3).map(c => `${Math.round(c.score * 100)}%`).join(", ")}`)

    // Filtere Duplikate: Nur beste Chunk pro Datei
    const uniqueChunks = relevantChunks.reduce((acc: typeof relevantChunks, chunk) => {
      const existingIndex = acc.findIndex(c => c.metadata.source === chunk.metadata.source)
      if (existingIndex === -1) {
        acc.push(chunk)
      } else if (chunk.score > acc[existingIndex].score) {
        acc[existingIndex] = chunk
      }
      return acc
    }, [])

    // Limitiere auf maximal 8 eindeutige Quellen (erhöht von 5 für mehr Kontext!)
    const finalChunks = uniqueChunks.slice(0, 8)

    console.log(`📚 Verwende ${finalChunks.length} eindeutige Quellen (von ${relevantChunks.length} Chunks)`)
    finalChunks.forEach((c, i) => console.log(`   [${i+1}] ${c.metadata.title} (${Math.round(c.score * 100)}%)`))

    // Formatiere Kontext
    const context = formatContext(finalChunks)

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

    const systemPrompt = language === "de"
      ? `Du bist Mika, ein hilfreicher wissenschaftlicher Assistent, der Fragen zur Bachelorarbeit über auditorische Streams im Gehirn beantwortet.

WICHTIGE REGELN:
1. Beantworte Fragen ausschließlich basierend auf den bereitgestellten Quellen
2. Sei EXTREM PRÄGNANT - keine ausschweifenden Erklärungen
3. Zitiere Quellen DIREKT mit ihrem Namen in eckigen Klammern (z.B. "[FEF]" oder "[Bedini & Baldauf (2021)]")
4. NIEMALS Quellen in Überschriften (##, ###) einfügen - nur im Fließtext!
5. Verwende NUR Quellen, die du auch wirklich zitierst
6. Wenn die Informationen nicht in den Quellen enthalten sind, sage das klar
7. Verwende wissenschaftliche, aber zugängliche Sprache
8. Bei widersprüchlichen Informationen, erwähne beide Perspektiven kurz
9. Antworte auf Deutsch
${specificInstructions}

KONTEXT AUS DEN DOKUMENTEN:
${context}`
      : `You are Mika, a helpful scientific assistant answering questions about the bachelor thesis on auditory streams in the brain.

IMPORTANT RULES:
1. Answer questions exclusively based on the provided sources
2. Be EXTREMELY CONCISE - no lengthy explanations
3. Always cite sources (e.g. "[Source 1]" or "[Source 2, 3]")
4. If information is not in the sources, state this clearly
5. Use scientific but accessible language
6. For contradictory information, briefly mention both perspectives
7. Answer in English
${specificInstructions}

CONTEXT FROM DOCUMENTS:
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

    console.log(`✅ Antwort generiert (${assistantMessage.length} Zeichen)`)

    // Filtere: Nur tatsächlich zitierte Quellen
    if (containsInvalidCitation(assistantMessage)) {
      throw new Error("Ungültige Zitierweise erkannt. Bitte erneut versuchen, ohne generische 'Quelle'-Referenzen.")
    }

    const { matches, citationCount, unmatchedCitations } = filterReferencedSources(assistantMessage, finalChunks)
    if (unmatchedCitations.length > 0) {
      throw new Error(`Zitate ohne Quelle gefunden: ${unmatchedCitations.join(", ")}`)
    }

    const sources = buildSourcePayloads(matches)
    if (citationCount > 0 && sources.length === 0) {
      throw new Error("Keine gültigen Quellenmetadaten für die verwendeten Zitate gefunden.")
    }

    const provenance = {
      retrievedChunkIds: finalChunks.map(chunk => chunk.id),
      usedChunkIds: sources.flatMap(source => source.chunkIds),
    }

    console.log(`📚 Sende ${sources.length} Quellen an Frontend`)


    res.json({
      response: assistantMessage,
      sources,
      provenance,
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
apiRouter.post("/search", async (req, res) => {
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
apiRouter.get("/stats", (req, res) => {
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
apiRouter.get("/files", (req, res) => {
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
apiRouter.post("/reindex", async (req, res) => {
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

  // Unterstütze sowohl direkte als auch /rag/ Präfix-Anfragen
  app.use("/", apiRouter)
  app.use("/rag", apiRouter)

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
