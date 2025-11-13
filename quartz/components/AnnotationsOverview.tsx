import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { FullSlug, resolveRelative, simplifySlug } from "../util/path"
import { getAllSegmentPrefixes } from "../util/path"

interface AnnotationsOverviewOptions {
  limit?: number
}

const defaultOptions: AnnotationsOverviewOptions = {
  limit: 50,
}

export default ((opts?: Partial<AnnotationsOverviewOptions>) => {
  const options: AnnotationsOverviewOptions = { ...defaultOptions, ...opts }

  const AnnotationsOverview: QuartzComponent = ({
    cfg,
    displayClass,
    allFiles,
    fileData,
  }: QuartzComponentProps) => {
    // Tag display mapping - transform certain tags for display
    const displayTagName = (tag: string): string => {
      const tagMap: Record<string, string> = {
        "stream/dorsal": "dorsalstream",
        "stream/ventral": "ventralstream",
      }
      return tagMap[tag] || tag
    }

    // Collect all tags and their counts
    const tagCounts = new Map<string, number>()

    for (const file of allFiles) {
      const tags = file.frontmatter?.tags ?? []
      const normalizedTags = Array.isArray(tags)
        ? tags.map((tag) => (typeof tag === "string" ? tag.toLowerCase() : ""))
        : typeof tags === "string"
          ? [tags.toLowerCase()]
          : []

      for (const tag of normalizedTags) {
        if (!tag) continue
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      }
    }

    // Sort tags by count (descending) then alphabetically
    const sortedTags = Array.from(tagCounts.entries()).sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1] // Sort by count descending
      return a[0].localeCompare(b[0]) // Then alphabetically
    })

    const tagPageUrl = (tag: string) => {
      const slug = simplifySlug(`tags/${tag}` as FullSlug)
      return resolveRelative(fileData.slug!, slug)
    }

    return (
      <div class={classNames(displayClass, "annotations-overview")}>
        <div class="annotations-header">
          <h1>Alle Annotationen</h1>
        </div>

        <p class="annotations-description">
          Alle Annotationen auf dieser Website sind in der Hypothesis-Gruppe{" "}
          <strong>CIMEC Auditory Cortex</strong> organisiert.
        </p>

        <div class="annotations-group-links">
          <a
            href="https://hypothes.is/groups/7DzYpr4y/cimec-auditory-cortex"
            target="_blank"
            rel="noopener noreferrer"
            class="group-link primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Alle Annotationen in Hypothesis ansehen
          </a>
        </div>

        <div class="tags-section">
          <div class="tags-section-header">
            <h2>Alle Tags</h2>
            <span class="tags-count">
              {sortedTags.length} Tags · {allFiles.length} Notizen
            </span>
          </div>

          <div class="tags-container">
            {sortedTags.slice(0, 20).map(([tag, count]) => {
              const displayTag = displayTagName(tag)
              return (
                <a href={tagPageUrl(tag)} class="tag-item" title={`${count} Notizen`}>
                  <span class="tag-name">#{displayTag}</span>
                  <span class="tag-badge">{count}</span>
                </a>
              )
            })}
          </div>

          {sortedTags.length > 20 && (
            <div class="show-all-tags">
              <a href="/tags" class="show-all-link">
                Alle {sortedTags.length} Tags ansehen →
              </a>
            </div>
          )}
        </div>

        <div class="usage-instructions">
          <h3>Wie funktioniert's?</h3>
          <ol>
            <li>
              <strong>⚠️ Wichtig:</strong> Lade jede Seite neu (F5 / Cmd+R), um Hypothesis zu
              aktivieren
            </li>
            <li>Markiere Text auf einer beliebigen Seite</li>
            <li>
              Klicke auf "Annotate" im Hypothesis-Popup (erscheint automatisch beim Markieren)
            </li>
            <li>
              Wähle die Gruppe <strong>"CIMEC Auditory Cortex"</strong> aus
            </li>
            <li>Schreibe deinen Kommentar und klicke auf "Post to CIMEC Auditory Cortex"</li>
          </ol>
          <p class="note">
            💡 Alle Annotationen in dieser Gruppe sind öffentlich und werden hier angezeigt.
          </p>
        </div>
      </div>
    )
  }

  AnnotationsOverview.css = `
    .annotations-overview {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .annotations-header {
      position: relative;
      margin-bottom: 2rem;
    }

    .annotations-header h1 {
      margin: 0.5rem 0;
      font-size: 2.5rem;
    }

    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      margin-bottom: 1rem;
      background: var(--lightgray);
      color: var(--darkgray);
      text-decoration: none;
      border-radius: 8px;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .back-button:hover {
      background: var(--secondary);
      color: white;
      transform: translateX(-4px);
    }

    .back-button svg {
      width: 18px;
      height: 18px;
    }

    .annotations-description {
      color: var(--gray);
      margin-bottom: 2rem;
      font-size: 1.1rem;
      line-height: 1.6;
    }

    .annotations-group-links {
      margin: 2rem 0;
    }

    .group-link {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      background: var(--secondary);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .group-link:hover {
      background: var(--tertiary);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .group-link svg {
      width: 20px;
      height: 20px;
    }

    .hypothesis-embed-container {
      margin: 3rem 0;
      background: var(--light);
      border: 1px solid var(--lightgray);
      border-radius: 8px;
      overflow: hidden;
    }

    .hypothesis-embed-container h2 {
      margin: 0;
      padding: 1.5rem;
      background: var(--lightgray);
      border-bottom: 1px solid var(--gray);
      font-size: 1.5rem;
    }

    .stream-note {
      padding: 1rem;
      color: var(--gray);
      font-size: 0.95rem;
      font-style: italic;
    }

    .annotations-list-container {
      padding: 1.5rem;
      max-height: 800px;
      overflow-y: auto;
    }

    .annotation-item {
      padding: 1.5rem;
      margin-bottom: 1rem;
      background: var(--light);
      border: 1px solid var(--lightgray);
      border-radius: 6px;
    }

    .annotation-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      color: var(--darkgray);
    }

    .annotation-meta .date {
      color: var(--gray);
      font-size: 0.9rem;
    }

    .annotation-item blockquote {
      margin: 1rem 0;
      padding: 0.75rem 1rem;
      background: var(--highlight);
      border-left: 3px solid var(--secondary);
      font-style: italic;
      color: var(--darkgray);
    }

    .annotation-item .annotation-text {
      margin: 1rem 0;
      line-height: 1.6;
    }

    .annotation-item .page-link {
      color: var(--secondary);
      text-decoration: none;
      font-weight: 500;
    }

    .annotation-item .page-link:hover {
      text-decoration: underline;
    }

    .no-annotations,
    .error {
      padding: 2rem;
      text-align: center;
      color: var(--gray);
      font-style: italic;
    }

    .error {
      color: var(--darkgray);
    }

    .usage-instructions {
      margin: 3rem 0;
      padding: 2rem;
      background: var(--highlight);
      border-left: 4px solid var(--secondary);
      border-radius: 8px;
    }

    .usage-instructions h3 {
      margin-top: 0;
      color: var(--secondary);
      font-size: 1.3rem;
    }

    .usage-instructions ol {
      margin: 1.5rem 0;
      padding-left: 1.5rem;
    }

    .usage-instructions li {
      margin: 0.75rem 0;
      line-height: 1.6;
      font-size: 1rem;
    }

    .usage-instructions strong {
      color: var(--secondary);
    }

    .usage-instructions .note {
      margin: 1.5rem 0 0 0;
      padding: 1rem;
      background: var(--light);
      border-radius: 6px;
      font-size: 0.95rem;
      font-style: italic;
    }

    .tags-section {
      margin: 3rem 0;
      padding: 2rem;
      background: var(--lightgray);
      border-radius: 12px;
      border-left: 4px solid var(--secondary);
    }

    .tags-section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .tags-section-header h2 {
      margin: 0;
      color: var(--dark);
      font-size: 1.75rem;
    }

    .tags-count {
      color: var(--gray);
      font-size: 1rem;
      font-weight: 500;
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .tag-item {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1rem;
      background: var(--light);
      border: 2px solid var(--lightgray);
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .tag-item:hover {
      background: var(--secondary);
      border-color: var(--secondary);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .tag-item:hover .tag-name {
      color: white;
    }

    .tag-item:hover .tag-badge {
      background: white;
      color: var(--secondary);
    }

    .tag-name {
      color: var(--secondary);
      font-weight: 600;
      font-size: 0.95rem;
    }

    .tag-badge {
      background: var(--secondary);
      color: white;
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      min-width: 1.5rem;
      text-align: center;
    }

    .show-all-tags {
      text-align: center;
      padding-top: 1rem;
      border-top: 1px solid var(--gray);
    }

    .show-all-link {
      color: var(--secondary);
      text-decoration: none;
      font-weight: 600;
      font-size: 1rem;
      transition: color 0.2s ease;
    }

    .show-all-link:hover {
      color: var(--tertiary);
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .annotations-overview {
        padding: 1rem 0.5rem;
      }

      .annotations-header h1 {
        font-size: 2rem;
      }

      .hypothesis-stream {
        height: 600px;
      }

      .usage-instructions {
        padding: 1.5rem;
      }

      .tags-section {
        padding: 1.5rem;
      }

      .tags-section-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .tags-section-header h2 {
        font-size: 1.5rem;
      }

      .tags-container {
        gap: 0.5rem;
      }

      .tag-item {
        padding: 0.5rem 0.75rem;
        font-size: 0.9rem;
      }
    }
  `

  return AnnotationsOverview
}) satisfies QuartzComponentConstructor
