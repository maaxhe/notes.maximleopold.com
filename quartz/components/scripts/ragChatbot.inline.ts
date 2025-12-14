// Auto-detect API URL based on environment
const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3030"
  : "https://server.maximleopold.com/rag"

// Get current page info (dynamically updated)
let currentPageTitle = document.querySelector("h1.article-title")?.textContent || "aktuelle Seite"

// Update current page title when navigating (for SPA-style navigation)
function updateCurrentPageTitle() {
  const newTitle = document.querySelector("h1.article-title")?.textContent || "aktuelle Seite"
  if (newTitle !== currentPageTitle) {
    currentPageTitle = newTitle
    console.log("📍 Seitenwechsel erkannt:", currentPageTitle)
  }
}

// Watch for page changes using MutationObserver
const observer = new MutationObserver(() => {
  updateCurrentPageTitle()
})

// Start observing the document title and body
observer.observe(document.body, {
  childList: true,
  subtree: true,
})

// Also update on popstate (browser back/forward)
window.addEventListener("popstate", updateCurrentPageTitle)

// Update on any link click
document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement
  if (target.tagName === "A" || target.closest("a")) {
    setTimeout(updateCurrentPageTitle, 100)
  }
})

// Toggle chat overlay
const fab = document.getElementById("rag-chat-fab")
const overlay = document.getElementById("rag-chat-overlay")
const closeBtn = document.getElementById("rag-chat-close")

function openChat() {
  overlay?.classList.remove("hidden")
  fab?.classList.add("hidden") // Hide FAB when chat is open
  document.body.style.overflow = "hidden" // Prevent background scroll
}

function closeChat() {
  overlay?.classList.add("hidden")
  fab?.classList.remove("hidden") // Show FAB when chat is closed
  document.body.style.overflow = "" // Restore scroll
}

fab?.addEventListener("click", openChat)
closeBtn?.addEventListener("click", closeChat)

// Close on overlay click (outside panel)
overlay?.addEventListener("click", (e) => {
  if (e.target === overlay) {
    closeChat()
  }
})

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !overlay?.classList.contains("hidden")) {
    closeChat()
  }
})

// Settings panel toggle
const settingsBtn = document.getElementById("rag-chat-settings")
const settingsPanel = document.getElementById("rag-settings-panel")

settingsBtn?.addEventListener("click", () => {
  settingsPanel?.classList.toggle("hidden")
  // Hide other panels
  historyPanel?.classList.add("hidden")
  citationPanel?.classList.add("hidden")
  writingPanel?.classList.add("hidden")
})

// History panel toggle
const historyBtn = document.getElementById("rag-chat-history")
const historyPanel = document.getElementById("rag-history-panel")
const historyList = document.getElementById("rag-history-list")
const historySearch = document.getElementById("rag-history-search") as HTMLInputElement | null
const historyClose = document.getElementById("rag-history-close")

historyBtn?.addEventListener("click", () => {
  historyPanel?.classList.toggle("hidden")
  // Hide other panels
  settingsPanel?.classList.add("hidden")
  citationPanel?.classList.add("hidden")
  writingPanel?.classList.add("hidden")

  if (!historyPanel?.classList.contains("hidden")) {
    renderHistoryList()
  }
})

historyClose?.addEventListener("click", () => {
  historyPanel?.classList.add("hidden")
})

// Citation Manager panel
const citationManagerBtn = document.getElementById("rag-citation-manager-btn")
const citationPanel = document.getElementById("rag-citation-panel")
const citationClose = document.getElementById("rag-citation-close")
const citationStats = document.getElementById("rag-citation-stats")
const citationList = document.getElementById("rag-citation-list")

citationManagerBtn?.addEventListener("click", () => {
  citationPanel?.classList.toggle("hidden")
  settingsPanel?.classList.add("hidden")
  historyPanel?.classList.add("hidden")
  writingPanel?.classList.add("hidden")

  if (!citationPanel?.classList.contains("hidden")) {
    renderCitationManager()
  }
})

citationClose?.addEventListener("click", () => {
  citationPanel?.classList.add("hidden")
})

// Writing Assistant panel
const writingAssistantBtn = document.getElementById("rag-writing-assistant-btn")
const writingPanel = document.getElementById("rag-writing-panel")
const writingClose = document.getElementById("rag-writing-close")
const writingBack = document.getElementById("rag-writing-back")

writingAssistantBtn?.addEventListener("click", () => {
  writingPanel?.classList.toggle("hidden")
  settingsPanel?.classList.add("hidden")
  historyPanel?.classList.add("hidden")
  citationPanel?.classList.add("hidden")
  if (!writingPanel?.classList.contains("hidden")) {
    renderWritingSources()
    showWritingFollowup(writingConversationHistory.length > 0)
  }
})

writingClose?.addEventListener("click", () => {
  writingPanel?.classList.add("hidden")
  showWritingFollowup(false)
})

writingBack?.addEventListener("click", () => {
  writingPanel?.classList.add("hidden")
  showWritingFollowup(false)
})

// Language toggle and translations
let currentLanguage = localStorage.getItem("rag-language") || "de"
const langBtn = document.getElementById("rag-chat-lang")
const langText = langBtn?.querySelector(".rag-lang-text")

// Translations object
const translations = {
  de: {
    welcomeMessage: "Hallo! Ich bin Mika, dein Bachelorarbeit-Assistent. Nutze die Buttons oben für schnelle Aktionen oder stelle mir eine Frage!",
    placeholder: "Frage zu deiner Bachelorarbeit... (tippe [[ für Dateiauswahl)",
    quickActions: {
      summary: "📄 Zusammenfassen",
      connectivity: "🔗 Connectivity anzeigen",
      compare: "🔄 Mit anderen vergleichen",
      literature: "📖 Literatur durchsuchen"
    },
    quickPrompts: {
      summary: "Fasse {currentFile} zusammen",
      connectivity: "Zeige alle Verbindungen und Connectivity von {currentFile}",
      compare: "Vergleiche {currentFile} mit verwandten Regionen. Zeige Unterschiede und Gemeinsamkeiten",
      literature: "Welche Paper und Studien diskutieren {currentFile}? Liste alle Quellen mit wichtigen Findings"
    },
    status: {
      searching: "Suche relevante Informationen...",
      generating: "Generiere Antwort...",
      cleared: "Chat wurde gelöscht",
      langChanged: "Sprache gewechselt zu Deutsch"
    },
    confirmClear: "Möchtest du wirklich den gesamten Chat löschen?",
    sendButton: "Senden",
    thinking: "Denke nach...",
    sourcesTitle: "📚 Quellen:"
  },
  en: {
    welcomeMessage: "Hello! I'm Mika, your bachelor thesis assistant. Use the buttons above for quick actions or ask me a question!",
    placeholder: "Question about your bachelor thesis... (type [[ for file selection)",
    quickActions: {
      summary: "📄 Summarize",
      connectivity: "🔗 Show connectivity",
      compare: "🔄 Compare with others",
      literature: "📖 Search literature"
    },
    quickPrompts: {
      summary: "Summarize {currentFile}",
      connectivity: "Show all connections and connectivity of {currentFile}",
      compare: "Compare {currentFile} with related regions. Show differences and similarities",
      literature: "Which papers and studies discuss {currentFile}? List all sources with key findings"
    },
    status: {
      searching: "Searching for relevant information...",
      generating: "Generating answer...",
      cleared: "Chat cleared",
      langChanged: "Language switched to English"
    },
    confirmClear: "Do you really want to clear the entire chat?",
    sendButton: "Send",
    thinking: "Thinking...",
    sourcesTitle: "📚 Sources:"
  }
}

