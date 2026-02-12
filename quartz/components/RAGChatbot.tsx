import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
// @ts-ignore
import script from "./scripts/ragChatbot.inline"

interface Message {
  role: "user" | "assistant"
  content: string
  sources?: Array<{
    title?: string
    category?: string
    type: string
    score: number
    excerpt: string
    source?: string
    url?: string
    id?: string
    citation?: {
      label: string
      shortLabel: string
      authors: string
      year: string
      title: string
      venue: string
    }
    bibliography?: {
      authors: string
      year: string
      title: string
      venue: string
      url?: string
    }
    chunkIds?: string[]
  }>
}

interface Options {
  collapsed: boolean
}

const defaultOptions: Options = {
  collapsed: true,
}

export default ((opts?: Partial<Options>) => {
  const options = { ...defaultOptions, ...opts }

  const RAGChatbot: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    const currentFileName = fileData.frontmatter?.title || fileData.slug || "diese Seite"

    return (
      <div class={classNames(displayClass, "rag-chatbot")}>
        {/* Floating Chat Button - ALWAYS VISIBLE */}
        <button
          type="button"
          class="rag-chat-fab"
          id="rag-chat-fab"
          aria-label="Open Mika Chatbot"
        >
          🧠
        </button>

        {/* Chat Overlay */}
        <div class="rag-chat-overlay hidden" id="rag-chat-overlay">
          <div class="rag-chat-panel">
            {/* Header */}
            <div class="rag-chat-header">
              <div class="rag-chat-title">
                <span class="rag-chat-icon">🧠</span>
                <div>
                  <h3>Mika</h3>
                  <p class="rag-chat-subtitle">mein BA-Assistent</p>
                </div>
              </div>
              <div class="rag-chat-header-actions">
                <button class="rag-chat-expand" id="rag-chat-expand" aria-label="Toggle fullscreen" title="Fullscreen">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                  </svg>
                </button>
                <button class="rag-chat-lang" id="rag-chat-lang" aria-label="Switch language" title="Sprache wechseln">
                  <span class="rag-lang-text">EN</span>
                </button>
                <button class="rag-chat-history" id="rag-chat-history" aria-label="Chat history" title="Chat-Verlauf">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 3v5h5"></path>
                    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
                    <path d="M12 7v5l4 2"></path>
                  </svg>
                </button>
                <button class="rag-chat-clear" id="rag-chat-clear" aria-label="Clear chat" title="Chat löschen">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
                <button class="rag-chat-settings" id="rag-chat-settings" aria-label="Settings" title="Einstellungen">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
                <button class="rag-chat-features" id="rag-chat-features" aria-label="Features" title="Features">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
                <button class="rag-chat-close" id="rag-chat-close" aria-label="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Features Panel */}
            <div class="rag-features-panel hidden" id="rag-features-panel">
              <div class="rag-features-header">
                <h4>✨ Features</h4>
              </div>
              <div class="rag-features-content">
                <button class="rag-citation-manager-btn" id="rag-citation-manager-btn" title="Verwalte alle zitierten Quellen">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <span>📚 Citation Manager</span>
                </button>
                <p class="rag-features-hint">Exportiere alle zitierten Quellen als BibTeX, APA oder Zotero.</p>

              </div>
            </div>

            {/* Settings Panel */}
            <div class="rag-settings-panel hidden" id="rag-settings-panel">
              <div class="rag-settings-header">
                <h4>⚙️ Einstellungen</h4>
              </div>
              <div class="rag-settings-content">
                <button class="rag-reindex-btn" id="rag-reindex-btn" title="Indiziert alle Dokumente neu und erstellt Embeddings">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                  </svg>
                  <span>Vault neu indizieren</span>
                </button>
                <p class="rag-settings-hint">Führt die Re-Indexierung aller Dokumente durch. Dies kann einige Minuten dauern.</p>
              </div>
            </div>

            {/* History Panel */}
            <div class="rag-history-panel hidden" id="rag-history-panel">
              <div class="rag-history-header">
                <h4>📚 Chat-Verlauf</h4>
                <button class="rag-history-close" id="rag-history-close" aria-label="Close">×</button>
              </div>
              <div class="rag-history-search">
                <input type="text" id="rag-history-search" placeholder="Durchsuchen..." />
              </div>
              <div class="rag-history-list" id="rag-history-list">
                {/* Dynamisch gefüllt via JavaScript */}
              </div>
            </div>

            {/* Citation Manager Panel */}
            <div class="rag-citation-panel hidden" id="rag-citation-panel">
              <div class="rag-citation-header">
                <h4>📖 Citation Manager</h4>
                <div class="rag-citation-header-actions">
                  <button class="rag-citation-home" id="rag-citation-home" aria-label="Zurück zum Vault">↩ Vault</button>
                  <button class="rag-citation-close" id="rag-citation-close" aria-label="Close">×</button>
                </div>
              </div>
              <div class="rag-citation-stats" id="rag-citation-stats">
                {/* Dynamisch gefüllt */}
              </div>
              <div class="rag-citation-export">
                <button class="rag-export-btn" id="rag-export-bibtex">
                  <span>BibTeX</span>
                </button>
                <button class="rag-export-btn" id="rag-export-apa">
                  <span>APA</span>
                </button>
                <button class="rag-export-btn" id="rag-export-list">
                  <span>Simple List</span>
                </button>
              </div>
              <div class="rag-citation-list" id="rag-citation-list">
                {/* Liste aller Quellen */}
              </div>
            </div>


            {/* Writing Assistant Panel */}
            <div class="rag-writing-panel hidden" id="rag-writing-panel">
                <div class="rag-writing-header">
                  <div>
                    <h4>✍️ Writing Assistant</h4>
                    <p>Session Brief → Outline → Draft</p>
                  </div>
                  <div class="rag-writing-header-actions">
                    <button class="rag-writing-home" id="rag-writing-home" aria-label="Zurück zum Research Vault">↩ Vault</button>
                    <button class="rag-writing-back" id="rag-writing-back" aria-label="Zurück">← Zurück</button>
                    <button class="rag-writing-close" id="rag-writing-close" aria-label="Close">×</button>
                  </div>
                </div>
              <div class="rag-writing-body">
                <div class="rag-writing-form-container" id="rag-writing-form-container">
                  <button class="rag-writing-toggle" id="rag-writing-toggle" aria-label="Brief ein- oder ausblenden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                  <div class="rag-writing-form" id="rag-writing-form">
                    <div class="rag-writing-template">
                      <label for="rag-writing-template">Template</label>
                    <select id="rag-writing-template">
                      <option value="custom" selected>Leer</option>
                      <option value="summary">Summary für mich</option>
                      <option value="assistant">Schreib Assistance</option>
                      <option value="blog">Blog Post Format</option>
                    </select>
                  </div>

                    <div class="rag-writing-toolbar">
                      <button type="button" class="rag-writing-link-btn" id="rag-writing-link-btn" title="Füge [[wikilink]] zu deinen Notizen ein">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        [[Link]] einfügen
                      </button>
                    </div>

                    <div class="rag-writing-grid">
                      <label>
                        Deliverable
                        <input type="text" id="rag-writing-deliverable" placeholder="z.B. 500-Wort Blogpost" />
                      </label>
                      <label>
                        Audience & Tone
                        <input type="text" id="rag-writing-audience" placeholder="z.B. PMs, präzise & motivierend" />
                      </label>
                    </div>

                    <label>
                      Purpose / Success Metric
                      <input type="text" id="rag-writing-purpose" placeholder="z.B. Versteht Produktvorteile in <2 Min" />
                    </label>

                    <label>
                      Key questions to answer
                      <textarea id="rag-writing-questions" placeholder="- Was ist das Problem?\n- Wie lösen wir es?\n- Was ist der CTA?"></textarea>
                    </label>

                    <label>
                      Constraints (POV, Länge, No-Gos)
                      <textarea id="rag-writing-constraints" placeholder="z.B. Max 600 Wörter, kein Jargon, CTA zu /sites/demo/"></textarea>
                    </label>

                    <div class="rag-writing-sources-block">
                      <div class="rag-writing-sources-header">
                        <div>
                          <span>Sources</span>
                          <p>Wähle Dateien, die der Assistant nutzen darf</p>
                        </div>
                        <input type="text" id="rag-writing-source-filter" placeholder="Dateien suchen..." />
                      </div>
                      <div class="rag-writing-source-list" id="rag-writing-source-list">
                        <div class="rag-writing-source-empty">Lade Dateien…</div>
                      </div>
                    </div>

                    <button class="rag-writing-generate" id="rag-writing-generate">
                      🧠 Outline anfordern
                    </button>
                  </div>
                  <div class="rag-writing-autocomplete" id="rag-writing-autocomplete"></div>
                </div>

                <div class="rag-writing-main">
                  <div class="rag-writing-output" id="rag-writing-output">
                    <div class="rag-writing-placeholder">
                      <p>Fülle den Session Brief aus und starte mit „Outline anfordern“.</p>
                    </div>
                  </div>

                  <div class="rag-writing-followup hidden" id="rag-writing-followup">
                    <label>
                      Antwort / zusätzliche Infos
                      <textarea id="rag-writing-followup-input" placeholder="Beantworte offene Fragen oder gib neues Feedback"></textarea>
                    </label>
                    <div class="rag-writing-followup-actions">
                      <button id="rag-writing-send-followup">Antwort senden</button>
                      <button id="rag-writing-approve">Outline freigeben & Draft schreiben</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div class="rag-quick-actions">
              <button class="rag-quick-btn" data-prompt="Fasse {currentFile} zusammen" data-type="summary">
                📄 Zusammenfassen
              </button>
              <button class="rag-quick-btn" data-prompt="Zeige alle Verbindungen und Connectivity von {currentFile}" data-type="connectivity">
                🔗 Connectivity anzeigen
              </button>
              <button class="rag-quick-btn" data-prompt="Vergleiche {currentFile} mit verwandten Regionen. Zeige Unterschiede und Gemeinsamkeiten" data-type="compare">
                🔄 Mit anderen vergleichen
              </button>
              <button class="rag-quick-btn" data-prompt="Welche Paper und Studien diskutieren {currentFile}? Liste alle Quellen mit wichtigen Findings" data-type="literature">
                📖 Literatur durchsuchen
              </button>
              <button class="rag-quick-btn rag-writing-assistant-btn" id="rag-writing-assistant-btn" data-type="writing">
                ✍️ Writing Assistant
              </button>
            </div>

            {/* Messages */}
            <div class="rag-chat-messages" id="rag-messages">
              <div class="rag-message assistant">
                <div class="rag-message-content">
                  Hallo! Ich bin Mika, dein Bachelorarbeit-Assistent. Nutze die Buttons oben für schnelle Aktionen oder stelle mir eine Frage!
                </div>
              </div>
            </div>

            {/* Input */}
            <div class="rag-chat-input-container">
              {/* Autocomplete Dropdown */}
              <div class="rag-autocomplete" id="rag-autocomplete"></div>

              <textarea
                id="rag-input"
                class="rag-chat-input"
                placeholder="Frage zu deiner Bachelorarbeit... (tippe [[ für Dateiauswahl)"
                rows={2}
              ></textarea>
              <div class="rag-chat-actions">
                <button id="rag-link-btn" class="rag-link-btn" title="Link zu Datei einfügen">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  Link
                </button>
                <button id="rag-send" class="rag-chat-send">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>

            <div class="rag-chat-status" id="rag-status"></div>
          </div>
        </div>
      </div>
    )
  }

  RAGChatbot.afterDOMLoaded = script

  return RAGChatbot
}) satisfies QuartzComponentConstructor
