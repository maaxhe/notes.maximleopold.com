import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/bibliography.scss"
import { classNames } from "../util/lang"

interface BibliographyOptions {
  title?: string
  showCount?: boolean
}

const defaultOptions: BibliographyOptions = {
  title: "Literaturverzeichnis",
  showCount: true,
}

export default ((opts?: Partial<BibliographyOptions>) => {
  const options: BibliographyOptions = { ...defaultOptions, ...opts }

  const Bibliography: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const sources = fileData.frontmatter?.sources as string[] | undefined
    const bibliography = fileData.frontmatter?.bibliography as
      | Array<{ author: string; year: string; title: string; journal?: string; url?: string }>
      | undefined

    if (!sources && !bibliography) {
      return null
    }

    return (
      <div class={classNames(displayClass, "bibliography")}>
        <h3>
          {options.title}
          {options.showCount && (sources || bibliography) && (
            <span class="bib-count">
              ({sources?.length || bibliography?.length || 0} Quellen)
            </span>
          )}
        </h3>
        <div class="bibliography-content">
          {sources && (
            <ul class="sources-list">
              {sources.map((source, idx) => (
                <li key={idx} class="source-item">
                  <span class="source-number">[{idx + 1}]</span>
                  <span class="source-text">{source}</span>
                </li>
              ))}
            </ul>
          )}
          {bibliography && (
            <ul class="bibliography-list">
              {bibliography.map((entry, idx) => (
                <li key={idx} class="bib-entry">
                  <span class="bib-number">[{idx + 1}]</span>
                  <div class="bib-details">
                    <span class="bib-author">{entry.author}</span>
                    <span class="bib-year">({entry.year})</span>
                    {". "}
                    <span class="bib-title">{entry.title}</span>
                    {entry.journal && (
                      <>
                        {". "}
                        <span class="bib-journal">
                          <em>{entry.journal}</em>
                        </span>
                      </>
                    )}
                    {entry.url && (
                      <>
                        {". "}
                        <a href={entry.url} class="bib-url" target="_blank" rel="noopener">
                          Link
                        </a>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  Bibliography.css = style
  return Bibliography
}) satisfies QuartzComponentConstructor