// Get current translations
function t(key: string): string {
  const keys = key.split('.')
  let value: any = translations[currentLanguage as keyof typeof translations]
  for (const k of keys) {
    value = value[k]
  }
  return value
}

// Update all UI texts based on current language
function updateUILanguage() {
  // Update placeholder
  if (inputField) {
    inputField.placeholder = t('placeholder')
  }

  // Update quick action buttons
  const quickBtns = document.querySelectorAll('.rag-quick-btn')
  quickBtns.forEach((btn, idx) => {
    const types = ['summary', 'connectivity', 'compare', 'literature']
    const type = types[idx]
    if (type) {
      btn.textContent = t(`quickActions.${type}`)
      btn.setAttribute('data-prompt', t(`quickPrompts.${type}`))
    }
  })

  // Update language button
  if (langText) {
    langText.textContent = currentLanguage === "de" ? "EN" : "DE"
  }
}

// Initialize UI language
updateUILanguage()

langBtn?.addEventListener("click", () => {
  // Toggle language
  currentLanguage = currentLanguage === "de" ? "en" : "de"
  localStorage.setItem("rag-language", currentLanguage)

  // Update all UI texts
  updateUILanguage()

  // Show feedback
  setStatus(t('status.langChanged'), "info")
  setTimeout(() => setStatus(""), 2000)
})

// Clear chat button
const clearBtn = document.getElementById("rag-chat-clear")

clearBtn?.addEventListener("click", () => {
  // Bestätigungsdialog
  if (!confirm(t('confirmClear'))) {
    return
  }

  // Leere Konversationshistorie
  conversationHistory = []

  // Lösche alle Nachrichten
  if (messagesContainer) {
    messagesContainer.innerHTML = ""
  }

  // Füge Willkommensnachricht wieder hinzu
  addMessage("assistant", t('welcomeMessage'))

  // Visuelles Feedback
  setStatus(t('status.cleared'), "info")
  setTimeout(() => setStatus(""), 2000)
})

// Re-index button
const reindexBtn = document.getElementById("rag-reindex-btn")

// Helper function to poll for indexing completion
async function pollForIndexingCompletion(initialChunks: number) {
  const maxAttempts = 60 // 5 minutes (60 * 5 seconds)
  let attempts = 0

  const checkInterval = setInterval(async () => {
    attempts++

    try {
      const response = await fetch(`${API_URL}/health`)
      const data = await response.json()

      // Check if vector store is loaded and chunks count changed
      if (data.vectorStore === "loaded" && data.chunks !== initialChunks) {
        clearInterval(checkInterval)

        // Show success message
        addMessage(
          "assistant",
          `✅ Re-Indexierung abgeschlossen! Vector Store neu geladen mit ${data.chunks} Chunks.`,
        )

        // Visual feedback
        setStatus("Re-Indexierung erfolgreich abgeschlossen!", "info")
        setTimeout(() => setStatus(""), 3000)
      }

      // Timeout after 5 minutes
      if (attempts >= maxAttempts) {
        clearInterval(checkInterval)
        addMessage(
          "assistant",
          "⏱️ Re-Indexierung läuft noch. Bitte später den Status prüfen.",
        )
      }
    } catch (error) {
      console.error("Polling error:", error)
    }
  }, 5000) // Check every 5 seconds
}

reindexBtn?.addEventListener("click", async () => {
  if (!reindexBtn) return

  // Disable button and show loading state
  reindexBtn.setAttribute("disabled", "true")
  const originalText = reindexBtn.querySelector("span")?.textContent || ""
  const span = reindexBtn.querySelector("span")
  if (span) span.textContent = "Indizierung läuft..."

  try {
    // Get current chunk count before re-indexing
    const healthResponse = await fetch(`${API_URL}/health`)
    const healthData = await healthResponse.json()
    const initialChunks = healthData.chunks || 0

    const response = await fetch(`${API_URL}/reindex`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (response.ok) {
      // Show success message
      if (span) span.textContent = "✅ Gestartet!"

      // Add message to chat
      addMessage(
        "assistant",
        "Re-Indexierung wurde gestartet. Dies kann 3-5 Minuten dauern. Ich benachrichtige dich, sobald sie abgeschlossen ist...",
      )

      // Start polling for completion
      pollForIndexingCompletion(initialChunks)

      // Reset button after 3 seconds
      setTimeout(() => {
        if (span) span.textContent = originalText
        reindexBtn.removeAttribute("disabled")
      }, 3000)
    } else {
      throw new Error(data.error || "Fehler beim Starten der Re-Indexierung")
    }
  } catch (error) {
    console.error("Re-index error:", error)

    // Show error
    if (span) span.textContent = "❌ Fehler"
    addMessage(
      "assistant",
      `Fehler beim Starten der Re-Indexierung: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`,
    )

    // Reset button after 3 seconds
    setTimeout(() => {
      if (span) span.textContent = originalText
      reindexBtn.removeAttribute("disabled")
    }, 3000)
  }
})

// Quick action buttons
const quickBtns = document.querySelectorAll(".rag-quick-btn")
quickBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const prompt =
      btn.getAttribute("data-prompt")?.replace("{currentFile}", currentPageTitle) || ""
    const inputField = document.getElementById("rag-input") as HTMLTextAreaElement | null
    if (inputField && prompt) {
      inputField.value = prompt
      inputField.focus()
      // Auto-send
      sendMessage()
    }
  })
})

let conversationHistory: Array<{ role: string; content: string; sources?: any[] }> = []

// ===== CHAT HISTORY MANAGEMENT =====
interface ChatSession {
  id: string
  timestamp: number
  title: string
  messages: Array<{
    role: string
    content: string
    sources?: any[]
  }>
  citedSources: Set<string> // Für Citation Manager
}

let currentSessionId: string | null = null
let allCitedSources: Map<string, any> = new Map() // Global citation tracking

type ParsedSourceMeta = {
  authors: string
  year: string
  title: string
  venue: string
  label: string
  shortLabel: string
  url: string
}

const INTERNAL_SOURCE_HOSTS = ["notes.maximleopold.com", "maximleopold.com", "localhost", "127.0.0.1"]
const sourceMetaCache = new WeakMap<object, ParsedSourceMeta | null>()

