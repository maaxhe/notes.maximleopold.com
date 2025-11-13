import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { FullSlug, resolveRelative, simplifySlug } from "../util/path"

interface TagCloudOptions {
  showCount?: boolean
  minFontSize?: number
  maxFontSize?: number
}

const defaultOptions: TagCloudOptions = {
  showCount: true,
  minFontSize: 0.9,
  maxFontSize: 2.0,
}

export default ((opts?: Partial<TagCloudOptions>) => {
  const options: TagCloudOptions = { ...defaultOptions, ...opts }

  const TagCloud: QuartzComponent = ({ fileData, allFiles, displayClass, cfg }: QuartzComponentProps) => {
    // Collect all tags and their counts
    const tagCounts = new Map<string, { count: number; pages: Set<string> }>()

    for (const file of allFiles) {
      const tags = file.frontmatter?.tags ?? []
      const normalizedTags = Array.isArray(tags)
        ? tags.map(tag => typeof tag === "string" ? tag.toLowerCase() : "")
        : typeof tags === "string"
        ? [tags.toLowerCase()]
        : []

      for (const tag of normalizedTags) {
        if (!tag) continue

        if (!tagCounts.has(tag)) {
          tagCounts.set(tag, { count: 0, pages: new Set() })
        }

        const tagData = tagCounts.get(tag)!
        tagData.count++
        tagData.pages.add(file.slug!)
      }
    }

    // Sort tags alphabetically
    const sortedTags = Array.from(tagCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))

    // Calculate font sizes based on count
    const counts = Array.from(tagCounts.values()).map(t => t.count)
    const minCount = Math.min(...counts)
    const maxCount = Math.max(...counts)

    const getFontSize = (count: number): number => {
      if (minCount === maxCount) return options.minFontSize!
      const normalized = (count - minCount) / (maxCount - minCount)
      return options.minFontSize! + normalized * (options.maxFontSize! - options.minFontSize!)
    }

    const baseUrl = cfg.baseUrl ?? ""
    const tagPageUrl = (tag: string) => {
      const slug = simplifySlug(`tags/${tag}` as FullSlug)
      return resolveRelative(fileData.slug!, slug)
    }

    return (
      <div class={classNames(displayClass, "tag-cloud-container")}>
        <div class="tag-cloud-header">
          <h1>Alle Tags</h1>
          <p class="tag-cloud-description">
            {sortedTags.length} Tags · {allFiles.length} Notizen
          </p>
        </div>

        <div class="tag-search-container">
          <input
            type="text"
            class="tag-search-input"
            placeholder="Nach Tags suchen..."
            aria-label="Tags durchsuchen"
          />
        </div>

        <div class="view-toggle">
          <button class="view-toggle-btn active" data-view="cloud">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
            </svg>
            Cloud
          </button>
          <button class="view-toggle-btn" data-view="list">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Liste
          </button>
        </div>

        <div class="tag-cloud">
          {sortedTags.map(([tag, data]) => {
            const fontSize = getFontSize(data.count)
            return (
              <a
                href={tagPageUrl(tag)}
                class="tag-cloud-item"
                style={`font-size: ${fontSize}rem;`}
                data-tag={tag}
                data-count={data.count}
                title={`${data.count} ${data.count === 1 ? "Notiz" : "Notizen"}`}
              >
                #{tag}
                {options.showCount && <span class="tag-count">({data.count})</span>}
              </a>
            )
          })}
        </div>

        <div class="tag-list-container" style="display: none;">
          <div class="tag-list">
            {sortedTags.map(([tag, data]) => (
              <div class="tag-list-item" data-tag={tag}>
                <a href={tagPageUrl(tag)} class="tag-list-link">
                  <span class="tag-name">#{tag}</span>
                  <span class="tag-list-count">{data.count} {data.count === 1 ? "Notiz" : "Notizen"}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  TagCloud.afterDOMLoaded = `
    const searchInput = document.querySelector('.tag-search-input');
    const tagCloudItems = document.querySelectorAll('.tag-cloud-item');
    const tagListItems = document.querySelectorAll('.tag-list-item');
    const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
    const tagCloud = document.querySelector('.tag-cloud');
    const tagListContainer = document.querySelector('.tag-list-container');

    // Search functionality
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        // Filter cloud view
        tagCloudItems.forEach(item => {
          const tag = item.dataset.tag;
          if (tag.includes(searchTerm)) {
            item.style.display = 'inline-block';
          } else {
            item.style.display = 'none';
          }
        });

        // Filter list view
        tagListItems.forEach(item => {
          const tag = item.dataset.tag;
          if (tag.includes(searchTerm)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    }

    // View toggle functionality
    viewToggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;

        // Update active state
        viewToggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle views
        if (view === 'cloud') {
          tagCloud.style.display = 'flex';
          tagListContainer.style.display = 'none';
        } else {
          tagCloud.style.display = 'none';
          tagListContainer.style.display = 'block';
        }
      });
    });
  `

  TagCloud.css = `
    .tag-cloud-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0;
    }

    .tag-cloud-header {
      margin-bottom: 1.5rem;
    }

    .tag-cloud-header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      color: var(--dark);
      font-weight: 700;
    }

    .tag-cloud-description {
      color: var(--gray);
      font-size: 1rem;
      margin: 0;
    }

    .tag-search-container {
      margin: 1.5rem 0;
    }

    .tag-search-input {
      width: 100%;
      max-width: 500px;
      padding: 0.75rem 1rem;
      font-size: 0.95rem;
      border: 2px solid var(--lightgray);
      border-radius: 8px;
      background: var(--light);
      color: var(--dark);
      transition: all 0.2s ease;
    }

    .tag-search-input:focus {
      outline: none;
      border-color: var(--secondary);
      box-shadow: 0 0 0 3px var(--highlight);
    }

    .view-toggle {
      display: flex;
      gap: 0.5rem;
      margin: 1.5rem 0;
    }

    .view-toggle-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--light);
      border: 2px solid var(--lightgray);
      border-radius: 6px;
      color: var(--dark);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .view-toggle-btn:hover {
      background: var(--highlight);
      border-color: var(--secondary);
    }

    .view-toggle-btn.active {
      background: var(--secondary);
      border-color: var(--secondary);
      color: white;
    }

    .view-toggle-btn svg {
      width: 14px;
      height: 14px;
    }

    .tag-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
      margin: 2rem 0;
      padding: 2rem;
      background: var(--highlight);
      border-radius: 8px;
      min-height: 200px;
      justify-content: center;
    }

    .tag-cloud-item {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      color: var(--secondary);
      text-decoration: none;
      transition: all 0.2s ease;
      border-radius: 6px;
      font-weight: 600;
      line-height: 1.4;
      white-space: nowrap;
      background: var(--light);
      border: 1px solid var(--lightgray);
    }

    .tag-cloud-item:hover {
      background: var(--secondary);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .tag-cloud-item .tag-count {
      margin-left: 0.3rem;
      font-size: 0.85em;
      opacity: 0.7;
      font-weight: 400;
    }

    .tag-list-container {
      margin: 2rem 0;
    }

    .tag-list {
      display: grid;
      gap: 0.5rem;
    }

    .tag-list-item {
      border: 1px solid var(--lightgray);
      border-radius: 6px;
      transition: all 0.2s ease;
      background: var(--light);
    }

    .tag-list-item:hover {
      background: var(--highlight);
      border-color: var(--secondary);
      transform: translateX(4px);
    }

    .tag-list-link {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.875rem 1.25rem;
      text-decoration: none;
      color: var(--dark);
    }

    .tag-name {
      font-weight: 600;
      color: var(--secondary);
      font-size: 1rem;
    }

    .tag-list-count {
      color: var(--gray);
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .tag-cloud-container {
        padding: 1rem 0.5rem;
      }

      .tag-cloud-header h1 {
        font-size: 2rem;
      }

      .tag-cloud {
        padding: 1rem;
        gap: 0.5rem;
      }

      .view-toggle {
        flex-direction: column;
      }

      .view-toggle-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `

  return TagCloud
}) satisfies QuartzComponentConstructor
