const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
// Use same-origin API path to avoid CORS issues; coxilab is the actual backend host
const API_URL = isLocalhost ? "http://localhost:3030" : "https://notes.coxilab.de/api/rag"

function normalizeBase(url: string | null | undefined) {
  if (!url) return null
  return url.replace(/\/+$/, "")
}

const apiBaseCandidates = (() => {
  const candidates = new Set<string>()
  const initial = normalizeBase(API_URL)
  if (initial) {
    candidates.add(initial)
  }
  return Array.from(candidates)
})()

let activeApiBase = apiBaseCandidates[0]

type FetchApiOptions = {
  retryOn404?: boolean
}

async function fetchApi(path: string, init?: RequestInit, options: FetchApiOptions = {}) {
  const { retryOn404 = true } = options
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const orderedBases = [activeApiBase, ...apiBaseCandidates.filter(base => base !== activeApiBase)]
  let lastError: any = null
  let lastResponse: Response | null = null

  for (const base of orderedBases) {
    const url = `${base}${normalizedPath}`
    try {
      const response = await fetch(url, init)
      if (response.status === 404 && retryOn404 && base !== orderedBases[orderedBases.length - 1]) {
        lastResponse = response
        continue
      }
      if (response.ok) {
        activeApiBase = base
      }
      return response
    } catch (error) {
      lastError = error
      continue
    }
  }

  if (lastResponse) {
    return lastResponse
  }

  if (lastError) {
    throw lastError
  }

  throw new Error("Server ist nicht erreichbar")
}

// Get current page info (dynamically updated)
let currentPageTitle = document.querySelector("h1.article-title")?.textContent?.trim() || "aktuelle Seite"

// Extracts full rendered page content including transcluded ![[...]] embeds
function extractPageContent(): string {
  const article = document.querySelector("article.popover-hint, .page-content, article, main")
  if (!article) return ""
  const clone = article.cloneNode(true) as HTMLElement
  // Remove noise: scripts, styles, nav, the chatbot itself
  clone.querySelectorAll("script, style, nav, .rag-chatbot, .sidebar").forEach(el => el.remove())
  const text = (clone as HTMLElement).innerText || clone.textContent || ""
  return text.trim().slice(0, 6000)
}

// Update current page title when navigating (for SPA-style navigation)
function updateCurrentPageTitle() {
  const newTitle = document.querySelector("h1.article-title")?.textContent?.trim() || "aktuelle Seite"
  if (newTitle !== currentPageTitle) {
    currentPageTitle = newTitle
    console.log("📍 Seitenwechsel erkannt:", currentPageTitle)
    updatePageBadge()
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
const expandBtn = document.getElementById("rag-chat-expand")
let isFullscreen = false
let chatInitialized = false

// ⋯ Mehr-Menü
const moreBtn = document.getElementById("rag-chat-more")
const moreDropdown = document.getElementById("rag-more-dropdown")

moreBtn?.addEventListener("click", (e) => {
  e.stopPropagation()
  moreDropdown?.classList.toggle("hidden")
  moreBtn.classList.toggle("active")
})

// Close dropdown when clicking outside
document.addEventListener("click", () => {
  if (!moreDropdown?.classList.contains("hidden")) {
    moreDropdown?.classList.add("hidden")
    moreBtn?.classList.remove("active")
  }
})

function updatePageBadge() {
  const badge = document.getElementById("rag-page-badge")
  if (!badge) return
  if (currentPageTitle && currentPageTitle !== "aktuelle Seite") {
    badge.textContent = currentPageTitle
    badge.classList.add("visible")
  } else {
    badge.classList.remove("visible")
  }
}

function updateWelcomeMessage() {
  const welcomeEl = document.querySelector("#rag-messages .rag-message.assistant .rag-message-content")
  if (welcomeEl && currentPageTitle && currentPageTitle !== "aktuelle Seite") {
    welcomeEl.innerHTML = `Hallo! Ich bin <strong>Mika</strong>, dein KI-Assistent.<br>Ich sehe gerade <em>${currentPageTitle}</em> – stell mir eine Frage!`
  }
  updatePageBadge()
}

function openChat() {
  overlay?.classList.remove("hidden")
  fab?.classList.add("hidden")
  document.body.style.overflow = "hidden"
  // Dynamische Begrüssung beim ersten Öffnen
  if (!chatInitialized) {
    chatInitialized = true
    updateWelcomeMessage()
  }
}

function closeChat() {
  // Speichere Session bevor Chat geschlossen wird
  saveCurrentSession()
  overlay?.classList.add("hidden")
  fab?.classList.remove("hidden")
  document.body.style.overflow = ""
  if (isFullscreen) {
    toggleFullscreen(false)
  }
  hideWritingAutocompleteMenu()
}

fab?.addEventListener("click", openChat)
closeBtn?.addEventListener("click", closeChat)

// Close on overlay click (outside panel)
overlay?.addEventListener("click", (e) => {
  if (e.target === overlay) {
    closeChat()
  }
})

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Escape: Chat schließen
  if (e.key === "Escape" && !overlay?.classList.contains("hidden")) {
    closeChat()
    return
  }
  // Cmd/Ctrl+K: Chat öffnen/schließen (kein Konflikt mit Browser)
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    const activeEl = document.activeElement as HTMLElement
    // Nicht auslösen wenn User in einem Input/Textarea tippt (ausser im Chat)
    const inChatInput = activeEl?.id === "rag-input"
    if (!inChatInput) {
      e.preventDefault()
      if (overlay?.classList.contains("hidden")) {
        openChat()
        setTimeout(() => (document.getElementById("rag-input") as HTMLTextAreaElement)?.focus(), 100)
      } else {
        closeChat()
      }
    }
  }
})

function toggleFullscreen(force?: boolean) {
  const shouldEnable = force !== undefined ? force : !isFullscreen
  isFullscreen = shouldEnable
  overlay?.classList.toggle("fullscreen", shouldEnable)
  overlay?.querySelector('.rag-chat-panel')?.classList.toggle("fullscreen", shouldEnable)
  expandBtn?.classList.toggle("active", shouldEnable)
}

expandBtn?.addEventListener("click", () => {
  toggleFullscreen()
})

// Features panel toggle
const featuresBtn = document.getElementById("rag-chat-features")
const featuresPanel = document.getElementById("rag-features-panel")

featuresBtn?.addEventListener("click", () => {
  featuresPanel?.classList.toggle("hidden")
  // Hide other panels
  settingsPanel?.classList.add("hidden")
  historyPanel?.classList.add("hidden")
  citationPanel?.classList.add("hidden")
  writingPanel?.classList.add("hidden")
})

// Settings panel toggle
const settingsBtn = document.getElementById("rag-chat-settings")
const settingsPanel = document.getElementById("rag-settings-panel")