function normalizeCitationKeyForClient(value?: string) {
  return (value || "")
    .toLowerCase()
    .replace(/[\[\]\(\)\.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function buildUrlFromSourcePath(path?: string, fallbackTitle?: string) {
  if (!path && !fallbackTitle) return "/"
  if (path?.startsWith("http")) {
    return path
  }
  const base = (path || fallbackTitle || "")
    .replace(/^content\//i, "")
    .replace(/\.md$/i, "")
  const slug = base
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
  return slug.startsWith("/") ? slug : `/${slug}`
}

function formatSourceUrlForDisplay(url: string) {
  if (!url) return ""
  try {
    const parsed = new URL(url, window.location.origin)
    if (parsed.origin === window.location.origin) {
      return parsed.pathname
    }
    return parsed.hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

function parseSourceMeta(source: any): ParsedSourceMeta | null {
  if (!source || typeof source !== "object") return null
  if (sourceMetaCache.has(source)) {
    return sourceMetaCache.get(source) || null
  }

  const citation = source.citation || source.bibliography || {}
  const rawTitle =
    citation.label ||
    source.title ||
    source.source?.split("/").pop()?.replace(/\.md$/, "") ||
    "Unbekannte Quelle"
  const venue =
    citation.venue ||
    source.bibliography?.venue ||
    source.category?.replace(/\.md$/i, "") ||
    "Internal Notes"
  const authors = citation.authors || rawTitle
  const year = citation.year || ""
  const title = citation.title || rawTitle
  const url = source.url || buildUrlFromSourcePath(source.source, rawTitle)

  if (url.startsWith("http")) {
    const lower = url.toLowerCase()
    if (INTERNAL_SOURCE_HOSTS.some(host => lower.includes(host))) {
      sourceMetaCache.set(source, null)
      return null
    }
  }

  const label = citation.label || rawTitle
  const shortLabel = citation.shortLabel || (year ? `${authors.split(/[,&]/)[0].trim()}, ${year}` : title)

  const meta: ParsedSourceMeta = {
    authors,
    year,
    title,
    venue,
    label,
    shortLabel,
    url,
  }

  sourceMetaCache.set(source, meta)
  return meta
}

// Lade Chat-Historie aus localStorage
function loadChatHistory(): ChatSession[] {
  try {
    const stored = localStorage.getItem('rag-chat-history')
    if (stored) {
      const sessions = JSON.parse(stored)
      // Convert citedSources back to Set
      return sessions.map((s: any) => ({
        ...s,
        citedSources: new Set(s.citedSources || [])
      }))
    }
  } catch (e) {
    console.error('Fehler beim Laden der Chat-Historie:', e)
  }
  return []
}

// Speichere Chat-Historie
function saveChatHistory(sessions: ChatSession[]) {
  try {
    // Convert Sets to Arrays for JSON
    const serializable = sessions.map(s => ({
      ...s,
      citedSources: Array.from(s.citedSources)
    }))
    localStorage.setItem('rag-chat-history', JSON.stringify(serializable))
  } catch (e) {
    console.error('Fehler beim Speichern der Chat-Historie:', e)
  }
}

// Erstelle neue Chat-Session
function createNewSession(firstMessage: string): ChatSession {
  const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const title = firstMessage.substring(0, 50) + (firstMessage.length > 50 ? '...' : '')

  return {
    id,
    timestamp: Date.now(),
    title,
    messages: [],
    citedSources: new Set()
  }
}

// Speichere aktuelle Session
function saveCurrentSession() {
  if (!currentSessionId || conversationHistory.length === 0) return

  const sessions = loadChatHistory()
  const sessionIndex = sessions.findIndex(s => s.id === currentSessionId)

  const currentSession: ChatSession = {
    id: currentSessionId,
    timestamp: Date.now(),
    title: sessions[sessionIndex]?.title || conversationHistory[0]?.content.substring(0, 50) || 'Neue Konversation',
    messages: conversationHistory.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      sources: msg.sources || []
    })),
    citedSources: new Set(allCitedSources.keys())
  }

  if (sessionIndex >= 0) {
    sessions[sessionIndex] = currentSession
  } else {
    sessions.unshift(currentSession) // Neueste zuerst
  }

  // Behalte max 50 Sessions
  if (sessions.length > 50) {
    sessions.splice(50)
  }

  saveChatHistory(sessions)
}

// Lade Session
function loadSession(sessionId: string) {
  const sessions = loadChatHistory()
  const session = sessions.find(s => s.id === sessionId)

  if (!session) return

  currentSessionId = sessionId
  conversationHistory = session.messages

  // Leere Chat und zeige geladene Nachrichten
  if (messagesContainer) {
    messagesContainer.innerHTML = ''

    session.messages.forEach(msg => {
      addMessage(msg.role as 'user' | 'assistant', msg.content, msg.sources)
    })
  }

  console.log(`📂 Session geladen: ${session.title}`)
}

// Rendere History List
function renderHistoryList(searchTerm = '') {
  const sessions = loadChatHistory()

  if (!historyList) return

  historyList.innerHTML = ''

  const filtered = searchTerm
    ? sessions.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : sessions

  if (filtered.length === 0) {
    historyList.innerHTML = '<div class="rag-history-empty">Keine Chats gefunden</div>'
    return
  }

  filtered.forEach(session => {
    const item = document.createElement('div')
    item.className = 'rag-history-item'
    if (session.id === currentSessionId) {
      item.classList.add('active')
    }

    const date = new Date(session.timestamp)
    const dateStr = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const timeStr = date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })

    item.innerHTML = `
      <div class="rag-history-item-content">
        <div class="rag-history-item-title">${session.title}</div>
        <div class="rag-history-item-meta">${dateStr} ${timeStr} • ${session.messages.length} Nachrichten</div>
      </div>
      <button class="rag-history-delete" data-session-id="${session.id}" title="Löschen">🗑️</button>
    `

    item.querySelector('.rag-history-item-content')?.addEventListener('click', () => {
      loadSession(session.id)
      historyPanel?.classList.add('hidden')
    })

    item.querySelector('.rag-history-delete')?.addEventListener('click', (e) => {
      e.stopPropagation()
      if (confirm('Chat wirklich löschen?')) {
        deleteSession(session.id)
        renderHistoryList(searchTerm)
      }
    })

    historyList.appendChild(item)
  })
}

// Lösche Session
function deleteSession(sessionId: string) {
  const sessions = loadChatHistory()
  const filtered = sessions.filter(s => s.id !== sessionId)
  saveChatHistory(filtered)

  if (currentSessionId === sessionId) {
    currentSessionId = null
    conversationHistory = []
    if (messagesContainer) {
      messagesContainer.innerHTML = ''
      addMessage('assistant', translations[currentLanguage].welcomeMessage)
    }
  }
}

// History Search
historySearch?.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement
  renderHistoryList(target.value)
})

// Rendere Citation Manager
function renderCitationManager() {
  if (!citationStats || !citationList) return

  const sources = Array.from(allCitedSources.values()).filter(source => parseSourceMeta(source))

  citationStats.innerHTML = `
    <div class="rag-citation-stat">
      <strong>${sources.length}</strong> Quellen gesammelt
    </div>
  `

  citationList.innerHTML = ''

  if (sources.length === 0) {
    citationList.innerHTML = '<div class="rag-citation-empty">Noch keine Quellen zitiert</div>'
    return
  }

  sources.forEach((source, idx) => {
    const meta = parseSourceMeta(source)
    if (!meta) return
    const item = document.createElement('div')
    item.className = 'rag-citation-item'
    item.innerHTML = `
      <span class="rag-citation-number">[${idx + 1}]</span>
      <span class="rag-citation-title">${meta.authors}${meta.year ? ` (${meta.year})` : ""} – ${meta.title}</span>
    `
    citationList.appendChild(item)
  })
}

// Export Citations
document.getElementById('rag-export-bibtex')?.addEventListener('click', () => {
  const bibtex = generateBibTeX(Array.from(allCitedSources.values()))
  downloadFile('citations.bib', bibtex)
})

document.getElementById('rag-export-apa')?.addEventListener('click', () => {
  const apa = generateAPA(Array.from(allCitedSources.values()))
  downloadFile('citations.txt', apa)
})

document.getElementById('rag-export-list')?.addEventListener('click', () => {
  const list = generateSimpleList(Array.from(allCitedSources.values()))
  downloadFile('citations.txt', list)
})

