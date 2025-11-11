import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/recentChanges.scss"
import { resolveRelative } from "../util/path"
import { formatDate } from "./Date"

interface RecentChangesOptions {
  title?: string
  limit?: number
  showOnlyThesis?: boolean
  folderPath?: string
}

const defaultOptions: RecentChangesOptions = {
  title: "Was ist neu?",
  limit: 20,
  showOnlyThesis: false,
  folderPath: "Bachelorarbeit",
}

export default ((opts?: Partial<RecentChangesOptions>) => {
  const options: RecentChangesOptions = { ...defaultOptions, ...opts }

  const RecentChanges: QuartzComponent = ({
    fileData,
    allFiles,
    cfg,
  }: QuartzComponentProps) => {
    // Filter files and sort by modification date
    let files = allFiles.filter((file) => file.dates?.modified)

    if (options.showOnlyThesis) {
      files = files.filter(
        (file) =>
          file.slug?.startsWith(options.folderPath!) ||
          file.frontmatter?.tags?.includes("bachelorarbeit"),
      )
    }

    // Sort by most recent first
    files = files
      .sort((a, b) => {
        const dateA = a.dates?.modified?.getTime() || 0
        const dateB = b.dates?.modified?.getTime() || 0
        return dateB - dateA
      })
      .slice(0, options.limit)

    // Group by date
    const groupedByDate: Record<string, typeof files> = {}
    files.forEach((file) => {
      if (file.dates?.modified) {
        const dateKey = formatDate(file.dates.modified, cfg.locale)
        if (!groupedByDate[dateKey]) {
          groupedByDate[dateKey] = []
        }
        groupedByDate[dateKey].push(file)
      }
    })

    const getTimeAgo = (date: Date): string => {
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) return "heute"
      if (diffDays === 1) return "gestern"
      if (diffDays < 7) return `vor ${diffDays} Tagen`
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7)
        return `vor ${weeks} ${weeks === 1 ? "Woche" : "Wochen"}`
      }
      if (diffDays < 365) {
        const months = Math.floor(diffDays / 30)
        return `vor ${months} ${months === 1 ? "Monat" : "Monaten"}`
      }
      const years = Math.floor(diffDays / 365)
      return `vor ${years} ${years === 1 ? "Jahr" : "Jahren"}`
    }

    const statusMap: Record<string, { icon: string; color: string }> = {
      draft: { icon: "🟡", color: "draft" },
      review: { icon: "🔵", color: "review" },
      "needs-revision": { icon: "🟠", color: "needs-revision" },
      final: { icon: "🟢", color: "final" },
      approved: { icon: "✅", color: "approved" },
    }

    return (
      <div class="recent-changes">
        <h1>{options.title}</h1>
        <p class="changelog-intro">
          Hier siehst du alle kürzlich geänderten Seiten in chronologischer Reihenfolge.
        </p>

        <div class="changes-timeline">
          {Object.entries(groupedByDate).map(([date, filesOnDate]) => (
            <div class="date-group" key={date}>
              <div class="date-header">
                <span class="date-label">{date}</span>
                <span class="date-relative">{getTimeAgo(filesOnDate[0].dates!.modified!)}</span>
              </div>

              <div class="changes-list">
                {filesOnDate.map((file) => {
                  const status = file.frontmatter?.status as string | undefined
                  const needsFeedback = file.frontmatter?.needsFeedback as boolean | undefined
                  const currentStatus = status ? statusMap[status.toLowerCase()] : null

                  return (
                    <a
                      href={resolveRelative(fileData.slug!, file.slug!)}
                      class="change-item"
                      key={file.slug}
                    >
                      <div class="change-icon">📝</div>
                      <div class="change-content">
                        <div class="change-title-line">
                          <span class="change-title">{file.frontmatter?.title || file.slug}</span>
                          {needsFeedback && (
                            <span class="feedback-indicator" title="Feedback benötigt">
                              ⚠️
                            </span>
                          )}
                        </div>
                        {currentStatus && (
                          <span class={`change-status ${currentStatus.color}`}>
                            {currentStatus.icon} Status: {status}
                          </span>
                        )}
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {files.length === 0 && (
          <div class="no-changes">
            <p>Keine Änderungen gefunden.</p>
          </div>
        )}
      </div>
    )
  }

  RecentChanges.css = style
  return RecentChanges
}) satisfies QuartzComponentConstructor
