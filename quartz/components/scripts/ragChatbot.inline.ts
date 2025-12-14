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
})

// Clear chat button
const clearBtn = document.getElementById("rag-chat-clear")

clearBtn?.addEventListener("click", () => {
  // Bestätigungsdialog
  if (!confirm("Möchtest du wirklich den gesamten Chat löschen?")) {
    return
  }

  // Leere Konversationshistorie
  conversationHistory = []

  // Lösche alle Nachrichten
  if (messagesContainer) {
    messagesContainer.innerHTML = ""
  }

  // Füge Willkommensnachricht wieder hinzu
  addMessage(
    "assistant",
    "Hallo! Ich bin Mika, dein Bachelorarbeit-Assistent. Nutze die Buttons oben für schnelle Aktionen oder stelle mir eine Frage!",
  )

  // Visuelles Feedback
  setStatus("Chat wurde gelöscht", "info")
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

let conversationHistory: Array<{ role: string; content: string }> = []

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
  // Headlines (## Text)
  formattedContent = formattedContent.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')

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
    const sourcesDiv = document.createElement("div")
    sourcesDiv.className = "rag-message-sources"

    const sourcesTitle = document.createElement("div")
    sourcesTitle.className = "rag-sources-title"
    sourcesTitle.textContent = "📚 Quellen:"
    sourcesDiv.appendChild(sourcesTitle)

    sources.forEach((source, idx) => {
      const sourceItem = document.createElement("div")
      sourceItem.className = "rag-source-item"

      const sourceTitle = source.title || "Unbekannt"
      const sourceCategory = source.category || ""
      const relevance = Math.round(source.score * 100)

      sourceItem.innerHTML = `
            <span class="rag-source-number">[${idx + 1}]</span>
            <span class="rag-source-title">${sourceTitle}</span>
            <span class="rag-source-meta">${sourceCategory} • ${relevance}% relevant</span>
          `
      sourcesDiv.appendChild(sourceItem)
    })

    messageDiv.appendChild(sourcesDiv)
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
    sendButton.innerHTML = '<span class="rag-loading-spinner"></span> Denke nach...'
  } else {
    sendButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Senden
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
  setStatus("Suche relevante Informationen...")

  try {
    // Überprüfe Server-Status
    const healthCheck = await fetch(`${API_URL}/health`)
    if (!healthCheck.ok) {
      throw new Error("Server ist nicht erreichbar")
    }

    setStatus("Generiere Antwort...")

    // Sende Chat-Anfrage (mit angereicherter Nachricht)
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: enrichedMessage,
        conversationHistory,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Unbekannter Fehler")
    }

    const data = await response.json()

    // Zeige Assistenten-Antwort
    addMessage("assistant", data.response, data.sources)

    // Update Konversationshistorie
    conversationHistory.push(
      { role: "user", content: userMessage },
      { role: "assistant", content: data.response },
    )

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
