import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/thesisDashboard.scss"
import { resolveRelative } from "../util/path"
import { formatDate } from "./Date"

interface ThesisDashboardOptions {
  title?: string
  folderPath?: string
  showProgress?: boolean
}

const defaultOptions: ThesisDashboardOptions = {
  title: "Bachelorarbeit - Übersicht",
  folderPath: "bachelorarbeit/schreiben",
  showProgress: true,
}

export default ((opts?: Partial<ThesisDashboardOptions>) => {
  const options: ThesisDashboardOptions = { ...defaultOptions, ...opts }
  const normalizedFolderPath = options.folderPath?.toLowerCase()

  const ThesisDashboard: QuartzComponent = ({ fileData, allFiles, cfg }: QuartzComponentProps) => {
    // Filter files that are in the BA folder or have BA tag
    const thesisFiles = allFiles
      .filter((file) => {
        const slugLower = file.slug?.toLowerCase() ?? ""
        const matchesFolder = normalizedFolderPath
          ? slugLower.startsWith(normalizedFolderPath)
          : false
        const tags = (file.frontmatter?.tags ?? []).flatMap((tag) =>
          typeof tag === "string" ? [tag.toLowerCase()] : [],
        )
        const hasBATag = tags.includes("ba")
        return matchesFolder || hasBATag
      })
      .filter((file) => file.slug !== fileData.slug) // Don't show current page
      .sort((a, b) => {
        // Sort by chapter number if available
        const chapterA = a.frontmatter?.chapterNumber as number | undefined
        const chapterB = b.frontmatter?.chapterNumber as number | undefined
        if (chapterA && chapterB) return chapterA - chapterB
        // Otherwise sort by title
        return (a.frontmatter?.title || a.slug || "").localeCompare(
          b.frontmatter?.title || b.slug || "",
        )
      })

    // Don't show dashboard if there are no thesis files
    if (thesisFiles.length === 0) {
      return null
    }

    // Calculate overall statistics
    const totalFiles = thesisFiles.length
    const completedFiles = thesisFiles.filter(
      (f) => f.frontmatter?.status === "final" || f.frontmatter?.status === "approved",
    ).length
    const inReviewFiles = thesisFiles.filter((f) => f.frontmatter?.status === "review").length
    const draftFiles = thesisFiles.filter((f) => f.frontmatter?.status === "draft").length

    const averageProgress =
      thesisFiles.length > 0
        ? Math.round(
            thesisFiles.reduce((acc, f) => acc + (f.frontmatter?.progress || 0), 0) /
              thesisFiles.length,
          )
        : 0

    const statusMap: Record<string, { label: string; icon: string; color: string }> = {
      draft: { label: "Entwurf", icon: "🟡", color: "draft" },
      review: { label: "Review", icon: "🔵", color: "review" },
      "needs-revision": { label: "Überarbeitung", icon: "🟠", color: "needs-revision" },
      final: { label: "Final", icon: "🟢", color: "final" },
      approved: { label: "Genehmigt", icon: "✅", color: "approved" },
    }

    return (
      <div class="thesis-dashboard">
        <h1>{options.title}</h1>

        <div class="dashboard-stats">
          <div class="stat-card">
            <div class="stat-number">{totalFiles}</div>
            <div class="stat-label">Gesamt Seiten</div>
          </div>
          <div class="stat-card completed">
            <div class="stat-number">{completedFiles}</div>
            <div class="stat-label">Fertig</div>
          </div>
          <div class="stat-card review">
            <div class="stat-number">{inReviewFiles}</div>
            <div class="stat-label">In Review</div>
          </div>
          <div class="stat-card draft">
            <div class="stat-number">{draftFiles}</div>
            <div class="stat-label">Entwürfe</div>
          </div>
        </div>

        {options.showProgress && (
          <div class="overall-progress">
            <h3>Gesamtfortschritt</h3>
            <div class="progress-bar-large">
              <div class="progress-fill" style={`width: ${averageProgress}%`}></div>
            </div>
            <span class="progress-label">{averageProgress}% abgeschlossen</span>
          </div>
        )}

        <div class="thesis-chapters">
          <h3>Alle Kapitel</h3>
          <div class="chapters-list">
            {thesisFiles.map((file) => {
              const status = file.frontmatter?.status as string | undefined
              const progress = file.frontmatter?.progress as number | undefined
              const needsFeedback = file.frontmatter?.needsFeedback as boolean | undefined
              const chapterNumber = file.frontmatter?.chapterNumber as number | undefined
              const currentStatus = status ? statusMap[status.toLowerCase()] : null
              const lastModified = file.dates?.modified

              return (
                <a
                  href={resolveRelative(fileData.slug!, file.slug!)}
                  class="chapter-card"
                  key={file.slug}
                >
                  <div class="chapter-header">
                    <div class="chapter-title-section">
                      {chapterNumber && <span class="chapter-number">{chapterNumber}.</span>}
                      <span class="chapter-title">{file.frontmatter?.title || file.slug}</span>
                    </div>
                    <div class="chapter-badges">
                      {needsFeedback && (
                        <span class="feedback-badge" title="Feedback benötigt">
                          ⚠️
                        </span>
                      )}
                      {currentStatus && (
                        <span class={`status-badge-small ${currentStatus.color}`}>
                          {currentStatus.icon} {currentStatus.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {progress !== undefined && (
                    <div class="chapter-progress">
                      <div class="progress-bar-small">
                        <div class="progress-fill" style={`width: ${progress}%`}></div>
                      </div>
                      <span class="progress-text">{progress}%</span>
                    </div>
                  )}

                  {lastModified && (
                    <div class="chapter-meta">
                      <span class="last-update">
                        Zuletzt aktualisiert: {formatDate(lastModified, cfg.locale)}
                      </span>
                    </div>
                  )}
                </a>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  ThesisDashboard.css = style
  return ThesisDashboard
}) satisfies QuartzComponentConstructor
