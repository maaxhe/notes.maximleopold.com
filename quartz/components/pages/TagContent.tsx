import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { PageList, SortFn } from "../PageList"
import { FullSlug, getAllSegmentPrefixes, resolveRelative, simplifySlug } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"
import { ComponentChildren } from "preact"
import { concatenateResources } from "../../util/resources"

interface TagContentOptions {
  sort?: SortFn
  numPages: number
}

const defaultOptions: TagContentOptions = {
  numPages: 10,
}

export default ((opts?: Partial<TagContentOptions>) => {
  const options: TagContentOptions = { ...defaultOptions, ...opts }

  const TagContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props
    const slug = fileData.slug

    if (!(slug?.startsWith("tags/") || slug === "tags")) {
      throw new Error(`Component "TagContent" tried to render a non-tag page: ${slug}`)
    }

    // Tag display mapping - transform certain tags for display
    const displayTagName = (tag: string): string => {
      const tagMap: Record<string, string> = {
        "stream/dorsal": "dorsalstream",
        "stream/ventral": "ventralstream",
      }
      return tagMap[tag] || tag
    }

    const tag = simplifySlug(slug.slice("tags/".length) as FullSlug)
    const allPagesWithTag = (tag: string) =>
      allFiles.filter((file) =>
        (file.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes).includes(tag),
      )

    const content = (
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    ) as ComponentChildren
    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = cssClasses.join(" ")
    if (tag === "/") {
      const tags = [
        ...new Set(
          allFiles.flatMap((data) => data.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes),
        ),
      ].sort((a, b) => a.localeCompare(b))
      const tagItemMap: Map<string, QuartzPluginData[]> = new Map()
      for (const tag of tags) {
        tagItemMap.set(tag, allPagesWithTag(tag))
      }

      // Calculate font sizes for tag cloud
      const counts = tags.map((tag) => tagItemMap.get(tag)!.length)
      const minCount = Math.min(...counts)
      const maxCount = Math.max(...counts)
      const getFontSize = (count: number): number => {
        if (minCount === maxCount) return 1.0
        const normalized = (count - minCount) / (maxCount - minCount)
        return 0.9 + normalized * 1.1 // Range from 0.9rem to 2.0rem
      }

      return (
        <div class="popover-hint tag-overview-page">
          <article class={classes}>
            <div class="tag-cloud-header">
              <h1>Alle Tags</h1>
              <p class="tag-cloud-description">
                {i18n(cfg.locale).pages.tagContent.totalTags({ count: tags.length })}
              </p>
            </div>
            {content}
          </article>

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
              </svg>
              Cloud
            </button>
            <button class="view-toggle-btn" data-view="list">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
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

          <div class="tag-cloud-view">
            {tags.map((tag) => {
              const pages = tagItemMap.get(tag)!
              const tagListingPage = `/tags/${tag}` as FullSlug
              const href = resolveRelative(fileData.slug!, tagListingPage)
              const fontSize = getFontSize(pages.length)
              const displayTag = displayTagName(tag)

              return (
                <a
                  href={href}
                  class="tag-cloud-item internal"
                  style={`font-size: ${fontSize}rem;`}
                  data-tag={displayTag}
                  data-count={pages.length}
                  title={`${pages.length} ${pages.length === 1 ? "Notiz" : "Notizen"}`}
                >
                  #{displayTag}
                  <span class="tag-count">({pages.length})</span>
                </a>
              )
            })}
          </div>

          <div class="tag-list-view" style="display: none;">
            {tags.map((tag) => {
              const pages = tagItemMap.get(tag)!
              const listProps = {
                ...props,
                allFiles: pages,
              }

              const contentPage = allFiles.filter((file) => file.slug === `tags/${tag}`).at(0)

              const root = contentPage?.htmlAst
              const tagDescription =
                !root || root?.children.length === 0
                  ? contentPage?.description
                  : htmlToJsx(contentPage.filePath!, root)

              const tagListingPage = `/tags/${tag}` as FullSlug
              const href = resolveRelative(fileData.slug!, tagListingPage)
              const displayTag = displayTagName(tag)

              return (
                <div class="tag-list-item" data-tag={displayTag}>
                  <div class="tag-list-header">
                    <h2>
                      <a class="internal tag-link" href={href}>
                        #{displayTag}
                      </a>
                    </h2>
                    <span class="tag-badge">{pages.length}</span>
                  </div>
                  {tagDescription && <div class="tag-description">{tagDescription}</div>}
                  <div class="page-listing">
                    <p class="tag-item-count">
                      {i18n(cfg.locale).pages.tagContent.itemsUnderTag({ count: pages.length })}
                      {pages.length > options.numPages && (
                        <>
                          {" "}
                          <span class="showing-first">
                            {i18n(cfg.locale).pages.tagContent.showingFirst({
                              count: options.numPages,
                            })}
                          </span>
                        </>
                      )}
                    </p>
                    <PageList limit={options.numPages} {...listProps} sort={options?.sort} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    } else {
      const pages = allPagesWithTag(tag)
      const listProps = {
        ...props,
        allFiles: pages,
      }

      return (
        <div class="popover-hint">
          <article class={classes}>{content}</article>
          <div class="page-listing">
            <p>{i18n(cfg.locale).pages.tagContent.itemsUnderTag({ count: pages.length })}</p>
            <div>
              <PageList {...listProps} sort={options?.sort} />
            </div>
          </div>
        </div>
      )
    }
  }

  TagContent.afterDOMLoaded = `
    const searchInput = document.querySelector('.tag-search-input');
    const tagCloudItems = document.querySelectorAll('.tag-cloud-item');
    const tagListItems = document.querySelectorAll('.tag-list-item');
    const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
    const tagCloudView = document.querySelector('.tag-cloud-view');
    const tagListView = document.querySelector('.tag-list-view');

    // Search functionality
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        // Filter cloud view
        tagCloudItems.forEach(item => {
          const tag = item.dataset.tag;
          if (tag && tag.includes(searchTerm)) {
            item.style.display = 'inline-block';
          } else {
            item.style.display = 'none';
          }
        });

        // Filter list view
        tagListItems.forEach(item => {
          const tag = item.dataset.tag;
          if (tag && tag.includes(searchTerm)) {
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
          if (tagCloudView) tagCloudView.style.display = 'flex';
          if (tagListView) tagListView.style.display = 'none';
        } else {
          if (tagCloudView) tagCloudView.style.display = 'none';
          if (tagListView) tagListView.style.display = 'block';
        }
      });
    });
  `

  const tagContentStyles = `
    .tag-overview-page {
      max-width: 1200px;
      margin: 0 auto;
    }

    .tag-cloud-header {
      margin-bottom: 1.5rem;
      border-bottom: 2px solid var(--lightgray);
      padding-bottom: 1rem;
    }

    .tag-cloud-header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2.5rem;
      color: var(--dark);
      font-weight: 700;
    }

    .tag-cloud-description {
      color: var(--gray);
      font-size: 1.1rem;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .tag-search-container {
      margin: 2rem 0 1.5rem 0;
    }

    .tag-search-input {
      width: 100%;
      max-width: 600px;
      padding: 0.875rem 1.25rem;
      font-size: 1rem;
      border: 2px solid var(--lightgray);
      border-radius: 12px;
      background: var(--light);
      color: var(--dark);
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .tag-search-input:focus {
      outline: none;
      border-color: var(--secondary);
      box-shadow: 0 0 0 4px var(--highlight);
    }

    .tag-search-input::placeholder {
      color: var(--gray);
    }

    .view-toggle {
      display: flex;
      gap: 0.75rem;
      margin: 1.5rem 0 2rem 0;
      border-bottom: 2px solid var(--lightgray);
      padding-bottom: 1rem;
    }

    .view-toggle-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      background: var(--light);
      border: 2px solid var(--lightgray);
      border-radius: 8px;
      color: var(--dark);
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .view-toggle-btn:hover {
      background: var(--highlight);
      border-color: var(--secondary);
      transform: translateY(-1px);
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

    .tag-cloud-view {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
      margin: 2rem 0;
      padding: 2.5rem;
      background: var(--highlight);
      border-radius: 12px;
      min-height: 250px;
      justify-content: center;
      border: 1px solid var(--lightgray);
    }

    .tag-cloud-item {
      display: inline-block;
      padding: 0.5rem 1rem;
      color: var(--secondary);
      text-decoration: none;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 8px;
      font-weight: 600;
      line-height: 1.5;
      white-space: nowrap;
      background: var(--light);
      border: 2px solid var(--lightgray);
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .tag-cloud-item:hover {
      background: var(--secondary);
      color: white;
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border-color: var(--secondary);
    }

    .tag-cloud-item .tag-count {
      margin-left: 0.4rem;
      font-size: 0.85em;
      opacity: 0.7;
      font-weight: 500;
    }

    .tag-list-view {
      margin: 2rem 0;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .tag-list-item {
      padding: 1.5rem;
      border: 2px solid var(--lightgray);
      border-radius: 12px;
      transition: all 0.2s ease;
      background: var(--light);
    }

    .tag-list-item:hover {
      background: var(--highlight);
      border-color: var(--secondary);
      transform: translateX(8px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .tag-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .tag-list-header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .tag-list-header .tag-link {
      color: var(--secondary);
      text-decoration: none;
      transition: color 0.2s ease;
      font-weight: 700;
    }

    .tag-list-header .tag-link:hover {
      color: var(--tertiary);
    }

    .tag-badge {
      background: var(--secondary);
      color: white;
      padding: 0.375rem 0.875rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      min-width: 2.5rem;
      text-align: center;
    }

    .tag-description {
      color: var(--gray);
      margin-bottom: 1rem;
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .page-listing {
      margin-top: 1rem;
    }

    .tag-item-count {
      color: var(--gray);
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
    }

    .showing-first {
      color: var(--secondary);
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .tag-overview-page {
        padding: 1rem 0.5rem;
      }

      .tag-cloud-header h1 {
        font-size: 2rem;
      }

      .tag-cloud-view {
        padding: 1.5rem;
        gap: 0.75rem;
      }

      .tag-cloud-item {
        font-size: 0.9rem !important;
        padding: 0.375rem 0.75rem;
      }

      .view-toggle {
        flex-direction: column;
      }

      .view-toggle-btn {
        width: 100%;
        justify-content: center;
      }

      .tag-list-item:hover {
        transform: translateX(4px);
      }

      .tag-search-input {
        font-size: 0.95rem;
      }
    }
  `

  TagContent.css = concatenateResources(style, PageList.css, tagContentStyles)
  return TagContent
}) satisfies QuartzComponentConstructor
