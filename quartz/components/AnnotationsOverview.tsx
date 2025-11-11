import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

interface AnnotationsOverviewOptions {
  /**
   * Maximum number of annotations to display
   */
  limit?: number
}

const defaultOptions: AnnotationsOverviewOptions = {
  limit: 50,
}

export default ((opts?: Partial<AnnotationsOverviewOptions>) => {
  const options: AnnotationsOverviewOptions = { ...defaultOptions, ...opts }

  const AnnotationsOverview: QuartzComponent = ({ cfg, displayClass }: QuartzComponentProps) => {
    return (
      <div class={classNames(displayClass, "annotations-overview")}>
        <h1>Alle Annotationen</h1>
        <p class="annotations-description">
          Hier findest du alle öffentlichen Annotationen auf dieser Website. Neue Annotationen
          werden mit einem Badge markiert.
        </p>

        <div class="annotations-filters">
          <button class="filter-btn active" data-filter="all">
            Alle
          </button>
          <button class="filter-btn" data-filter="new">
            Neue
          </button>
          <button class="filter-btn" data-filter="my">
            Meine
          </button>
        </div>

        <div id="annotations-loading" class="annotations-loading">
          Lade Annotationen...
        </div>

        <div id="annotations-list" class="annotations-list"></div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const HYPOTHESIS_API = 'https://api.hypothes.is/api';
                const SITE_URL = '${cfg.baseUrl || "notes.maximleopold.com"}';
                const LIMIT = ${options.limit};
                const STORAGE_KEY = 'hypothesis_last_seen';

                let allAnnotations = [];
                let currentFilter = 'all';

                // Get last seen timestamp
                function getLastSeen() {
                  const stored = localStorage.getItem(STORAGE_KEY);
                  return stored ? parseInt(stored, 10) : Date.now();
                }

                // Update last seen timestamp
                function updateLastSeen() {
                  localStorage.setItem(STORAGE_KEY, Date.now().toString());
                }

                // Check if annotation is new
                function isNew(annotation) {
                  const lastSeen = getLastSeen();
                  const created = new Date(annotation.created).getTime();
                  return created > lastSeen;
                }

                // Fetch annotations from Hypothesis API
                async function fetchAnnotations() {
                  const loadingEl = document.getElementById('annotations-loading');
                  const listEl = document.getElementById('annotations-list');

                  try {
                    // Try multiple search strategies
                    const searchUrls = [
                      // Search by wildcard domain
                      \`\${HYPOTHESIS_API}/search?limit=\${LIMIT}&wildcard_uri=https://\${SITE_URL}/*&sort=updated&order=desc\`,
                      // Fallback: search by exact domain
                      \`\${HYPOTHESIS_API}/search?limit=\${LIMIT}&uri=https://\${SITE_URL}&sort=updated&order=desc\`,
                      // Fallback: search with http
                      \`\${HYPOTHESIS_API}/search?limit=\${LIMIT}&wildcard_uri=http://\${SITE_URL}/*&sort=updated&order=desc\`
                    ];

                    let data = null;
                    let lastError = null;

                    for (const url of searchUrls) {
                      try {
                        console.log('Trying Hypothesis API:', url);
                        const response = await fetch(url);

                        if (response.ok) {
                          data = await response.json();
                          console.log('Got annotations:', data.total || 0);
                          if (data.rows && data.rows.length > 0) {
                            break; // Found annotations, stop searching
                          }
                        }
                      } catch (err) {
                        lastError = err;
                        console.warn('API request failed:', err);
                      }
                    }

                    if (!data || !data.rows) {
                      throw lastError || new Error('No data received from API');
                    }

                    allAnnotations = data.rows || [];
                    console.log('Total annotations loaded:', allAnnotations.length);

                    loadingEl.style.display = 'none';
                    renderAnnotations();

                    // Update last seen after viewing
                    setTimeout(updateLastSeen, 2000);
                  } catch (error) {
                    console.error('Error fetching annotations:', error);
                    loadingEl.innerHTML = \`
                      <div class="error">
                        <p>Fehler beim Laden der Annotationen.</p>
                        <p style="font-size: 0.9rem; color: var(--gray);">
                          Möglicherweise gibt es noch keine öffentlichen Annotationen auf dieser Website.
                          Erstelle deine erste Annotation, indem du Text auf einer Seite markierst!
                        </p>
                        <button onclick="location.reload()" style="margin-top: 1rem;">Erneut versuchen</button>
                      </div>
                    \`;
                  }
                }

                // Render annotations based on filter
                function renderAnnotations() {
                  const listEl = document.getElementById('annotations-list');
                  if (!listEl) return;

                  let filteredAnnotations = allAnnotations;

                  if (currentFilter === 'new') {
                    filteredAnnotations = allAnnotations.filter(isNew);
                  } else if (currentFilter === 'my') {
                    // Filter by current user if logged in to Hypothesis
                    const currentUser = window.hypothesisUser;
                    if (currentUser) {
                      filteredAnnotations = allAnnotations.filter(a => a.user === currentUser);
                    }
                  }

                  if (filteredAnnotations.length === 0) {
                    listEl.innerHTML = '<p class="no-annotations">Keine Annotationen gefunden.</p>';
                    return;
                  }

                  const html = filteredAnnotations.map(annotation => {
                    const date = new Date(annotation.created);
                    const updated = new Date(annotation.updated);
                    const isNewAnnotation = isNew(annotation);
                    const author = annotation.user.split(':')[1].split('@')[0];

                    // Extract page title from URI
                    const pageUrl = annotation.uri;
                    const pagePath = pageUrl.replace(/^https?:\\/\\/[^\\/]+/, '');

                    // Get quote and text
                    const quote = annotation.target?.[0]?.selector?.find(s => s.type === 'TextQuoteSelector')?.exact || '';
                    const text = annotation.text || '';

                    return \`
                      <div class="annotation-item \${isNewAnnotation ? 'new' : ''}">
                        <div class="annotation-header">
                          <span class="annotation-author">\${author}</span>
                          <span class="annotation-date" title="Erstellt: \${date.toLocaleString('de-DE')}">
                            \${formatRelativeTime(date)}
                          </span>
                          \${isNewAnnotation ? '<span class="new-badge">NEU</span>' : ''}
                        </div>

                        \${quote ? \`
                          <blockquote class="annotation-quote">
                            \${escapeHtml(quote)}
                          </blockquote>
                        \` : ''}

                        \${text ? \`
                          <div class="annotation-text">
                            \${escapeHtml(text)}
                          </div>
                        \` : ''}

                        <div class="annotation-footer">
                          <a href="\${pagePath}" class="annotation-page-link">
                            → Zur Seite
                          </a>
                          <a href="https://hypothes.is/a/\${annotation.id}"
                             target="_blank"
                             rel="noopener noreferrer"
                             class="annotation-link">
                            In Hypothesis öffnen
                          </a>
                        </div>
                      </div>
                    \`;
                  }).join('');

                  listEl.innerHTML = html;
                }

                // Format relative time
                function formatRelativeTime(date) {
                  const now = new Date();
                  const diffMs = now - date;
                  const diffMins = Math.floor(diffMs / 60000);
                  const diffHours = Math.floor(diffMs / 3600000);
                  const diffDays = Math.floor(diffMs / 86400000);

                  if (diffMins < 1) return 'gerade eben';
                  if (diffMins < 60) return \`vor \${diffMins} Minute\${diffMins !== 1 ? 'n' : ''}\`;
                  if (diffHours < 24) return \`vor \${diffHours} Stunde\${diffHours !== 1 ? 'n' : ''}\`;
                  if (diffDays < 30) return \`vor \${diffDays} Tag\${diffDays !== 1 ? 'en' : ''}\`;

                  return date.toLocaleDateString('de-DE');
                }

                // Escape HTML to prevent XSS
                function escapeHtml(text) {
                  const div = document.createElement('div');
                  div.textContent = text;
                  return div.innerHTML;
                }

                // Setup filter buttons
                function setupFilters() {
                  const buttons = document.querySelectorAll('.filter-btn');
                  buttons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                      buttons.forEach(b => b.classList.remove('active'));
                      e.target.classList.add('active');
                      currentFilter = e.target.dataset.filter;
                      renderAnnotations();
                    });
                  });
                }

                // Initialize
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', () => {
                    setupFilters();
                    fetchAnnotations();
                  });
                } else {
                  setupFilters();
                  fetchAnnotations();
                }
              })();
            `,
          }}
        />
      </div>
    )
  }

  AnnotationsOverview.css = `
    .annotations-overview {
      max-width: 900px;
      margin: 0 auto;
      padding: 1rem;
    }

    .annotations-description {
      color: var(--gray);
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }

    .annotations-filters {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.5rem 1rem;
      border: 1px solid var(--lightgray);
      background: var(--light);
      color: var(--darkgray);
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }

    .filter-btn:hover {
      background: var(--lightgray);
    }

    .filter-btn.active {
      background: var(--secondary);
      color: white;
      border-color: var(--secondary);
    }

    .annotations-loading {
      text-align: center;
      padding: 3rem;
      color: var(--gray);
    }

    .annotations-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .annotation-item {
      border: 1px solid var(--lightgray);
      border-radius: 8px;
      padding: 1.25rem;
      background: var(--light);
      transition: all 0.2s ease;
      position: relative;
    }

    .annotation-item.new {
      border-left: 4px solid var(--secondary);
      background: var(--highlight);
    }

    .annotation-item:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .annotation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .annotation-author {
      font-weight: 600;
      color: var(--secondary);
    }

    .annotation-date {
      color: var(--gray);
      font-size: 0.85rem;
    }

    .new-badge {
      background: var(--secondary);
      color: white;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .annotation-quote {
      margin: 0.75rem 0;
      padding: 0.75rem 1rem;
      border-left: 3px solid var(--tertiary);
      background: var(--lightgray);
      font-style: italic;
      color: var(--darkgray);
    }

    .annotation-text {
      margin: 0.75rem 0;
      color: var(--dark);
      line-height: 1.6;
    }

    .annotation-footer {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .annotation-page-link,
    .annotation-link {
      color: var(--secondary);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s ease;
    }

    .annotation-page-link:hover,
    .annotation-link:hover {
      color: var(--tertiary);
      text-decoration: underline;
    }

    .no-annotations {
      text-align: center;
      padding: 3rem;
      color: var(--gray);
      font-style: italic;
    }

    .error {
      color: var(--darkgray);
      padding: 2rem;
      text-align: center;
    }

    .error button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background: var(--secondary);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }

    .error button:hover {
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      .annotations-overview {
        padding: 0.5rem;
      }

      .annotation-item {
        padding: 1rem;
      }

      .annotation-footer {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `

  return AnnotationsOverview
}) satisfies QuartzComponentConstructor
