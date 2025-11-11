import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import { resolveRelative } from "../util/path"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"
import style from "./styles/filteredToggleList.scss"

interface Options {
  summary: string
  description?: string
  limit?: number
  filter: (f: QuartzPluginData) => boolean
  sort?: (a: QuartzPluginData, b: QuartzPluginData) => number
  defaultOpen?: boolean
  emptyLabel?: string
}

const defaultOptions = {
  limit: 5,
  defaultOpen: false,
  emptyLabel: "No notes yet.",
} satisfies Required<Pick<Options, "limit" | "defaultOpen" | "emptyLabel">>

export default ((userOpts: Options) => {
  const FilteredToggleList: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = {
      ...defaultOptions,
      sort: byDateAndAlphabetical(cfg),
      ...userOpts,
    }

    const pages = allFiles.filter(opts.filter).sort(opts.sort)
    const { summary, description, limit, defaultOpen, emptyLabel } = opts

    return (
      <details class={classNames(displayClass, "filtered-toggle-list")} open={defaultOpen}>
        <summary>{summary}</summary>
        {description && <p class="description">{description}</p>}
        <ul>
          {pages.slice(0, limit).map((page) => {
            const title = page.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
            const href = resolveRelative(fileData.slug!, page.slug!)

            return (
              <li>
                <a href={href} class="internal">
                  {title}
                </a>
              </li>
            )
          })}
          {pages.length === 0 && <li class="empty">{emptyLabel}</li>}
        </ul>
      </details>
    )
  }

  FilteredToggleList.css = style
  return FilteredToggleList
}) satisfies QuartzComponentConstructor
