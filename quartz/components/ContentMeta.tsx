import { Date as DateComponent, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        const date = getDate(cfg, fileData)
        if (date) {
          const now = new Date()
          const diffTime = Math.abs(now.getTime() - date.getTime())
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

          let timeAgo = ""
          if (diffDays === 0) {
            timeAgo = "heute"
          } else if (diffDays === 1) {
            timeAgo = "gestern"
          } else if (diffDays < 7) {
            timeAgo = `vor ${diffDays} Tagen`
          } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7)
            timeAgo = `vor ${weeks} ${weeks === 1 ? "Woche" : "Wochen"}`
          } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30)
            timeAgo = `vor ${months} ${months === 1 ? "Monat" : "Monaten"}`
          } else {
            const years = Math.floor(diffDays / 365)
            timeAgo = `vor ${years} ${years === 1 ? "Jahr" : "Jahren"}`
          }

          // Add "Neu" indicator for recently modified pages (within 7 days)
          const isNew = diffDays <= 7

          segments.push(
            <span class="last-modified">
              📝 Zuletzt geändert: <DateComponent date={date} locale={cfg.locale} /> ({timeAgo}){isNew && <span class="new-indicator"> 🆕</span>}
            </span>,
          )
        }
      }

      // Display word count
      const { words } = readingTime(text)
      segments.push(<span class="word-count">📊 {words} Wörter</span>)

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