settingsBtn?.addEventListener("click", () => {
  settingsPanel?.classList.toggle("hidden")
  // Hide other panels
  featuresPanel?.classList.add("hidden")
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
  featuresPanel?.classList.add("hidden")
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
const citationHome = document.getElementById("rag-citation-home")
const citationStats = document.getElementById("rag-citation-stats")
const citationList = document.getElementById("rag-citation-list")

citationManagerBtn?.addEventListener("click", () => {
  citationPanel?.classList.toggle("hidden")
  featuresPanel?.classList.add("hidden")
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

citationHome?.addEventListener("click", () => {
  window.location.href = "/"
})

// Timeline View panel
const timelineBtn = document.getElementById("rag-timeline-btn")
const timelinePanel = document.getElementById("rag-timeline-panel")
const timelineClose = document.getElementById("rag-timeline-close")
const timelineHome = document.getElementById("rag-timeline-home")
const timelineTopicInput = document.getElementById("rag-timeline-topic") as HTMLInputElement | null
const timelineGenerateBtn = document.getElementById("rag-timeline-generate-btn")
const timelineOutput = document.getElementById("rag-timeline-output")

timelineBtn?.addEventListener("click", () => {
  timelinePanel?.classList.toggle("hidden")
  featuresPanel?.classList.add("hidden")
  settingsPanel?.classList.add("hidden")
  historyPanel?.classList.add("hidden")
  citationPanel?.classList.add("hidden")
  writingPanel?.classList.add("hidden")
  comparePanel?.classList.add("hidden")
  conceptMapPanel?.classList.add("hidden")
  batchExportPanel?.classList.add("hidden")
  factCheckerPanel?.classList.add("hidden")
  gapPanel?.classList.add("hidden")
})

timelineClose?.addEventListener("click", () => {
  timelinePanel?.classList.add("hidden")
})

timelineHome?.addEventListener("click", () => {
  window.location.href = "/"
})

timelineGenerateBtn?.addEventListener("click", async () => {
  const topic = timelineTopicInput?.value.trim() || "alle Quellen"

  if (timelineOutput) {
    timelineOutput.innerHTML = '<div class="rag-timeline-loading">📅 Erstelle Timeline...</div>'
  }

  try {
    const prompt = `Erstelle eine chronologische Timeline meiner Bachelorarbeit-Quellen zum Thema: "${topic}"

Gruppiere die Papers nach Dekaden und zeige die wichtigsten Entwicklungen:

## 📚 Timeline der Forschung

### 1990er
- [Jahr] Autor et al. - Kurze Beschreibung des wichtigsten Beitrags

### 2000er
- [Jahr] Autor et al. - Kurze Beschreibung
...

### 2020+
- [Jahr] Autor et al. - Kurze Beschreibung

## 🔍 Wichtige Meilensteine
[Fasse 3-5 Schlüsselentwicklungen zusammen]

Zeige echte Papers aus meinen Notizen, sortiert nach Publikationsjahr.`

    const response = await fetchApi("/chat", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        conversationHistory: [],
        language: currentLanguage
      })
    })

    if (!response.ok) throw new Error('Fehler bei Timeline')

    const data = await response.json()
    const result = data.response || 'Keine Antwort vom Server'

    if (timelineOutput) {
      timelineOutput.innerHTML = `
        <div class="rag-timeline-result">
          ${formatMarkdown(result)}
        </div>
        <button class="rag-copy-timeline" onclick="navigator.clipboard.writeText(\`${result.replace(/`/g, '\\`')}\`)">
          📋 Kopieren
        </button>
      `
    }
  } catch (error) {
    console.error('Timeline Fehler:', error)
    if (timelineOutput) {
      timelineOutput.innerHTML = '<div class="rag-timeline-error">❌ Fehler beim Erstellen der Timeline</div>'
    }
  }
})

// Concept Map panel
const conceptMapBtn = document.getElementById("rag-concept-map-btn")
const conceptMapPanel = document.getElementById("rag-concept-map-panel")
const conceptMapClose = document.getElementById("rag-concept-map-close")
const conceptMapHome = document.getElementById("rag-concept-map-home")
const conceptMapCenterInput = document.getElementById("rag-concept-map-center") as HTMLInputElement | null
const conceptMapGenerateBtn = document.getElementById("rag-concept-map-generate-btn")
const conceptMapOutput = document.getElementById("rag-concept-map-output")

conceptMapBtn?.addEventListener("click", () => {
  conceptMapPanel?.classList.toggle("hidden")
  featuresPanel?.classList.add("hidden")
  settingsPanel?.classList.add("hidden")
  historyPanel?.classList.add("hidden")
  citationPanel?.classList.add("hidden")
  writingPanel?.classList.add("hidden")
  comparePanel?.classList.add("hidden")
  timelinePanel?.classList.add("hidden")
  batchExportPanel?.classList.add("hidden")
  factCheckerPanel?.classList.add("hidden")
  gapPanel?.classList.add("hidden")
})

conceptMapClose?.addEventListener("click", () => {
  conceptMapPanel?.classList.add("hidden")
})

conceptMapHome?.addEventListener("click", () => {
  window.location.href = "/"
})

conceptMapGenerateBtn?.addEventListener("click", async () => {
  const center = conceptMapCenterInput?.value.trim()

  if (!center) {
    alert("Bitte gib eine Region oder ein Konzept ein")
    return
  }

  if (conceptMapOutput) {
    conceptMapOutput.innerHTML = '<div class="rag-concept-map-loading">🗺️ Erstelle Concept Map...</div>'
  }

  try {
    const prompt = `Erstelle eine visuelle Concept Map für: "${center}"

Zeige die wichtigsten Connections und Beziehungen:

## 🎯 Zentrum: ${center}

### 🔗 Direktverbundene Regionen
[Liste die direkt verbundenen Gehirnregionen]

### ⚡ Hauptfunktionen
[Schlüsselfunktionen von ${center}]

### 📊 Connectivity Pattern
[Beschreibe das Connectivity-Muster]

### 🔬 Wichtige Studien
[Top 3-5 Papers die diese Connections untersuchen]

### 🗺️ ASCII Diagram
\`\`\`
    [Region A]
         |
         ↓
    [${center}] ←→ [Region B]
         |
         ↓
    [Region C]
\`\`\`

Nutze Informationen aus meinen Notizen über ${center}.`

    const response = await fetchApi("/chat", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        conversationHistory: [],
        language: currentLanguage
      })
    })

    if (!response.ok) throw new Error('Fehler bei Concept Map')

    const data = await response.json()
    const result = data.response || 'Keine Antwort vom Server'

    if (conceptMapOutput) {
      conceptMapOutput.innerHTML = `
        <div class="rag-concept-map-result">
          ${formatMarkdown(result)}
        </div>
        <button class="rag-copy-concept-map" onclick="navigator.clipboard.writeText(\`${result.replace(/`/g, '\\`')}\`)">
          📋 Kopieren
        </button>
      `
    }
  } catch (error) {
    console.error('Concept Map Fehler:', error)
    if (conceptMapOutput) {
      conceptMapOutput.innerHTML = '<div class="rag-concept-map-error">❌ Fehler beim Erstellen der Concept Map</div>'
    }
  }
})

// Batch Export panel
const batchExportBtn = document.getElementById("rag-batch-export-btn")
const batchExportPanel = document.getElementById("rag-batch-export-panel")
const batchExportClose = document.getElementById("rag-batch-export-close")
const batchExportHome = document.getElementById("rag-batch-export-home")
const batchExportList = document.getElementById("rag-batch-export-list")
const batchSelectAllBtn = document.getElementById("rag-batch-select-all")
const batchDeselectAllBtn = document.getElementById("rag-batch-deselect-all")
const batchSearchInput = document.getElementById("rag-batch-search") as HTMLInputElement | null
const batchExportDownloadBtn = document.getElementById("rag-batch-export-download-btn")

const selectedFiles = new Set<string>()

batchExportBtn?.addEventListener("click", () => {
  batchExportPanel?.classList.toggle("hidden")
  featuresPanel?.classList.add("hidden")
  settingsPanel?.classList.add("hidden")
  historyPanel?.classList.add("hidden")
  citationPanel?.classList.add("hidden")
  writingPanel?.classList.add("hidden")
  comparePanel?.classList.add("hidden")
  timelinePanel?.classList.add("hidden")
  conceptMapPanel?.classList.add("hidden")
  factCheckerPanel?.classList.add("hidden")
  gapPanel?.classList.add("hidden")

  if (!batchExportPanel?.classList.contains("hidden")) {
    renderBatchExportList()
  }
})

batchExportClose?.addEventListener("click", () => {
  batchExportPanel?.classList.add("hidden")
})

batchExportHome?.addEventListener("click", () => {
  window.location.href = "/"
})

function renderBatchExportList(filter = '') {
  if (!batchExportList) return

  const files = Array.isArray(availableFiles) ? availableFiles : []
  const filtered = files.filter(file =>
    file.toLowerCase().includes(filter.toLowerCase())
  )

  batchExportList.innerHTML = filtered.map(file => `
    <label class="rag-batch-export-item">
      <input type="checkbox" value="${file}" ${selectedFiles.has(file) ? 'checked' : ''}>
      <span>${file}</span>
    </label>
  `).join('')

  batchExportList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      if (target.checked) {
        selectedFiles.add(target.value)
      } else {
        selectedFiles.delete(target.value)
      }
    })
  })
}