function generateBibTeX(sources: any[]): string {
  return sources
    .map((source, idx) => {
      const meta = parseSourceMeta(source)
      if (!meta) return null
      const url = source.url || source.source || meta.url
      return `@article{source${idx + 1},
  title={${meta.title}},
  author={${meta.authors}},
  year={${meta.year || "n.d."}},
  note={Source: ${url || "unknown"}}
}`
    })
    .filter(Boolean)
    .join('\n\n')
}

function generateAPA(sources: any[]): string {
  return sources
    .map(source => {
      const meta = parseSourceMeta(source)
      if (!meta) return null
      const url = source.url || source.source || meta.url
      return `${meta.authors}${meta.year ? ` (${meta.year})` : ""}. ${meta.title}. ${meta.venue}. Retrieved from ${url || "unknown"}`
    })
    .filter(Boolean)
    .join('\n\n')
}

function generateSimpleList(sources: any[]): string {
  return sources
    .map((source, idx) => {
      const meta = parseSourceMeta(source)
      if (!meta) return null
      const url = source.url || source.source || meta.url
      return `[${idx + 1}] ${meta.authors}${meta.year ? ` (${meta.year})` : ""} – ${meta.title}\n    ${url || ""}`
    })
    .filter(Boolean)
    .join('\n\n')
}

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Writing Assistant
const writingTemplateSelect = document.getElementById('rag-writing-template') as HTMLSelectElement | null
const writingDeliverableInput = document.getElementById('rag-writing-deliverable') as HTMLInputElement | null
const writingAudienceInput = document.getElementById('rag-writing-audience') as HTMLInputElement | null
const writingPurposeInput = document.getElementById('rag-writing-purpose') as HTMLInputElement | null
const writingQuestionsInput = document.getElementById('rag-writing-questions') as HTMLTextAreaElement | null
const writingConstraintsInput = document.getElementById('rag-writing-constraints') as HTMLTextAreaElement | null
const writingNotesInput = document.getElementById('rag-writing-notes') as HTMLTextAreaElement | null
const writingGapsInput = document.getElementById('rag-writing-gaps') as HTMLTextAreaElement | null
const writingGenerateBtn = document.getElementById('rag-writing-generate') as HTMLButtonElement | null
const writingOutput = document.getElementById('rag-writing-output')
const writingFollowupSection = document.getElementById('rag-writing-followup')
const writingFollowupInput = document.getElementById('rag-writing-followup-input') as HTMLTextAreaElement | null
const writingFollowupBtn = document.getElementById('rag-writing-send-followup') as HTMLButtonElement | null
const writingApproveBtn = document.getElementById('rag-writing-approve') as HTMLButtonElement | null
const writingSourceList = document.getElementById('rag-writing-source-list')
const writingSourceFilter = document.getElementById('rag-writing-source-filter') as HTMLInputElement | null

type WritingTemplateKey = "summary" | "assistant" | "blog"
const writingTemplates: Record<WritingTemplateKey, Partial<Record<string, string>>> = {
  summary: {
    deliverable: "Executive Summary (max. 300 Wörter)",
    audience: "Nur für mich – direkt & deutsch, Fokus auf Kernaussagen",
    purpose: "Nach 2 Minuten verstehe ich Status, Risiken und To-Dos",
    questions: "- Was ist aktuell passiert?\n- Welche Insights sind wichtig?\n- Welche offenen Punkte habe ich?",
    constraints: "Bullet-lastig, maximal 3 Abschnitte, klare Prioritäten.",
  },
  assistant: {
    deliverable: "Schreibassistenz für BA-Abschnitt",
    audience: "Betreuer:innen, wissenschaftlicher Ton",
    purpose: "Sauber strukturierter Absatz inkl. Zitaten/Anchors",
    questions: "- Welcher Kontext?\n- Welche Argumente müssen rein?\n- Welche Erkenntnisse/Quellen erwähnen?",
    constraints: "Strenger akademischer Stil, zitiere mit [[anchor]], keine Floskeln.",
  },
  blog: {
    deliverable: "Blogpost (600–800 Wörter)",
    audience: "Tech-Interessierte Leser:innen, locker aber präzise",
    purpose: "Verstehen Problem → Lösung → Impact, klicken CTA",
    questions: "- Welches Problem lösen wir?\n- Wie funktioniert die Lösung?\n- Was ist der Call-to-Action?",
    constraints: "Hook + 3 Abschnitte + CTA, aktive Sprache, keine Buzzwords.",
  },
}

const writingSelectedSources = new Set<string>()
let writingConversationHistory: Array<{ role: "user" | "assistant"; content: string }> = []
let writingSessionBrief = ""
let writingSessionSources: string[] = []

function applyWritingTemplate(template: WritingTemplateKey) {
  const data = writingTemplates[template] || {}
  if (data.deliverable && writingDeliverableInput) writingDeliverableInput.value = data.deliverable
  if (data.audience && writingAudienceInput) writingAudienceInput.value = data.audience
  if (data.purpose && writingPurposeInput) writingPurposeInput.value = data.purpose
  if (data.questions && writingQuestionsInput) writingQuestionsInput.value = data.questions
  if (data.constraints && writingConstraintsInput) writingConstraintsInput.value = data.constraints
}

writingTemplateSelect?.addEventListener('change', () => {
  const value = (writingTemplateSelect.value as WritingTemplateKey) || "summary"
  applyWritingTemplate(value)
})

if (writingTemplateSelect) {
  const initialTemplate = (writingTemplateSelect.value as WritingTemplateKey) || "summary"
  applyWritingTemplate(initialTemplate)
}

function renderWritingSources() {
  if (!writingSourceList) return
  const filter = writingSourceFilter?.value.trim().toLowerCase() ?? ""
  writingSourceList.innerHTML = ""

  const filtered = availableFiles
    .filter(file => file.toLowerCase().includes(filter))
    .slice(0, 200)

  if (!filtered.length) {
    const empty = document.createElement("div")
    empty.className = "rag-writing-source-empty"
    empty.textContent = filter ? "Keine Treffer." : "Keine Dateien verfügbar."
    writingSourceList.appendChild(empty)
    return
  }

  filtered.forEach(file => {
    const item = document.createElement("button")
    item.type = "button"
    item.className = `rag-writing-source ${writingSelectedSources.has(file) ? "selected" : ""}`
    item.textContent = file
    item.addEventListener("click", () => {
      if (writingSelectedSources.has(file)) {
        writingSelectedSources.delete(file)
      } else {
        writingSelectedSources.add(file)
      }
      renderWritingSources()
    })
    writingSourceList.appendChild(item)
  })
}

writingSourceFilter?.addEventListener('input', () => renderWritingSources())

type WritingBrief = {
  deliverable: string
  audience: string
  purpose: string
  keyQuestions: string[]
  constraints: string
  notes: string
  gaps: string[]
  sources: string[]
}

