import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

interface AnnotationsBadgeOptions {
  /**
   * Text to display on the badge
   */
  text?: string
}

const defaultOptions: AnnotationsBadgeOptions = {
  text: "Annotationen",
}

export default ((opts?: Partial<AnnotationsBadgeOptions>) => {
  const options: AnnotationsBadgeOptions = { ...defaultOptions, ...opts }

  const AnnotationsBadge: QuartzComponent = ({ cfg, displayClass }: QuartzComponentProps) => {
    return (
      <a
        href="/annotations"
        class={classNames(displayClass, "annotations-badge-link")}
        title="Alle Annotationen ansehen"
      >
        <div class="annotations-badge">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span class="annotations-count" id="annotations-count" style="display: none;">
            0
          </span>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const HYPOTHESIS_API = 'https://api.hypothes.is/api';
                const SITE_URL = '${cfg.baseUrl || "notes.maximleopold.com"}';
                const STORAGE_KEY = 'hypothesis_last_seen';
                const CHECK_INTERVAL = 60000; // Check every minute

                // Get last seen timestamp
                function getLastSeen() {
                  const stored = localStorage.getItem(STORAGE_KEY);
                  return stored ? parseInt(stored, 10) : Date.now();
                }

                // Check for new annotations
                async function checkNewAnnotations() {
                  try {
                    const lastSeen = getLastSeen();

                    // Try multiple search strategies
                    const searchUrls = [
                      \`\${HYPOTHESIS_API}/search?limit=200&wildcard_uri=https://\${SITE_URL}/*&sort=created&order=desc\`,
                      \`\${HYPOTHESIS_API}/search?limit=200&uri=https://\${SITE_URL}&sort=created&order=desc\`,
                      \`\${HYPOTHESIS_API}/search?limit=200&wildcard_uri=http://\${SITE_URL}/*&sort=created&order=desc\`
                    ];

                    let annotations = [];

                    for (const url of searchUrls) {
                      try {
                        const response = await fetch(url);
                        if (response.ok) {
                          const data = await response.json();
                          if (data.rows && data.rows.length > 0) {
                            annotations = data.rows;
                            break;
                          }
                        }
                      } catch (err) {
                        console.warn('Badge API request failed:', err);
                      }
                    }

                    // Count new annotations
                    const newCount = annotations.filter(annotation => {
                      const created = new Date(annotation.created).getTime();
                      return created > lastSeen;
                    }).length;

                    // Update badge
                    const countEl = document.getElementById('annotations-count');
                    if (countEl) {
                      if (newCount > 0) {
                        countEl.textContent = newCount > 99 ? '99+' : newCount.toString();
                        countEl.style.display = 'flex';
                        countEl.parentElement?.classList.add('has-new');
                      } else {
                        countEl.style.display = 'none';
                        countEl.parentElement?.classList.remove('has-new');
                      }
                    }
                  } catch (error) {
                    console.error('Error checking annotations:', error);
                  }
                }

                // Initial check
                checkNewAnnotations();

                // Periodic check
                setInterval(checkNewAnnotations, CHECK_INTERVAL);

                // Check on page visibility change
                document.addEventListener('visibilitychange', function() {
                  if (!document.hidden) {
                    checkNewAnnotations();
                  }
                });

                // Check on SPA navigation
                document.addEventListener('nav', checkNewAnnotations);
              })();
            `,
          }}
        />
      </a>
    )
  }

  AnnotationsBadge.css = `
    .annotations-badge-link {
      text-decoration: none;
      display: flex;
      align-items: center;
      color: var(--darkgray);
      transition: color 0.2s ease;
    }

    .annotations-badge-link:hover {
      color: var(--secondary);
    }

    .annotations-badge {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      cursor: pointer;
    }

    .annotations-badge svg {
      width: 20px;
      height: 20px;
    }

    .annotations-count {
      position: absolute;
      top: 0;
      right: 0;
      background: var(--secondary);
      color: white;
      font-size: 0.65rem;
      font-weight: 600;
      padding: 0.15rem 0.35rem;
      border-radius: 10px;
      min-width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      animation: pulse 2s ease-in-out infinite;
    }

    .annotations-badge.has-new {
      animation: wiggle 0.5s ease-in-out;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }

    @keyframes wiggle {
      0%, 100% {
        transform: rotate(0deg);
      }
      25% {
        transform: rotate(-10deg);
      }
      75% {
        transform: rotate(10deg);
      }
    }

    @media (max-width: 768px) {
      .annotations-badge svg {
        width: 18px;
        height: 18px;
      }

      .annotations-count {
        font-size: 0.6rem;
        min-width: 16px;
        height: 16px;
        padding: 0.1rem 0.3rem;
      }
    }
  `

  return AnnotationsBadge
}) satisfies QuartzComponentConstructor