batchSelectAllBtn?.addEventListener("click", () => {
  const files = Array.isArray(availableFiles) ? availableFiles : []
  files.forEach(file => selectedFiles.add(file))
  renderBatchExportList(batchSearchInput?.value || '')
})

batchDeselectAllBtn?.addEventListener("click", () => {
  selectedFiles.clear()
  renderBatchExportList(batchSearchInput?.value || '')
})

batchSearchInput?.addEventListener("input", () => {
  renderBatchExportList(batchSearchInput.value)
})

batchExportDownloadBtn?.addEventListener("click", () => {
  if (selectedFiles.size === 0) {
    alert("Bitte wähle mindestens eine Datei aus")
    return
  }

  const content = Array.from(selectedFiles).map(file => {
    return `# ${file}\n\n[Inhalt der Datei ${file}]\n\n---\n\n`
  }).join('')

  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ba-notes-export-${Date.now()}.md`
  a.click()
  URL.revokeObjectURL(url)

  alert(`${selectedFiles.size} Dateien exportiert!`)
})

// Fact Checker panel
const factCheckerBtn = document.getElementById("rag-fact-checker-btn")
const factCheckerPanel = document.getElementById("rag-fact-checker-panel")
const factCheckerClose = document.getElementById("rag-fact-checker-close")
const factCheckerHome = document.getElementById("rag-fact-checker-home")
const factCheckerAnalyzeBtn = document.getElementById("rag-fact-checker-analyze-btn")
const factCheckerOutput = document.getElementById("rag-fact-checker-output")

factCheckerBtn?.addEventListener("click", () => {
  factCheckerPanel?.classList.toggle("hidden")
  featuresPanel?.classList.add("hidden")
  settingsPanel?.classList.add("hidden")
  historyPanel?.classList.add("hidden")
  citationPanel?.classList.add("hidden")
  writingPanel?.classList.add("hidden")
  comparePanel?.classList.add("hidden")
  timelinePanel?.classList.add("hidden")
  conceptMapPanel?.classList.add("hidden")
  batchExportPanel?.classList.add("hidden")
  gapPanel?.classList.add("hidden")
})

factCheckerClose?.addEventListener("click", () => {
  factCheckerPanel?.classList.add("hidden")
})

factCheckerHome?.addEventListener("click", () => {
  window.location.href = "/"
})

factCheckerAnalyzeBtn?.addEventListener("click", async () => {
  if (factCheckerOutput) {
    factCheckerOutput.innerHTML = '<div class="rag-fact-checker-loading">⚠️ Analysiere Notizen auf Widersprüche...</div>'
  }

  try {
    const prompt = `Analysiere meine Bachelorarbeit-Notizen auf Widersprüche und Inkonsistenzen.

Suche nach:

## ⚠️ Widersprüchliche Aussagen
[Finde Aussagen die sich widersprechen, z.B. "FEF ist primär visuell" vs "FEF verarbeitet auditorisch"]

## 🔤 Terminologie-Inkonsistenzen
[Finde inkonsistente Begriffe, z.B. "auditory cortex" vs "Hörkortex" vs "AC"]

## 📊 Konflikterende Daten
[Finde widersprüchliche Zahlen oder Fakten]

## 💡 Empfehlungen
[Konkrete Vorschläge wie die Inkonsistenzen aufgelöst werden können]

Sei spezifisch und zitiere die betroffenen Notizen.`

    const response = await fetchApi("/chat", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        conversationHistory: [],
        language: currentLanguage
      })
    })

    if (!response.ok) throw new Error('Fehler bei Fact Checking')

    const data = await response.json()
    const result = data.response || 'Keine Antwort vom Server'

    if (factCheckerOutput) {
      factCheckerOutput.innerHTML = `
        <div class="rag-fact-checker-result">
          ${formatMarkdown(result)}
        </div>
        <button class="rag-copy-fact-checker" onclick="navigator.clipboard.writeText(\`${result.replace(/`/g, '\\`')}\`)">
          📋 Kopieren
        </button>
      `
    }
  } catch (error) {
    console.error('Fact Checker Fehler:', error)
    if (factCheckerOutput) {
      factCheckerOutput.innerHTML = '<div class="rag-fact-checker-error">❌ Fehler beim Fact Checking</div>'
    }
  }
})

// Gap Analysis panel
const gapAnalysisBtn = document.getElementById("rag-gap-analysis-btn")
const gapPanel = document.getElementById("rag-gap-panel")
const gapClose = document.getElementById("rag-gap-close")
const gapHome = document.getElementById("rag-gap-home")
const gapAnalyzeBtn = document.getElementById("rag-gap-analyze-btn")
const gapOutput = document.getElementById("rag-gap-output")

gapAnalysisBtn?.addEventListener("click", () => {
  gapPanel?.classList.toggle("hidden")
  featuresPanel?.classList.add("hidden")
  settingsPanel?.classList.add("hidden")
  historyPanel?.classList.add("hidden")
  citationPanel?.classList.add("hidden")
  writingPanel?.classList.add("hidden")
  comparePanel?.classList.add("hidden")
})

gapHome?.addEventListener("click", () => {
  window.location.href = "/"
})

gapClose?.addEventListener("click", () => {
  gapPanel?.classList.add("hidden")
})

gapAnalyzeBtn?.addEventListener("click", async () => {
  if (gapOutput) {
    gapOutput.innerHTML = '<div class="rag-gap-loading">🔍 Analysiere deine Notizen...</div>'
  }

  try {
    const prompt = `Analysiere meine Bachelorarbeit-Notizen zum Thema "Auditorische Streams und Gehirnregionen" und identifiziere Forschungslücken.

Erstelle eine strukturierte Gap Analysis mit folgenden Kategorien:

## 🎯 Stark abgedeckte Bereiche
[Liste die am besten dokumentierten Themen/Regionen auf]

## ⚠️ Schwach abgedeckte Bereiche
[Welche wichtigen Themen/Regionen fehlen oder sind unterrepräsentiert?]

## 📅 Zeitliche Lücken
[Gibt es wichtige neuere Studien (2020+) die fehlen? Oder zu alte Quellen?]

## 🔬 Perspektiven-Lücken
[Welche Aspekte fehlen? (z.B. anatomische Details, funktionale Studien, Connectivity-Daten, klinische Relevanz)]

## 💡 Konkrete Empfehlungen
[Top 3-5 Papers oder Themen die du noch recherchieren solltest]

Sei spezifisch und zitiere Beispiele aus meinen Notizen.`

    const response = await fetchApi("/chat", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        conversationHistory: [],
        language: currentLanguage
      })
    })

    if (!response.ok) throw new Error('Fehler bei Gap Analysis')

    const data = await response.json()
    const result = data.response || 'Keine Antwort vom Server'

    if (gapOutput) {
      gapOutput.innerHTML = `
        <div class="rag-gap-result">
          ${formatMarkdown(result)}
        </div>
        <button class="rag-copy-gap" onclick="navigator.clipboard.writeText(\`${result.replace(/`/g, '\\`')}\`)">
          📋 Kopieren
        </button>
      `
    }
  } catch (error) {
    console.error('Gap Analysis Fehler:', error)
    if (gapOutput) {
      gapOutput.innerHTML = '<div class="rag-gap-error">❌ Fehler bei der Analyse</div>'
    }
  }
})

// Compare Tool panel
const compareToolBtn = document.getElementById("rag-compare-tool-btn")
const comparePanel = document.getElementById("rag-compare-panel")
const compareClose = document.getElementById("rag-compare-close")
const compareRegionAInput = document.getElementById("rag-compare-region-a") as HTMLInputElement | null
const compareRegionBInput = document.getElementById("rag-compare-region-b") as HTMLInputElement | null
const compareBtn = document.getElementById("rag-compare-btn")
const compareOutput = document.getElementById("rag-compare-output")

compareToolBtn?.addEventListener("click", () => {
  comparePanel?.classList.toggle("hidden")
  featuresPanel?.classList.add("hidden")
  settingsPanel?.classList.add("hidden")
  historyPanel?.classList.add("hidden")
  citationPanel?.classList.add("hidden")
  writingPanel?.classList.add("hidden")

  if (!comparePanel?.classList.contains("hidden")) {
    populateCompareRegions()
  }
})

compareClose?.addEventListener("click", () => {
  comparePanel?.classList.add("hidden")
})

function populateCompareRegions() {
  const dataListA = document.getElementById("rag-compare-regions-a")
  const dataListB = document.getElementById("rag-compare-regions-b")

  const files = Array.isArray(availableFiles) ? availableFiles : []
  if (!dataListA || !dataListB || files.length === 0) return

  // Filter nur Gehirnregionen (Glasser Areas und Other Areas)
  const regions = files.filter(file =>
    file.includes("Glasser areas") ||
    file.includes("Other areas") ||
    file.match(/^[A-Z0-9]+$/) // Short names like FEF, IFJ, etc
  )

  const optionsHTML = regions.map(region => `<option value="${region}">`).join('')
  dataListA.innerHTML = optionsHTML
  dataListB.innerHTML = optionsHTML
}

compareBtn?.addEventListener("click", async () => {
  const regionA = compareRegionAInput?.value.trim()
  const regionB = compareRegionBInput?.value.trim()

  if (!regionA || !regionB) {
    alert("Bitte gib beide Regionen an")
    return
  }

  if (regionA === regionB) {
    alert("Bitte wähle zwei verschiedene Regionen")
    return
  }

  if (compareOutput) {
    compareOutput.innerHTML = '<div class="rag-compare-loading">🔍 Vergleiche ' + regionA + ' mit ' + regionB + '...</div>'
  }

  try {
    const prompt = `Vergleiche die folgenden zwei Gehirnregionen systematisch:

**Region A**: ${regionA}
**Region B**: ${regionB}

Erstelle eine strukturierte Vergleichstabelle mit folgenden Kategorien:

| Kategorie | ${regionA} | ${regionB} |
|-----------|------------|------------|
| **Anatomische Lage** | ... | ... |
| **Hauptfunktionen** | ... | ... |
| **Connectivity** | ... | ... |
| **Key Studies** | ... | ... |
| **Gemeinsamkeiten** | ... | ... |
| **Unterschiede** | ... | ... |

Zitiere relevante Quellen mit [[source name]].`

    const response = await fetchApi("/chat", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        conversationHistory: [],
        language: currentLanguage
      })
    })

    if (!response.ok) throw new Error('Fehler beim Vergleich')

    const data = await response.json()
    const result = data.response || 'Keine Antwort vom Server'

    if (compareOutput) {
      compareOutput.innerHTML = `
        <div class="rag-compare-result">
          ${formatMarkdown(result)}
        </div>
        <button class="rag-copy-compare" onclick="navigator.clipboard.writeText(\`${result.replace(/`/g, '\\`')}\`)">
          📋 Kopieren
        </button>
      `
    }
  } catch (error) {
    console.error('Compare Tool Fehler:', error)
    if (compareOutput) {
      compareOutput.innerHTML = '<div class="rag-compare-error">❌ Fehler beim Vergleich</div>'
    }
  }
})

// Writing Assistant panel
const writingAssistantBtn = document.getElementById("rag-writing-assistant-btn")
const writingPanel = document.getElementById("rag-writing-panel")
const writingClose = document.getElementById("rag-writing-close")
const writingBack = document.getElementById("rag-writing-back")
const writingHome = document.getElementById("rag-writing-home")
const writingFormContainer = document.getElementById("rag-writing-form-container")
const writingToggleButton = document.getElementById("rag-writing-toggle")

writingAssistantBtn?.addEventListener("click", () => {
  writingPanel?.classList.toggle("hidden")
  featuresPanel?.classList.add("hidden")
  settingsPanel?.classList.add("hidden")
  historyPanel?.classList.add("hidden")
  citationPanel?.classList.add("hidden")
  if (!writingPanel?.classList.contains("hidden")) {
    if (!filesLoaded && !filesLoading) {
      loadFiles()
    } else {
      renderWritingSources()
    }
    showWritingFollowup(writingConversationHistory.length > 0)
  } else {
    hideWritingAutocompleteMenu()
  }
})

writingClose?.addEventListener("click", () => {
  writingPanel?.classList.add("hidden")
  showWritingFollowup(false)
  hideWritingAutocompleteMenu()
})

writingBack?.addEventListener("click", () => {
  writingPanel?.classList.add("hidden")
  showWritingFollowup(false)
  hideWritingAutocompleteMenu()
})

writingHome?.addEventListener("click", () => {
  window.location.href = "/"
})

writingToggleButton?.addEventListener("click", () => {
  writingFormContainer?.classList.toggle("collapsed")
  hideWritingAutocompleteMenu()
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
      literature: "📖 Literatur durchsuchen",
      writing: "✍️ Writing Assistant"
    },
    quickPrompts: {
      summary: "Fasse {currentFile} zusammen",
      literature: "Welche Paper und Studien diskutieren {currentFile}? Liste alle Quellen mit wichtigen Findings",
      writing: ""
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
      literature: "📖 Search literature",
      writing: "✍️ Writing Assistant"
    },
    quickPrompts: {
      summary: "Summarize {currentFile}",
      literature: "Which papers and studies discuss {currentFile}? List all sources with key findings",
      writing: ""
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

  // Update quick action buttons (by data-type attribute)
  const quickBtns = document.querySelectorAll('.rag-quick-btn')
  quickBtns.forEach((btn) => {
    const type = btn.getAttribute('data-type')
    if (type && type !== 'writing') {
      btn.textContent = t(`quickActions.${type}`)
      btn.setAttribute('data-prompt', t(`quickPrompts.${type}`))
    } else if (type === 'writing') {
      btn.textContent = t(`quickActions.writing`)
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
      const response = await fetchApi("/health")
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
    const healthResponse = await fetchApi("/health")
    const healthData = await healthResponse.json()
    const initialChunks = healthData.chunks || 0

    const response = await fetchApi("/reindex", {
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
  btn.addEventListener("click", async () => {
    console.log("🔘 Quick action button clicked")
    const prompt =
      btn.getAttribute("data-prompt")?.replace("{currentFile}", currentPageTitle) || ""
    const inputField = document.getElementById("rag-input") as HTMLTextAreaElement | null
    console.log("📝 Prompt:", prompt)
    console.log("📝 Input field:", inputField)
    if (inputField && prompt) {
      inputField.value = prompt
      inputField.focus()
      console.log("📤 Sending message automatically...")
      // Auto-send with slight delay to ensure input is set
      await new Promise(resolve => setTimeout(resolve, 100))
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

const INTERNAL_SOURCE_HOSTS = ["notes.coxilab.de", "notes.maximleopold.com", "maximleopold.com", "localhost", "127.0.0.1"]
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
  if (!source || typeof source !== "object") {
    console.log(`🚫 Rejected source: not an object`, source)
    return null
  }
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

  console.log(`🔍 Processing source: ${rawTitle}, URL: ${url}`)

  // Filter out external sources - only show sources from the vault
  // Allow: 1) Non-HTTP URLs (relative paths), 2) HTTP URLs from our vault
  if (url && url.startsWith("http")) {
    const lower = url.toLowerCase()
    const isInternal = INTERNAL_SOURCE_HOSTS.some(host => lower.includes(host))
    if (!isInternal) {
      // External URL - not from our vault, filter it out
      console.log(`🚫 Filtered out external source: ${url}`)
      sourceMetaCache.set(source, null)
      return null
    }
    console.log(`✅ Accepted HTTP source from vault: ${rawTitle} (${url})`)
  } else {
    console.log(`✅ Accepted non-HTTP source: ${rawTitle} (${url})`)
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
const writingGenerateBtn = document.getElementById('rag-writing-generate') as HTMLButtonElement | null
const writingOutput = document.getElementById('rag-writing-output')
const writingFollowupSection = document.getElementById('rag-writing-followup')
const writingFollowupInput = document.getElementById('rag-writing-followup-input') as HTMLTextAreaElement | null
const writingFollowupBtn = document.getElementById('rag-writing-send-followup') as HTMLButtonElement | null
const writingApproveBtn = document.getElementById('rag-writing-approve') as HTMLButtonElement | null
const writingSourceList = document.getElementById('rag-writing-source-list')
const writingSourceFilter = document.getElementById('rag-writing-source-filter') as HTMLInputElement | null
const writingLinkButton = document.getElementById('rag-writing-link-btn') as HTMLButtonElement | null
const writingAutocompleteContainer = document.getElementById('rag-writing-autocomplete')

type WritingTemplateKey = "summary" | "assistant" | "blog"
type WritingTemplateKey = "custom" | "summary" | "assistant" | "blog"
const writingTemplates: Record<WritingTemplateKey, Partial<Record<string, string>>> = {
  custom: {},
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
let writingActiveField: HTMLInputElement | HTMLTextAreaElement | null = null
let writingAutocompleteVisible = false
let writingAutocompleteIndex = -1
let writingWikilinkStart = -1

function applyWritingTemplate(template: WritingTemplateKey) {
  const data = writingTemplates[template] || {}
  if (template === "custom") {
    if (writingDeliverableInput) writingDeliverableInput.value = ""
    if (writingAudienceInput) writingAudienceInput.value = ""
    if (writingPurposeInput) writingPurposeInput.value = ""
    if (writingQuestionsInput) writingQuestionsInput.value = ""
    if (writingConstraintsInput) writingConstraintsInput.value = ""
    writingSelectedSources.clear()
    renderWritingSources()
    return
  }
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

  const files = Array.isArray(availableFiles) ? availableFiles : []
  if (!files.length) {
    const empty = document.createElement("div")
    empty.className = "rag-writing-source-empty"
    empty.textContent = filesLoading ? "Dateien werden geladen…" : "Noch keine Dateien verfügbar."
    writingSourceList.appendChild(empty)
    return
  }

  const filtered = files
    .filter(file => file.toLowerCase().includes(filter))
    .slice(0, 200)

  if (!filtered.length) {
    const empty = document.createElement("div")
    empty.className = "rag-writing-source-empty"
    empty.textContent = "Keine Treffer."
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

function showWritingAutocompleteMenu(filter: string, target: HTMLInputElement | HTMLTextAreaElement) {
  if (!writingAutocompleteContainer) return
  const files = Array.isArray(availableFiles) ? availableFiles : []
  if (!files.length) return
  const normalizedFilter = filter.toLowerCase()
  const filtered = files.filter(file => file.toLowerCase().includes(normalizedFilter)).slice(0, 12)

  if (!filtered.length) {
    writingAutocompleteContainer.innerHTML = '<div class="rag-autocomplete-empty">Keine Dateien gefunden</div>'
  } else {
    writingAutocompleteContainer.innerHTML = filtered
      .map(
        (file, idx) => `
          <div class="rag-autocomplete-item" data-file="${file}">
            <span class="rag-autocomplete-file">${file}</span>
            <span class="rag-autocomplete-meta">↩︎</span>
          </div>
        `,
      )
      .join("")

    writingAutocompleteContainer.querySelectorAll(".rag-autocomplete-item").forEach(item => {
      item.addEventListener("click", () => {
        const fileName = item.getAttribute("data-file")
        if (fileName) {
          insertWritingWikilink(fileName)
        }
      })
    })
  }

  const rect = target.getBoundingClientRect()
  const width = Math.min(Math.max(rect.width, 220), 360)
  let left = rect.left
  if (left + width > window.innerWidth - 16) {
    left = window.innerWidth - width - 16
  }
  writingAutocompleteContainer.style.top = `${rect.bottom + 6}px`
  writingAutocompleteContainer.style.left = `${left}px`
  writingAutocompleteContainer.style.width = `${width}px`

  writingAutocompleteContainer.classList.add("visible")
  writingAutocompleteVisible = true
  writingAutocompleteIndex = -1
}

function hideWritingAutocompleteMenu() {
  if (!writingAutocompleteContainer) return
  writingAutocompleteContainer.classList.remove("visible")
  writingAutocompleteVisible = false
  writingAutocompleteIndex = -1
  writingWikilinkStart = -1
}

function insertWritingWikilink(fileName: string) {
  const target = writingActiveField
  if (!target) return
  const value = target.value
  const selectionStart = target.selectionStart ?? value.length
  const selectionEnd = target.selectionEnd ?? selectionStart
  const start = writingWikilinkStart >= 0 ? writingWikilinkStart : selectionStart
  const beforeLink = value.substring(0, start)
  const afterCursor = value.substring(selectionEnd)
  target.value = `${beforeLink}[[${fileName}]]${afterCursor}`
  const newCursor = beforeLink.length + fileName.length + 4
  target.setSelectionRange(newCursor, newCursor)
  target.dispatchEvent(new Event("input"))
  hideWritingAutocompleteMenu()
}

function handleWritingFieldInput(field: HTMLInputElement | HTMLTextAreaElement) {
  writingActiveField = field
  const text = field.value
  const cursorPos = field.selectionStart ?? 0
  const beforeCursor = text.substring(0, cursorPos)
  const match = beforeCursor.match(/\[\[([^\]]*)$/)

  if (match) {
    writingWikilinkStart = cursorPos - match[0].length
    showWritingAutocompleteMenu(match[1], field)
  } else {
    hideWritingAutocompleteMenu()
  }
}

function handleWritingAutocompleteKeydown(e: KeyboardEvent) {
  if (!writingAutocompleteVisible || !writingAutocompleteContainer) return

  const items = writingAutocompleteContainer.querySelectorAll(".rag-autocomplete-item")
  if (e.key === "ArrowDown") {
    e.preventDefault()
    writingAutocompleteIndex = Math.min(writingAutocompleteIndex + 1, items.length - 1)
  } else if (e.key === "ArrowUp") {
    e.preventDefault()
    writingAutocompleteIndex = Math.max(writingAutocompleteIndex - 1, 0)
  } else if (e.key === "Enter" && writingAutocompleteIndex >= 0) {
    e.preventDefault()
    const selected = items[writingAutocompleteIndex]
    const fileName = selected?.getAttribute("data-file")
    if (fileName) {
      insertWritingWikilink(fileName)
    }
    return
  } else if (e.key === "Escape") {
    e.preventDefault()
    hideWritingAutocompleteMenu()
    return
  } else {
    return
  }

  items.forEach((item, idx) => {
    if (idx === writingAutocompleteIndex) {
      item.classList.add("selected")
      item.scrollIntoView({ block: "nearest" })
    } else {
      item.classList.remove("selected")
    }
  })
}

function attachWritingAutocomplete(field: HTMLInputElement | HTMLTextAreaElement | null) {
  if (!field) return
  field.addEventListener("focus", () => {
    writingActiveField = field
  })
  field.addEventListener("input", () => handleWritingFieldInput(field))
  field.addEventListener("keydown", (e) => handleWritingAutocompleteKeydown(e))
}

document.addEventListener("click", (event) => {
  if (!writingAutocompleteContainer || !writingAutocompleteVisible) return
  const target = event.target as Node
  if (
    writingAutocompleteContainer.contains(target) ||
    (target instanceof Element && target.closest(".rag-writing-form")) ||
    (target instanceof Element && target.closest(".rag-writing-followup"))
  ) {
    return
  }
  hideWritingAutocompleteMenu()
})

window.addEventListener("resize", () => hideWritingAutocompleteMenu())

const writingAutocompleteTargets = [
  writingDeliverableInput,
  writingAudienceInput,
  writingPurposeInput,
  writingQuestionsInput,
  writingConstraintsInput,
  writingFollowupInput,
]

writingAutocompleteTargets.forEach(field => attachWritingAutocomplete(field))

writingLinkButton?.addEventListener("click", () => {
  let target =
    writingActiveField ||
    writingQuestionsInput ||
    writingConstraintsInput ||
    writingFollowupInput ||
    writingPurposeInput
  if (!target) return
  const cursor = target.selectionStart ?? target.value.length
  const value = target.value
  const before = value.substring(0, cursor)
  const after = value.substring(cursor)
  target.value = `${before}[[${after}`
  const newPos = cursor + 2
  target.setSelectionRange(newPos, newPos)
  target.focus()
  writingActiveField = target
  writingWikilinkStart = cursor
  showWritingAutocompleteMenu("", target)
})

type WritingBrief = {
  deliverable: string
  audience: string
  purpose: string
  keyQuestions: string[]
  constraints: string
  sources: string[]
}

function collectWritingBrief(): WritingBrief | null {
  console.log("🔍 Collecting writing brief...")
  const deliverable = writingDeliverableInput?.value.trim()
  const audience = writingAudienceInput?.value.trim() || "nicht definiert"
  const purpose = writingPurposeInput?.value.trim()
  const keyQuestions = (writingQuestionsInput?.value || "")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
  const constraints = writingConstraintsInput?.value.trim() || "Keine zusätzlichen Constraints"
  const sources = Array.from(writingSelectedSources)

  console.log("📊 Brief data:", { deliverable, audience, purpose, keyQuestions, sources: sources.length })

  if (!deliverable) {
    console.log("❌ Missing deliverable")
    alert("Bitte beschreibe das Deliverable.")
    writingDeliverableInput?.focus()
    return null
  }
  if (!purpose) {
    console.log("❌ Missing purpose")
    alert("Bitte erläutere das Ziel / den Erfolg.")
    writingPurposeInput?.focus()
    return null
  }
  if (!keyQuestions.length) {
    console.log("❌ Missing key questions")
    alert("Füge mindestens eine Key Question hinzu.")
    writingQuestionsInput?.focus()
    return null
  }
  if (!sources.length) {
    console.log("❌ Missing sources")
    alert("Wähle mindestens eine Quelle.")
    writingSourceFilter?.focus()
    return null
  }

  console.log("✅ Brief validated successfully")
  return {
    deliverable,
    audience,
    purpose,
    keyQuestions,
    constraints,
    sources,
  }
}

function buildSessionBriefText(brief: WritingBrief): string {
  const questionsText = brief.keyQuestions.map(q => `- ${q}`).join("\n")
  const sourcesText = brief.sources.length
    ? brief.sources.map(src => `[x] ${src}`).join("\n")
    : "[ ] (keine ausgewählten Dateien)"

  return `Session Brief
- Deliverable: ${brief.deliverable}
- Audience & tone: ${brief.audience}
- Purpose/success metric: ${brief.purpose}
- Key questions to answer:
${questionsText}
- Constraints (length, POV, must/avoid):
${brief.constraints}
- Sources:
${sourcesText}`.trim()
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
    const response = await fetchApi("/chat-stream", {
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

    const contentType = response.headers.get("content-type") || ""

    if (!contentType.includes("text/event-stream")) {
      let payload: any = null
      if (contentType.includes("application/json")) {
        try {
          payload = await response.json()
        } catch {
          payload = null
        }
      } else {
        const textFallback = await response.text()
        try {
          payload = JSON.parse(textFallback)
        } catch {
          payload = { response: textFallback }
        }
      }

      if (!response.ok) {
        throw new Error(payload?.error ?? "Fehler beim Schreiben")
      }

      if (!payload) {
        throw new Error("Server hat keine Antwort gesendet.")
      }

      if (payload.error) {
        throw new Error(payload.error)
      }

      const assistantText = payload.response ?? payload.content ?? payload.message ?? ""
      if (writingOutput) {
        writingOutput.innerHTML = `
          <div class="rag-writing-result">
            ${formatMarkdown(assistantText || "Ich konnte keine relevanten Informationen finden.")}
          </div>
          <button class="rag-copy-writing" onclick="navigator.clipboard.writeText(\`${(assistantText || "").replace(/`/g, '\\`')}\`)">
            📋 Kopieren
          </button>
        `
      }

      writingConversationHistory = [
        ...writingConversationHistory,
        { role: "user", content: message },
        { role: "assistant", content: assistantText },
      ]

      showWritingFollowup(true)
      return
    }

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
    const response = await fetchApi("/chat", {
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
  console.log("📝 Outline anfordern button clicked")
  const brief = collectWritingBrief()
  console.log("📝 Brief collected:", brief)
  if (!brief) {
    console.log("❌ Brief validation failed - returning early")
    return
  }
  writingSessionBrief = buildSessionBriefText(brief)
  writingSessionSources = brief.sources
  writingConversationHistory = []
  writingFollowupInput && (writingFollowupInput.value = "")
  console.log("📝 Sending writing request...")
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
let filesLoaded = false
let filesLoading = false
let autocompleteVisible = false
let selectedIndex = -1
let wikilinkStart = -1

// Lade verfügbare Dateien
async function loadFiles(force = false) {
  if (filesLoading && !force) return
  filesLoading = true
  writingSourceFilter?.setAttribute("disabled", "true")
  try {
    const response = await fetchApi("/files")
    const data = await response.json()
    availableFiles = Array.isArray(data.files) ? data.files : []
    filesLoaded = true
    console.log(`📁 ${availableFiles.length} Dateien geladen für Autocomplete`)
    renderWritingSources()
  } catch (error) {
    filesLoaded = false
    console.error("Fehler beim Laden der Dateien:", error)
    renderWritingSources()
  } finally {
    filesLoading = false
    writingSourceFilter?.removeAttribute("disabled")
  }
}

// Zeige Autocomplete
function showAutocomplete(filter: string) {
  if (!autocompleteContainer || !inputField) return

  const files = Array.isArray(availableFiles) ? availableFiles : []
  const filtered = files.filter((file) =>
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
  console.log(`🔍 normalizeSourcesList called with ${sources?.length || 0} sources`, sources)
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

// Evidence Strength Indicator
type EvidenceStrength = "strong" | "moderate" | "weak"

function calculateEvidenceStrength(source: any): { strength: EvidenceStrength; icon: string; label: string } {
  const meta = parseSourceMeta(source)
  if (!meta) return { strength: "weak", icon: "🔴", label: "Weak evidence" }

  const title = meta.title.toLowerCase()
  const score = source.score || 0

  // Strong evidence: Meta-analyses, systematic reviews, multiple high-quality studies
  if (
    title.includes("meta-analysis") ||
    title.includes("meta analysis") ||
    title.includes("systematic review") ||
    title.includes("review") && score > 0.65
  ) {
    return { strength: "strong", icon: "🟢", label: "Strong evidence (Meta-analysis/Review)" }
  }

  // Moderate evidence: Well-cited single studies, high similarity score
  if (score > 0.60) {
    return { strength: "moderate", icon: "🟡", label: "Moderate evidence (Robust study)" }
  }

  // Weak evidence: Low similarity, single studies
  return { strength: "weak", icon: "🔴", label: "Weak/Limited evidence" }
}

function enrichSourcesWithEvidence(sources: any[]): any[] {
  return sources.map(source => ({
    ...source,
    evidence: calculateEvidenceStrength(source)
  }))
}

// Hilfsfunktion: Formatiere Markdown
function formatMarkdown(content: string, sources: any[] = []): string {
  const normalizedSources = normalizeSourcesList(sources)
  const sourceEntries = normalizedSources
    .map(source => ({ source, meta: parseSourceMeta(source) }))
    .filter(entry => entry.meta) as Array<{ source: any; meta: ParsedSourceMeta }>

  console.log(`📝 formatMarkdown: ${sourceEntries.length} sources to format`)

  // Formatiere Wikilinks [[File]] zu schönen Links
  let formatted = content.replace(/\[\[([^\]]+)\]\]/g, (_match, linkText) => {
    const slug = linkText.trim().replace(/\s+/g, '-')
    return `<a href="/${slug}" class="rag-wikilink" data-link="${linkText}">${linkText}</a>`
  })

  formatted = convertMarkdownTables(formatted)

  // Nummeriertes Citation-System: [1], [2], [3] im Text
  if (sourceEntries.length > 0) {
    // Erstelle einen Index: Source Name -> Nummer
    const citationIndex = new Map<string, { number: number; meta: ParsedSourceMeta }>()
    let citationNumber = 1

    sourceEntries.forEach(({ meta, source }) => {
      const candidates = [
        normalizeCitationKeyForClient(source.title),
        normalizeCitationKeyForClient(meta.label),
        normalizeCitationKeyForClient(meta.shortLabel),
        normalizeCitationKeyForClient(meta.title),
      ]
      candidates.forEach(key => {
        if (key && !citationIndex.has(key)) {
          citationIndex.set(key, { number: citationNumber, meta })
          citationNumber++
        }
      })
    })

    // Ersetze [Source Name] durch nummerierte, klickbare Citations im Text
    formatted = formatted.replace(/(?<!\[)\[([^\]]+)\](?!\]|\d)/g, (match, citationText) => {
      const key = normalizeCitationKeyForClient(citationText)
      const citation = citationIndex.get(key)
      if (!citation) {
        return match
      }
      const href = citation.meta.url || "#"
      return `<a href="${href}" class="rag-citation-link" target="_blank" rel="noopener noreferrer" data-citation="${citation.number}">[${citation.number}]</a>`
    })

    // Note: Quellen-Liste wird von addSourcesToMessage() hinzugefügt, nicht hier
  }

  // Formatiere Markdown-Überschriften und Text
  formatted = formatted.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
  formatted = formatted.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
  formatted = formatted.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  formatted = formatted.replace(/(?<!\w)_(.+?)_(?!\w)/g, '<em>$1</em>')
  formatted = formatted.replace(/\n/g, '<br>')
  formatted = formatted.replace(/<table([\s\S]*?)<\/table>/g, table =>
    table.replace(/<br>/g, '')
  )

  return formatted
}

function convertMarkdownTables(content: string): string {
  const lines = content.split('\n')
  const result: string[] = []

  const isTableRow = (line: string) => /^\s*\|.*\|\s*$/.test(line.trim())
  const isSeparatorRow = (line: string) =>
    /^\s*\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/.test(line.trim())

  const parseRow = (line: string) =>
    line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(cell => cell.trim())

  let i = 0
  while (i < lines.length) {
    if (isTableRow(lines[i])) {
      const tableLines: string[] = []
      while (i < lines.length && isTableRow(lines[i])) {
        tableLines.push(lines[i])
        i++
      }

      if (tableLines.length >= 2 && isSeparatorRow(tableLines[1])) {
        const headers = parseRow(tableLines[0])
        const rows = tableLines.slice(2).map(parseRow)

        const tableHtml = [
          '<div class="rag-md-table-wrapper">',
          '<table class="rag-md-table">',
          '<thead><tr>',
          ...headers.map(head => `<th>${head || '&nbsp;'}</th>`),
          '</tr></thead>',
          '<tbody>',
          ...rows
            .filter(row => row.some(cell => cell.length > 0))
            .map(row => {
              const padded = [...row]
              while (padded.length < headers.length) {
                padded.push('')
              }
              return `<tr>${padded.map(cell => `<td>${cell || '&nbsp;'}</td>`).join('')}</tr>`
            }),
          '</tbody>',
          '</table>',
          '</div>',
        ].join('')

        result.push(tableHtml)
      } else {
        result.push(tableLines.join('\n'))
      }
    } else {
      result.push(lines[i])
      i++
    }
  }

  return result.join('\n')
}

// Hilfsfunktion: Füge Quellen zur Nachricht hinzu
function addSourcesToMessage(messageDiv: HTMLElement, sources: any[]) {
  console.log(`📚 addSourcesToMessage called with ${sources?.length || 0} sources`, sources)
  const normalizedSources = normalizeSourcesList(sources)
    .map(source => ({ source, meta: parseSourceMeta(source) }))
    .filter(entry => entry.meta) as Array<{ source: any; meta: ParsedSourceMeta }>

  console.log(`📚 After normalization and filtering: ${normalizedSources.length} sources`)

  if (!normalizedSources.length) {
    console.log(`⚠️ No sources to display after filtering`)
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

// Generiere Follow-up Vorschläge via dediziertem /followups-Endpoint (kein RAG)
async function addFollowUpSuggestions(_messageDiv: HTMLElement, assistantText: string, userMessage: string) {
  if (!messagesContainer) return
  document.querySelectorAll(".rag-followup-chips").forEach(el => el.remove())

  try {
    const res = await fetchApi("/followups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assistantText,
        userMessage,
        currentPage: currentPageTitle,
        language: currentLanguage,
      }),
    }, { retryOn404: false })

    if (!res.ok) return
    const data = await res.json()
    const questions: string[] = data.questions || []
    if (questions.length === 0) return

    const chipsDiv = document.createElement("div")
    chipsDiv.className = "rag-followup-chips"
    questions.forEach(q => {
      const btn = document.createElement("button")
      btn.className = "rag-followup-chip"
      btn.textContent = q
      btn.addEventListener("click", () => {
        if (inputField) {
          inputField.value = q
          chipsDiv.remove()
          sendMessage()
        }
      })
      chipsDiv.appendChild(btn)
    })
    messagesContainer.appendChild(chipsDiv)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  } catch {
    // Follow-ups sind optional — Fehler ignorieren
  }
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

  // Follow-up Vorschläge asynchron generieren (nach kurzer Pause)
  setTimeout(() => addFollowUpSuggestions(messageDiv, assistantText, userMessage), 300)
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

function flattenTextValue(value: any): string {
  const visited = new WeakSet<object>()
  const prioritizedKeys = ["text", "content", "value", "message", "delta", "data", "response"]

  function inner(val: any): string {
    if (val === null || val === undefined) {
      return ""
    }

    if (typeof val === "string") {
      return val
    }

    if (typeof val === "number" || typeof val === "boolean") {
      return String(val)
    }

    if (Array.isArray(val)) {
      return val.map(inner).join("")
    }

    if (typeof val === "object") {
      if (visited.has(val)) {
        return ""
      }
      visited.add(val)

      for (const key of prioritizedKeys) {
        if (key in val) {
          const nested = inner((val as Record<string, any>)[key])
          if (nested) {
            return nested
          }
        }
      }

      if ("choices" in val && Array.isArray((val as any).choices)) {
        return (val as any).choices
          .map((choice: any) =>
            inner(choice.delta?.content ?? choice.delta?.text ?? choice.message?.content ?? choice.text ?? choice.content ?? choice),
          )
          .join("")
      }

      if ("parts" in val && Array.isArray((val as any).parts)) {
        return inner((val as any).parts)
      }

      return Object.entries(val)
        .filter(([key]) => key !== "type" && key !== "event")
        .map(([, nested]) => inner(nested))
        .join("")
    }

    return ""
  }

  return inner(value)
}

function extractTextFromPayload(payload: any, eventHint: string): string {
  if (payload === null || payload === undefined) {
    return ""
  }

  if (typeof payload === "string" || typeof payload === "number" || typeof payload === "boolean") {
    return String(payload)
  }

  if (Array.isArray(payload)) {
    return flattenTextValue(payload)
  }

  if (typeof payload !== "object") {
    return ""
  }

  const normalizedEvent = (eventHint ?? "").toLowerCase()
  if (normalizedEvent === "sources" || normalizedEvent === "done" || normalizedEvent === "error") {
    return ""
  }

  if ("error" in payload) {
    return ""
  }

  if ("token" in payload) {
    const token = flattenTextValue(payload.token)
    if (token) return token
  }

  if ("delta" in payload) {
    const token = flattenTextValue(payload.delta)
    if (token) return token
  }

  if ("choices" in payload) {
    const token = flattenTextValue(payload.choices)
    if (token) return token
  }

  if ("content" in payload || "text" in payload || "message" in payload) {
    const token = flattenTextValue(payload.content ?? payload.text ?? payload.message)
    if (token) return token
  }

  if ("data" in payload) {
    const token = flattenTextValue(payload.data)
    if (token) return token
  }

  if ("response" in payload) {
    const token = flattenTextValue(payload.response)
    if (token) return token
  }

  if ("result" in payload) {
    const token = flattenTextValue(payload.result)
    if (token) return token
  }

  return flattenTextValue(payload)
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

  // Memory: Wenn die Seite sich seit dem letzten Austausch geändert hat,
  // injiziere eine System-Notiz in die conversationHistory damit Mika den Wechsel kennt
  const lastMemoryEntry = conversationHistory.findLast?.((m: any) => m.role === "system")
  const lastMemoryPage = lastMemoryEntry?.content?.match(/Seite: "([^"]+)"/)?.[1]
  if (currentPageTitle !== "aktuelle Seite" && lastMemoryPage !== currentPageTitle) {
    conversationHistory.push({
      role: "user" as const,
      content: `[System: Ich wechsle jetzt zur Seite "${currentPageTitle}". Beziehe dich in folgenden Antworten darauf.]`,
    } as any)
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
    const healthCheck = await fetchApi("/health")
    if (!healthCheck.ok) {
      throw new Error("Server ist nicht erreichbar")
    }

    setStatus(t('status.generating'))

    // Erstelle Assistenten-Nachricht mit Typing-Dots für Streaming
    const messageDiv = document.createElement("div")
    messageDiv.className = "rag-message assistant"

    const contentDiv = document.createElement("div")
    contentDiv.className = "rag-message-content"
    contentDiv.innerHTML = `<span class="rag-typing-dots"><span></span><span></span><span></span></span>`
    messageDiv.appendChild(contentDiv)

    if (messagesContainer) {
      messagesContainer.appendChild(messageDiv)
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }

    let fullResponse = ""
    let sources: any[] = []
    let firstTokenReceived = false

    const applyParsedChunk = (parsed: any, eventHint: string | null) => {
      const eventType = (parsed.event ?? parsed.type ?? eventHint ?? "").toLowerCase()

      if (eventType === 'sources' || parsed.sources) {
        sources = normalizeSourcesList(parsed.sources || [])
        const preparedSources = enrichSourcesWithCitations(fullResponse, sources)
        contentDiv.innerHTML = formatMarkdown(fullResponse, preparedSources)
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight
        }
        return
      }

      if (eventType === 'done' || parsed.done) {
        if (parsed.sources) {
          sources = normalizeSourcesList(parsed.sources || [])
          const preparedSources = enrichSourcesWithCitations(fullResponse, sources)
          contentDiv.innerHTML = formatMarkdown(fullResponse, preparedSources)
        }
        if (parsed.error) {
          throw new Error(parsed.error)
        }
        return
      }

      if (parsed.error || eventType === 'error') {
        throw new Error(parsed.error ?? 'Unbekannter Fehler')
      }

      const textDelta = extractTextFromPayload(parsed, eventType)
      if (textDelta) {
        if (!firstTokenReceived) {
          firstTokenReceived = true
          // Typing-Dots entfernen beim ersten echten Token
          contentDiv.innerHTML = ""
        }
        fullResponse += textDelta
        const preparedSources = enrichSourcesWithCitations(fullResponse, sources)
        contentDiv.innerHTML = formatMarkdown(fullResponse, preparedSources)
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight
        }
      }
    }

    try {
      // Sende Streaming-Request
      const response = await fetchApi("/chat-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: enrichedMessage,
          conversationHistory,
          language: currentLanguage,
          pageContent: extractPageContent(),
        }),
      })

      const contentType = response.headers.get("content-type") || ""

      if (!contentType.includes("text/event-stream")) {
        let payload: any = null
        if (contentType.includes("application/json")) {
          try {
            payload = await response.json()
          } catch {
            payload = null
          }
        } else {
          const textFallback = await response.text()
          try {
            payload = JSON.parse(textFallback)
          } catch {
            payload = { response: textFallback }
          }
        }

        if (!response.ok) {
          throw new Error(payload?.error ?? `Server-Fehler (${response.status})`)
        }

        if (!payload) {
          throw new Error("Server hat eine unerwartete Antwort zurückgegeben.")
        }

        if (payload.error) {
          throw new Error(payload.error)
        }

        fullResponse = payload.response ?? payload.content ?? payload.message ?? ""
        sources = normalizeSourcesList(payload.sources || [])

        if (!fullResponse) {
          fullResponse = "Ich konnte keine relevanten Informationen finden."
        }

        const preparedSources = enrichSourcesWithCitations(fullResponse, sources)
        contentDiv.innerHTML = formatMarkdown(fullResponse, preparedSources)
        finalizeAssistantInteraction(messageDiv, contentDiv, userMessage, fullResponse, sources)
        setStatus("")
        return
      }

      if (!response.ok) {
        throw new Error("Server-Fehler")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("Stream nicht verfügbar")
      }

      let buffer = ""
      let streamClosed = false

      const processEventBlock = (rawEvent: string) => {
        let currentEvent: string | null = null
        const lines = rawEvent.split(/\r?\n/)

        for (const rawLine of lines) {
          const line = rawLine.trimEnd()
          if (!line) {
            continue
          }

          if (line.startsWith('event:')) {
            currentEvent = line.slice(6).trim()
            continue
          }

          if (!line.startsWith('data:')) {
            continue
          }

          const payload = line.slice(5).trimStart()
          if (payload === '[DONE]') {
            streamClosed = true
            return
          }

          try {
            const parsed = JSON.parse(payload)
            applyParsedChunk(parsed, currentEvent)
          } catch (e) {
            // Ungültiger Chunk - ignoriere und warte auf nächste vollständige Nachricht
          }
        }
      }

      const boundaryRegex = /\r?\n\r?\n/
      while (!streamClosed) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        let boundaryIndex = buffer.search(boundaryRegex)
        while (boundaryIndex !== -1) {
          const match = buffer.match(boundaryRegex)
          if (!match) break
          const boundaryLength = match[0].length
          const rawEvent = buffer.slice(0, boundaryIndex)
          buffer = buffer.slice(boundaryIndex + boundaryLength)

          if (rawEvent.trim()) {
            processEventBlock(rawEvent)
          }

          if (streamClosed) {
            break
          }

          boundaryIndex = buffer.search(boundaryRegex)
        }
      }

      if (!streamClosed && buffer.trim()) {
        processEventBlock(buffer)
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
    const isOffline = error.message?.includes("fetch") || error.message?.includes("network") || error.message?.includes("erreichbar")
    const errorHtml = isOffline
      ? `<div class="rag-error-msg">
           <span class="rag-error-icon">🔌</span>
           <div>
             <strong>Server nicht erreichbar</strong>
             <p>Mika ist gerade offline. Bitte versuche es in einem Moment erneut.</p>
             <button class="rag-retry-btn" onclick="document.getElementById('rag-send')?.click()">↻ Erneut versuchen</button>
           </div>
         </div>`
      : `<div class="rag-error-msg">
           <span class="rag-error-icon">⚠️</span>
           <div>
             <strong>Fehler</strong>
             <p>${error.message}</p>
           </div>
         </div>`

    const result = renderAssistantResponse("", [])
    if (result) {
      result.contentDiv.innerHTML = errorHtml
      result.messageDiv.classList.add("rag-message--error")
    }
    setStatus("")
  } finally {
    setLoading(false)
  }
}

async function fallbackToChatEndpoint(enrichedMessage: string, userMessage: string) {
  try {
    setStatus("Streaming nicht verfügbar – nutze Backup-Endpunkt", "warning")
    const response = await fetchApi("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: enrichedMessage,
        conversationHistory,
        language: currentLanguage,
        pageContent: extractPageContent(),
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

// Verhindere dass Quartz-SPA-Router Citation-Links im Chat abfängt
// Alle Links im Chat-Panel in neuem Tab öffnen (kein SPA-Navigate)
const chatPanel = document.querySelector(".rag-chat-panel")
chatPanel?.addEventListener("click", (e) => {
  const target = (e.target as HTMLElement).closest("a")
  if (!target) return
  e.stopPropagation() // Quartz-Router nicht triggern
  const href = target.getAttribute("href") || ""
  if (href && href !== "#") {
    e.preventDefault()
    window.open(href, "_blank", "noopener,noreferrer")
  }
}, true) // capture phase, vor dem Router

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
fetchApi("/health")
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