function collectWritingBrief(): WritingBrief | null {
  const deliverable = writingDeliverableInput?.value.trim()
  const audience = writingAudienceInput?.value.trim() || "nicht definiert"
  const purpose = writingPurposeInput?.value.trim()
  const keyQuestions = (writingQuestionsInput?.value || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
  const constraints = writingConstraintsInput?.value.trim() || "Keine zusätzlichen Constraints"
  const notes = writingNotesInput?.value.trim() || ""
  const gaps = (writingGapsInput?.value || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
  const sources = Array.from(writingSelectedSources)

  if (!deliverable) {
    alert("Bitte beschreibe das Deliverable.")
    writingDeliverableInput?.focus()
    return null
  }
  if (!purpose) {
    alert("Bitte erläutere das Ziel / den Erfolg.")
    writingPurposeInput?.focus()
    return null
  }
  if (!keyQuestions.length) {
    alert("Füge mindestens eine Key Question hinzu.")
    writingQuestionsInput?.focus()
    return null
  }
  if (!sources.length && !notes) {
    alert("Wähle mindestens eine Quelle oder füge zusätzliche Notizen hinzu.")
    writingSourceFilter?.focus()
    return null
  }

  return {
    deliverable,
    audience,
    purpose,
    keyQuestions,
    constraints,
    notes,
    gaps,
    sources,
  }
}

function buildSessionBriefText(brief: WritingBrief): string {
  const questionsText = brief.keyQuestions.map(q => `- ${q}`).join("\n")
  const sourcesText = brief.sources.length
    ? brief.sources.map(src => `[x] ${src}`).join("\n")
    : "[ ] (keine ausgewählten Dateien)"
  const gapsText = brief.gaps.length
    ? brief.gaps.map((gap, idx) => `${idx + 1}. ${gap}`).join("\n")
    : "1. -"

  return `Session Brief
- Deliverable: ${brief.deliverable}
- Audience & tone: ${brief.audience}
- Purpose/success metric: ${brief.purpose}
- Key questions to answer:
${questionsText}
- Constraints (length, POV, must/avoid):
${brief.constraints}
- Sources:
${sourcesText}
${brief.notes ? `Anchors / Notes:\n${brief.notes}\n` : ""}
- Gaps / Need from Claude:
${gapsText}`.trim()
}

type WritingTrigger = "outline" | "followup" | "approve"

function setWritingButtonsState(isLoading: boolean, trigger: WritingTrigger = "outline") {
  if (writingGenerateBtn) {
    writingGenerateBtn.disabled = isLoading
    writingGenerateBtn.textContent = isLoading && trigger === "outline" ? "⏳ Outline wird erstellt..." : "🧠 Outline anfordern"
  }
  if (writingFollowupBtn) {
    writingFollowupBtn.disabled = isLoading
    writingFollowupBtn.textContent = isLoading && trigger === "followup" ? "Sende..." : "Antwort senden"
  }
  if (writingApproveBtn) {
    writingApproveBtn.disabled = isLoading
    writingApproveBtn.textContent = isLoading && trigger === "approve" ? "Generiere Draft..." : "Outline freigeben & Draft schreiben"
  }
}

function showWritingFollowup(show: boolean) {
  if (!writingFollowupSection) return
  writingFollowupSection.classList.toggle("hidden", !show)
}

async function runWritingRequest(message: string, options: { resetHistory?: boolean; trigger?: WritingTrigger } = {}) {
  const { resetHistory = false, trigger = "outline" } = options
  if (!writingSessionSources.length) {
    alert("Bitte wähle zuerst Quellen aus.")
    return
  }

  if (resetHistory) {
    writingConversationHistory = []
  }

  setWritingButtonsState(true, trigger)
  if (writingOutput) {
    writingOutput.innerHTML = '<div class="rag-writing-loading">Mika arbeitet an deiner Antwort...</div>'
  }

  try {
    const response = await fetch(`${API_URL}/chat-stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "writing_assistant",
        message,
        conversationHistory: writingConversationHistory,
        language: currentLanguage,
        writingSources: writingSessionSources,
      }),
    })

    if (!response.ok) throw new Error("Fehler beim Schreiben")

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let fullText = ""

    while (reader) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split("\n")

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue
        const data = line.slice(6)
        if (data === "[DONE]") break

        try {
          const parsed = JSON.parse(data)
          if (parsed.type === "text") {
            fullText += parsed.content
            if (writingOutput) {
              writingOutput.innerHTML = `
                <div class="rag-writing-result">
                  ${formatMarkdown(fullText)}
                </div>
                <button class="rag-copy-writing" onclick="navigator.clipboard.writeText(\`${fullText.replace(/`/g, '\\`')}\`)">
                  📋 Kopieren
                </button>
              `
            }
          }
        } catch {
          // ignore chunk parse errors
        }
      }
    }

    writingConversationHistory = [
      ...writingConversationHistory,
      { role: "user", content: message },
      { role: "assistant", content: fullText },
    ]

    showWritingFollowup(true)
  } catch (error) {
    console.error("Writing Assistant Fehler:", error)
    const fallbackOk = await writingFallbackToChat(message)
    if (!fallbackOk && writingOutput) {
      writingOutput.innerHTML = '<div class="rag-writing-error">❌ Fehler beim Generieren</div>'
    }
  } finally {
    setWritingButtonsState(false, trigger)
  }
}

async function writingFallbackToChat(message: string) {
  if (!writingOutput) return false
  try {
    writingOutput.innerHTML = '<div class="rag-writing-loading">Streaming nicht verfügbar – nutze Backup-Endpunkt…</div>'
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "writing_assistant",
        message,
        conversationHistory: writingConversationHistory,
        language: currentLanguage,
        writingSources: writingSessionSources,
      }),
    })

    if (!response.ok) {
      throw new Error("Backup-Endpunkt nicht erreichbar")
    }

    const data = await response.json()
    const assistantText = data.response || "Keine Antwort vom Server."

    writingOutput.innerHTML = `
      <div class="rag-writing-result">
        ${formatMarkdown(assistantText)}
      </div>
      <button class="rag-copy-writing" onclick="navigator.clipboard.writeText(\`${assistantText.replace(/`/g, '\\`')}\`)">
        📋 Kopieren
      </button>
    `

    writingConversationHistory = [
      ...writingConversationHistory,
      { role: "user", content: message },
      { role: "assistant", content: assistantText },
    ]

    showWritingFollowup(true)
    return true
  } catch (err) {
    console.error("Writing Fallback Fehler:", err)
    return false
  }
}

writingGenerateBtn?.addEventListener("click", async () => {
  const brief = collectWritingBrief()
  if (!brief) return
  writingSessionBrief = buildSessionBriefText(brief)
  writingSessionSources = brief.sources
  writingConversationHistory = []
  writingFollowupInput && (writingFollowupInput.value = "")
  await runWritingRequest(writingSessionBrief, { resetHistory: true, trigger: "outline" })
})

writingFollowupBtn?.addEventListener("click", async () => {
  const reply = writingFollowupInput?.value.trim()
  if (!reply) {
    alert("Bitte gib eine Antwort ein.")
    return
  }
  await runWritingRequest(reply, { trigger: "followup" })
  if (writingFollowupInput) writingFollowupInput.value = ""
})

writingApproveBtn?.addEventListener("click", async () => {
  const extra = writingFollowupInput?.value.trim()
  const message = extra ? `${extra}\n\napprove outline` : "approve outline"
  await runWritingRequest(message, { trigger: "approve" })
  if (writingFollowupInput) writingFollowupInput.value = ""
})

const messagesContainer = document.getElementById("rag-messages")
const inputField = document.getElementById("rag-input") as HTMLTextAreaElement | null
const sendButton = document.getElementById("rag-send")
const statusDiv = document.getElementById("rag-status")

// Autocomplete für Wikilinks
const autocompleteContainer = document.getElementById("rag-autocomplete")
let availableFiles: string[] = []
let autocompleteVisible = false
let selectedIndex = -1
let wikilinkStart = -1

// Lade verfügbare Dateien
async function loadFiles() {
  try {
    const response = await fetch(`${API_URL}/files`)
    const data = await response.json()
    availableFiles = data.files || []
    console.log(`📁 ${availableFiles.length} Dateien geladen für Autocomplete`)
    renderWritingSources()
  } catch (error) {
    console.error("Fehler beim Laden der Dateien:", error)
  }
}

// Zeige Autocomplete
function showAutocomplete(filter: string) {
  if (!autocompleteContainer || !inputField) return

  const filtered = availableFiles.filter((file) =>
    file.toLowerCase().includes(filter.toLowerCase()),
  )

  if (filtered.length === 0) {
    autocompleteContainer.innerHTML = '<div class="rag-autocomplete-empty">Keine Dateien gefunden</div>'
    autocompleteContainer.classList.add("visible")
    autocompleteVisible = true
    selectedIndex = -1
    return
  }

  // Zeige max 10 Ergebnisse
  const items = filtered.slice(0, 10)
  autocompleteContainer.innerHTML = items
    .map(
      (file, idx) =>
        `<div class="rag-autocomplete-item" data-index="${idx}" data-file="${file}">${file}</div>`,
    )
    .join("")

  // Event Listener für Klick
  autocompleteContainer.querySelectorAll(".rag-autocomplete-item").forEach((item) => {
    item.addEventListener("click", () => {
      const fileName = item.getAttribute("data-file")
      if (fileName) insertWikilink(fileName)
    })
  })

  autocompleteContainer.classList.add("visible")
  autocompleteVisible = true
  selectedIndex = -1
}

// Verstecke Autocomplete
function hideAutocomplete() {
  autocompleteContainer?.classList.remove("visible")
  autocompleteVisible = false
  selectedIndex = -1
  wikilinkStart = -1
}

// Füge Wikilink ein
function insertWikilink(fileName: string) {
  if (!inputField) return

  const text = inputField.value
  const beforeLink = text.substring(0, wikilinkStart)
  const afterCursor = text.substring(inputField.selectionStart)

  inputField.value = `${beforeLink}[[${fileName}]]${afterCursor}`
  const newCursorPos = beforeLink.length + fileName.length + 4 // nach ]]
  inputField.setSelectionRange(newCursorPos, newCursorPos)
  inputField.focus()

  hideAutocomplete()
}

// Handle keyboard navigation in autocomplete
function handleAutocompleteKeydown(e: KeyboardEvent) {
  if (!autocompleteVisible) return

  const items = autocompleteContainer?.querySelectorAll(".rag-autocomplete-item")
  if (!items || items.length === 0) return

  if (e.key === "ArrowDown") {
    e.preventDefault()
    e.stopPropagation()
    selectedIndex = Math.min(selectedIndex + 1, items.length - 1)
    updateSelection(items)
  } else if (e.key === "ArrowUp") {
    e.preventDefault()
    e.stopPropagation()
    selectedIndex = Math.max(selectedIndex - 1, -1)
    updateSelection(items)
  } else if (e.key === "Enter" && selectedIndex >= 0) {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    const selectedItem = items[selectedIndex]
    const fileName = selectedItem?.getAttribute("data-file")
    if (fileName) insertWikilink(fileName)
    return false
  } else if (e.key === "Escape") {
    e.preventDefault()
    e.stopPropagation()
    hideAutocomplete()
  }
}

function updateSelection(items: NodeListOf<Element>) {
  items.forEach((item, idx) => {
    if (idx === selectedIndex) {
      item.classList.add("selected")
      item.scrollIntoView({ block: "nearest" })
    } else {
      item.classList.remove("selected")
    }
  })
}

// Input event listener für Autocomplete
inputField?.addEventListener("input", (e) => {
  if (!inputField) return

  const text = inputField.value
  const cursorPos = inputField.selectionStart

  // Suche nach [[ vor dem Cursor
  const beforeCursor = text.substring(0, cursorPos)
  const match = beforeCursor.match(/\[\[([^\]]*)$/)

  if (match) {
    // [[ gefunden
    wikilinkStart = beforeCursor.lastIndexOf("[[")
    const searchTerm = match[1]
    showAutocomplete(searchTerm)
  } else {
    // Kein [[ gefunden
    hideAutocomplete()
  }
})

// Keyboard navigation
inputField?.addEventListener("keydown", handleAutocompleteKeydown)

// Verstecke Autocomplete bei Klick außerhalb
document.addEventListener("click", (e) => {
  if (
    autocompleteVisible &&
    !autocompleteContainer?.contains(e.target as Node) &&
    e.target !== inputField
  ) {
    hideAutocomplete()
  }
})

// Lade Dateien beim Start
loadFiles()

function canonicalSourceKey(source: any) {
  if (source?.id) {
    return String(source.id)
  }

  const pathKey = source?.source
    ? source.source
        .replace(/^content\//, "")
        .replace(/\.md$/i, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
    : ""
  const titleKey = source?.title
    ? String(source.title)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
    : ""
  return pathKey || titleKey || JSON.stringify(source ?? {}).toLowerCase()
}

function normalizeSourcesList(sources: any[] = []) {
  const seen = new Map<string, any>()
  for (const source of sources ?? []) {
    const key = canonicalSourceKey(source)
    if (!key) continue
    const existing = seen.get(key)
    if (!existing) {
      const cloned = { ...source }
      if (source?.chunkIds) {
        cloned.chunkIds = Array.from(new Set(source.chunkIds))
      }
      seen.set(key, cloned)
    } else {
      const merged = { ...existing }
      const chunkIds = [
        ...(existing.chunkIds ?? []),
        ...(source?.chunkIds ?? []),
      ]
      if (chunkIds.length) {
        merged.chunkIds = Array.from(new Set(chunkIds))
      }
      if ((source?.score ?? 0) > (existing?.score ?? 0)) {
        Object.assign(merged, source)
        if (chunkIds.length) {
          merged.chunkIds = Array.from(new Set(chunkIds))
        }
      }
      if (source?.citation && !existing?.citation) {
        merged.citation = source.citation
      }
      if (source?.bibliography && !existing?.bibliography) {
        merged.bibliography = source.bibliography
      }
      if (!merged.url && source?.url) {
        merged.url = source.url
      }
      if (!merged.source && source?.source) {
        merged.source = source.source
      }
      seen.set(key, merged)
    }
  }
  return Array.from(seen.values())
}

const CITATION_REGEX = /(?<!\[)\[([^\]]+)\](?!\])/g

function enrichSourcesWithCitations(content: string, sources: any[] = []) {
  CITATION_REGEX.lastIndex = 0
  return normalizeSourcesList(sources)
}

// Hilfsfunktion: Formatiere Markdown
function formatMarkdown(content: string, sources: any[] = []): string {
  const normalizedSources = normalizeSourcesList(sources)
  const sourceEntries = normalizedSources
    .map(source => ({ source, meta: parseSourceMeta(source) }))
    .filter(entry => entry.meta) as Array<{ source: any; meta: ParsedSourceMeta }>

  // Formatiere Wikilinks [[File]] zu schönen Links
  let formatted = content.replace(/\[\[([^\]]+)\]\]/g, (_match, linkText) => {
    const slug = linkText.trim().replace(/\s+/g, '-')
    return `<a href="/${slug}" class="rag-wikilink" data-link="${linkText}">${linkText}</a>`
  })

  // Formatiere Quellen-Zitate [Source Name] zu klickbaren Links
  // Wichtig: NUR Single-Bracket-Zitate, NICHT [[Wikilinks]]
  if (sourceEntries.length > 0) {
    const citationIndex = new Map<string, ParsedSourceMeta>()
    sourceEntries.forEach(({ meta, source }) => {
      const candidates = [
        normalizeCitationKeyForClient(source.title),
        normalizeCitationKeyForClient(meta.label),
        normalizeCitationKeyForClient(meta.shortLabel),
        normalizeCitationKeyForClient(meta.title),
      ]
      candidates.forEach(key => {
        if (key) {
          citationIndex.set(key, meta)
        }
      })
    })

    formatted = formatted.replace(/(?<!\[)\[([^\]]+)\](?!\])/g, (match, citationText) => {
      const key = normalizeCitationKeyForClient(citationText)
      const meta = citationIndex.get(key)
      if (!meta) {
        return match
      }
      const label = meta.year ? `${meta.authors}, ${meta.year}` : meta.title
      const citation = `(${label})`
      const href = meta.url || "#"
      return `<a href="${href}" class="rag-source-cite" target="_blank" rel="noopener noreferrer">${citation}</a>`
    })
  }

  // Formatiere Markdown-Überschriften und Text
  formatted = formatted.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
  formatted = formatted.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
  formatted = formatted.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  formatted = formatted.replace(/(?<!\w)_(.+?)_(?!\w)/g, '<em>$1</em>')
  formatted = formatted.replace(/\n/g, '<br>')

  return formatted
}

// Hilfsfunktion: Füge Quellen zur Nachricht hinzu
function addSourcesToMessage(messageDiv: HTMLElement, sources: any[]) {
  const normalizedSources = normalizeSourcesList(sources)
    .map(source => ({ source, meta: parseSourceMeta(source) }))
    .filter(entry => entry.meta) as Array<{ source: any; meta: ParsedSourceMeta }>

  if (!normalizedSources.length) {
    return
  }

  const sourcesDiv = document.createElement("div")
  sourcesDiv.className = "rag-message-sources"

  const sourcesTitle = document.createElement("div")
  sourcesTitle.className = "rag-sources-title"
  sourcesTitle.textContent = t('sourcesTitle')
  sourcesDiv.appendChild(sourcesTitle)

  console.log(`📚 Zeige ${normalizedSources.length} Quellen`)

  normalizedSources.forEach(({ source, meta }) => {
    const sourceItem = document.createElement("div")
    sourceItem.className = "rag-source-item"

    const url = meta.url || "/"
    const venueText = meta.venue ? `<div class="rag-source-meta">${meta.venue}</div>` : ""
    const label = meta.year ? `${meta.authors} (${meta.year})` : meta.authors

    sourceItem.innerHTML = `
      <div class="rag-source-title">
        <a href="${url}" target="_blank" rel="noopener noreferrer">
          ${label}${meta.title ? ` – ${meta.title}` : ""}
        </a>
      </div>
      ${venueText}
    `
    sourcesDiv.appendChild(sourceItem)
  })

  messageDiv.appendChild(sourcesDiv)
}

// Hilfsfunktion: Füge Copy-Button hinzu
function addCopyButton(contentDiv: HTMLElement, content: string) {
  const copyBtn = document.createElement("button")
  copyBtn.className = "rag-copy-btn"
  copyBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  `
  copyBtn.title = "Kopieren"

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(content)
      copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `
      copyBtn.classList.add("copied")
      setTimeout(() => {
        copyBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        `
        copyBtn.classList.remove("copied")
      }, 2000)
    } catch (err) {
      console.error("Fehler beim Kopieren:", err)
    }
  })

  contentDiv.appendChild(copyBtn)
}

