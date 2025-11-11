import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/pageNavigation.scss"
import { resolveRelative } from "../util/path"

interface PageNavigationOptions {
  showOnAllPages?: boolean
}

const defaultOptions: PageNavigationOptions = {
  showOnAllPages: false,
}

export default ((opts?: Partial<PageNavigationOptions>) => {
  const options: PageNavigationOptions = { ...defaultOptions, ...opts }

  const PageNavigation: QuartzComponent = ({ fileData, allFiles, cfg }: QuartzComponentProps) => {
    const prev = fileData.frontmatter?.prev as string | undefined
    const next = fileData.frontmatter?.next as string | undefined
    const chapter = fileData.frontmatter?.chapter as string | undefined

    // Only show if prev/next is defined or showOnAllPages is true
    if (!prev && !next && !options.showOnAllPages) {
      return null
    }

    const prevPage = prev
      ? allFiles.find((f) => f.slug === prev || f.frontmatter?.title === prev)
      : null
    const nextPage = next
      ? allFiles.find((f) => f.slug === next || f.frontmatter?.title === next)
      : null

    return (
      <nav class="page-navigation">
        {chapter && (
          <div class="chapter-info">
            <span class="chapter-label">Kapitel:</span>
            <span class="chapter-name">{chapter}</span>
          </div>
        )}
        <div class="nav-buttons">
          <div class="nav-button prev">
            {prevPage ? (
              <a href={resolveRelative(fileData.slug!, prevPage.slug!)}>
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
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <div class="nav-text">
                  <span class="nav-label">Vorherige Seite</span>
                  <span class="nav-title">{prevPage.frontmatter?.title || prevPage.slug}</span>
                </div>
              </a>
            ) : (
              <div class="nav-placeholder"></div>
            )}
          </div>
          <div class="nav-button next">
            {nextPage ? (
              <a href={resolveRelative(fileData.slug!, nextPage.slug!)}>
                <div class="nav-text">
                  <span class="nav-label">Nächste Seite</span>
                  <span class="nav-title">{nextPage.frontmatter?.title || nextPage.slug}</span>
                </div>
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
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </a>
            ) : (
              <div class="nav-placeholder"></div>
            )}
          </div>
        </div>
      </nav>
    )
  }

  PageNavigation.css = style
  return PageNavigation
}) satisfies QuartzComponentConstructor