function renderAssistantResponse(text: string, sources: any[] = []) {
  if (!messagesContainer) return null
  const messageDiv = document.createElement("div")
  messageDiv.className = "rag-message assistant"
  const contentDiv = document.createElement("div")
  contentDiv.className = "rag-message-content"
  contentDiv.innerHTML = formatMarkdown(text, sources)
  messageDiv.appendChild(contentDiv)
  messagesContainer.appendChild(messageDiv)
  messagesContainer.scrollTop = messagesContainer.scrollHeight
  return { messageDiv, contentDiv }
}

function finalizeAssistantInteraction(
  messageDiv: HTMLElement,
  contentDiv: HTMLElement,
  userMessage: string,
  assistantText: string,
  sources: any[] = [],
) {
  const preparedSources = enrichSourcesWithCitations(assistantText, sources)
  addSourcesToMessage(messageDiv, preparedSources)

  addCopyButton(contentDiv, assistantText)

  const storedSources = normalizeSourcesList(preparedSources)
  conversationHistory.push(
    { role: "user", content: userMessage },
    { role: "assistant", content: assistantText, sources: storedSources },
  )

  if (storedSources.length > 0) {
    storedSources.forEach(source => {
      const meta = parseSourceMeta(source)
      if (!meta) return
      const key = source.id || source.source || source.title
      if (key && !allCitedSources.has(key)) {
        allCitedSources.set(key, { ...source })
      }
    })
    console.log(`📖 Citation Manager: ${allCitedSources.size} Quellen gesammelt`)
  }

  if (!currentSessionId) {
    const newSession = createNewSession(userMessage)
    currentSessionId = newSession.id
  }
  saveCurrentSession()
}

function addMessage(
  role: string,
  content: string,
  sources: Array<{
    title?: string
    category?: string
    type: string
    score: number
    excerpt: string
  }> | null = null,
) {
  const messageDiv = document.createElement("div")
  messageDiv.className = `rag-message ${role}`

  const contentDiv = document.createElement("div")
  contentDiv.className = "rag-message-content"

  // Formatiere Wikilinks [[File]] zu schönen Links
  let formattedContent = content.replace(/\[\[([^\]]+)\]\]/g, (_match, linkText) => {
    // Erstelle URL-freundlichen Slug (Leerzeichen zu Bindestrichen, etc.)
    const slug = linkText.trim().replace(/\s+/g, '-')
    return `<a href="/${slug}" class="rag-wikilink" data-link="${linkText}">${linkText}</a>`
  })

  // Formatiere Markdown
  // Headlines - wichtig: größere Überschriften zuerst!
  formattedContent = formattedContent.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')  // ### → h3
  formattedContent = formattedContent.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')   // ## → h2
  formattedContent = formattedContent.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')    // # → h1

  // Bold (**Text**)
  formattedContent = formattedContent.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Italic (_Text_)
  formattedContent = formattedContent.replace(/(?<!\w)_(.+?)_(?!\w)/g, '<em>$1</em>')

  // Newlines zu <br> (damit Zeilenumbrüche sichtbar werden)
  formattedContent = formattedContent.replace(/\n/g, '<br>')

  contentDiv.innerHTML = formattedContent
  messageDiv.appendChild(contentDiv)

  // Füge Copy-Button für Assistant-Nachrichten hinzu
  if (role === "assistant") {
    const copyBtn = document.createElement("button")
    copyBtn.className = "rag-copy-btn"
    copyBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    `
    copyBtn.title = "Kopieren"

    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(content)

        // Visuelles Feedback
        copyBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `
        copyBtn.classList.add("copied")

        // Reset nach 2 Sekunden
        setTimeout(() => {
          copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          `
          copyBtn.classList.remove("copied")
        }, 2000)
      } catch (err) {
        console.error("Fehler beim Kopieren:", err)
      }
    })

    contentDiv.appendChild(copyBtn)
  }

  // Füge Quellen hinzu, falls vorhanden
  if (sources && sources.length > 0) {
    addSourcesToMessage(messageDiv, sources)
  }

  if (messagesContainer) {
    messagesContainer.appendChild(messageDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }
}

function setStatus(message: string, type: string = "info") {
  if (!statusDiv) return
  if (message) {
    statusDiv.textContent = message
    statusDiv.className = `rag-chatbot-status ${type}`
    statusDiv.style.display = "block"
  } else {
    statusDiv.style.display = "none"
  }
}

function setLoading(isLoading: boolean) {
  if (!sendButton || !inputField) return
  ;(sendButton as HTMLButtonElement).disabled = isLoading
  inputField.disabled = isLoading

  if (isLoading) {
    sendButton.innerHTML = `<span class="rag-loading-spinner"></span> ${t('thinking')}`
  } else {
    sendButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          ${t('sendButton')}
        `
  }
}

async function sendMessage() {
  if (!inputField) return
  let userMessage = inputField.value.trim()

  if (!userMessage) return

  // Parse wikilinks [[FEF]] and add context
  let enrichedMessage = userMessage
  const wikilinkRegex = /\[\[([^\]]+)\]\]/g
  const wikilinks = [...userMessage.matchAll(wikilinkRegex)]

  if (wikilinks.length > 0) {
    // Extract wikilink terms
    const terms = wikilinks.map(match => match[1])
    // Add context to help find the right file
    enrichedMessage = `${userMessage} (Suche gezielt nach Informationen über: ${terms.join(", ")})`
  }

  // Add current page context if available
  if (currentPageTitle && currentPageTitle !== "aktuelle Seite") {
    enrichedMessage = `[Kontext: Nutzer ist auf Seite "${currentPageTitle}"] ${enrichedMessage}`
  }

  // Debug logging
  console.log("🔍 Original Message:", userMessage)
  console.log("🔍 Enriched Message:", enrichedMessage)
  console.log("🔍 Current Page:", currentPageTitle)

  // Zeige User-Nachricht (original, ohne Kontext)
  addMessage("user", userMessage)
  inputField.value = ""
  setLoading(true)
  setStatus(t('status.searching'))

  try {
    // Überprüfe Server-Status
    const healthCheck = await fetch(`${API_URL}/health`)
    if (!healthCheck.ok) {
      throw new Error("Server ist nicht erreichbar")
    }

    setStatus(t('status.generating'))

    // Erstelle leere Assistenten-Nachricht für Streaming
    const messageDiv = document.createElement("div")
    messageDiv.className = "rag-message assistant"

    const contentDiv = document.createElement("div")
    contentDiv.className = "rag-message-content"
    messageDiv.appendChild(contentDiv)

    if (messagesContainer) {
      messagesContainer.appendChild(messageDiv)
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }

    let fullResponse = ""
    let sources: any[] = []

    try {
      // Sende Streaming-Request
      const response = await fetch(`${API_URL}/chat-stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: enrichedMessage,
          conversationHistory,
          language: currentLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error("Server-Fehler")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("Stream nicht verfügbar")
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              break
            }

            try {
              const parsed = JSON.parse(data)

              if (parsed.type === 'text') {
                fullResponse += parsed.content
                const preparedSources = enrichSourcesWithCitations(fullResponse, sources)
                contentDiv.innerHTML = formatMarkdown(fullResponse, preparedSources)
                messagesContainer!.scrollTop = messagesContainer!.scrollHeight
              } else if (parsed.type === 'sources') {
                sources = normalizeSourcesList(parsed.sources || [])
                const preparedSources = enrichSourcesWithCitations(fullResponse, sources)
                contentDiv.innerHTML = formatMarkdown(fullResponse, preparedSources)
              } else if (parsed.type === 'error') {
                throw new Error(parsed.error)
              }
            } catch (e) {
              // Ignoriere Parse-Fehler für unvollständige Chunks
            }
          }
        }
      }

      console.log("📚 Sources from server:", sources)
      console.log("📚 Number of sources:", sources?.length || 0)

      finalizeAssistantInteraction(messageDiv, contentDiv, userMessage, fullResponse, sources || [])
    } catch (streamError) {
      console.error("Streaming-Fehler:", streamError)
      // Fallback: Entferne leere Nachricht und zeige Fehler
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv)
      }

      const fallbackSuccess = await fallbackToChatEndpoint(enrichedMessage, userMessage)
      if (fallbackSuccess) {
        return
      }
      throw streamError
    }

    setStatus("")
  } catch (error: any) {
    console.error("Error:", error)
    addMessage(
      "assistant",
      `❌ Fehler: ${error.message}\n\nStelle sicher, dass der RAG-Server läuft (npm run rag:server).`,
    )
    setStatus("Fehler bei der Verbindung zum Server", "error")

    setTimeout(() => setStatus(""), 3000)
  } finally {
    setLoading(false)
  }
}

async function fallbackToChatEndpoint(enrichedMessage: string, userMessage: string) {
  try {
    setStatus("Streaming nicht verfügbar – nutze Backup-Endpunkt", "warning")
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: enrichedMessage,
        conversationHistory,
        language: currentLanguage,
      }),
    })

    if (!response.ok) {
      throw new Error("Backup-Endpunkt nicht erreichbar")
    }

    const data = await response.json()
    const assistantText = data.response || "Der Server hat keine Antwort zurückgegeben."
    const sources = normalizeSourcesList(data.sources || [])

    const rendered = renderAssistantResponse(assistantText, sources)
    if (!rendered) {
      return false
    }

    finalizeAssistantInteraction(rendered.messageDiv, rendered.contentDiv, userMessage, assistantText, sources)
    setStatus("")
    return true
  } catch (fallbackError) {
    console.error("Fallback-Fehler:", fallbackError)
    setStatus("Fehler bei der Verbindung zum Server", "error")
    setTimeout(() => setStatus(""), 3000)
    return false
  }
}

// Link-Button: Fügt [[ zum Input hinzu
const linkBtn = document.getElementById("rag-link-btn")

linkBtn?.addEventListener("click", () => {
  if (!inputField) return

  const cursorPos = inputField.selectionStart
  const textBefore = inputField.value.substring(0, cursorPos)
  const textAfter = inputField.value.substring(inputField.selectionEnd)

  // Füge [[ ein
  inputField.value = textBefore + "[[" + textAfter

  // Setze Cursor nach [[
  const newCursorPos = cursorPos + 2
  inputField.setSelectionRange(newCursorPos, newCursorPos)
  inputField.focus()

  // Trigger Autocomplete
  const event = new Event("input", { bubbles: true })
  inputField.dispatchEvent(event)
})

// Event Listeners
sendButton?.addEventListener("click", sendMessage)

inputField?.addEventListener("keydown", (e) => {
  // Wenn Autocomplete sichtbar ist und ein Item ausgewählt ist, nicht senden
  if (e.key === "Enter" && autocompleteVisible && selectedIndex >= 0) {
    // Lass handleAutocompleteKeydown das Event behandeln
    return
  }

  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
})

// Auto-resize textarea
inputField?.addEventListener("input", () => {
  if (inputField) {
    inputField.style.height = "auto"
    inputField.style.height = inputField.scrollHeight + "px"
  }
})

// Überprüfe Server-Status beim Laden
fetch(`${API_URL}/health`)
  .then((res) => res.json())
  .then((data) => {
    if (data.vectorStore !== "loaded") {
      setStatus(
        '⚠️ Vector Store nicht geladen. Führe zuerst "npm run rag:index" aus.',
        "warning",
      )
    }
  })
  .catch(() => {
    setStatus('⚠️ RAG-Server ist offline. Starte ihn mit "npm run rag:server".', "warning")
  })
