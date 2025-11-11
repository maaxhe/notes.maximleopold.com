import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/openFeedback.scss"
import { resolveRelative } from "../util/path"
import { formatDate } from "./Date"

interface OpenFeedbackOptions {
  title?: string
  showOnlyThesis?: boolean
  folderPath?: string
}

const defaultOptions: OpenFeedbackOptions = {
  title: "Offene Feedback-Punkte",
  showOnlyThesis: false,
  folderPath: "Bachelorarbeit",
}

export default ((opts?: Partial<OpenFeedbackOptions>) => {
  const options: OpenFeedbackOptions = { ...defaultOptions, ...opts }

  const OpenFeedback: QuartzComponent = ({ fileData, allFiles, cfg }: QuartzComponentProps) => {
    // Filter files that need feedback
    let feedbackFiles = allFiles.filter((file) => file.frontmatter?.needsFeedback === true)

    if (options.showOnlyThesis) {
      feedbackFiles = feedbackFiles.filter(
        (file) =>
          file.slug?.startsWith(options.folderPath!) ||
          file.frontmatter?.tags?.includes("bachelorarbeit"),
      )
    }

    // Sort by priority (no status = highest priority, then draft, review, etc.)
    feedbackFiles = feedbackFiles.sort((a, b) => {
      const statusPriority: Record<string, number> = {
        "needs-revision": 1,
        review: 2,
        draft: 3,
        final: 4,
        approved: 5,
      }

      const statusA = a.frontmatter?.status as string | undefined
      const statusB = b.frontmatter?.status as string | undefined

      const priorityA = statusA ? statusPriority[statusA.toLowerCase()] || 0 : 0
      const priorityB = statusB ? statusPriority[statusB.toLowerCase()] || 0 : 0

      return priorityA - priorityB
    })

    const statusMap: Record<string, { label: string; icon: string; color: string }> = {
      draft: { label: "Entwurf", icon: "🟡", color: "draft" },
      review: { label: "Review", icon: "🔵", color: "review" },
      "needs-revision": { label: "Überarbeitung", icon: "🟠", color: "needs-revision" },
      final: { label: "Final", icon: "🟢", color: "final" },
      approved: { label: "Genehmigt", icon: "✅", color: "approved" },
    }

    return (
      <div class="open-feedback">
        <h1>{options.title}</h1>

        <div class="feedback-summary">
          <div class="summary-box">
            <div class="summary-number">{feedbackFiles.length}</div>
            <div class="summary-label">
              {feedbackFiles.length === 1 ? "Offener Punkt" : "Offene Punkte"}
            </div>
          </div>
          {feedbackFiles.length === 0 && (
            <p class="all-done">
              🎉 Keine offenen Feedback-Punkte! Alle Seiten sind bereit oder benötigen kein
              Feedback.
            </p>
          )}
        </div>

        {feedbackFiles.length > 0 && (
          <div class="feedback-list">
            {feedbackFiles.map((file, index) => {
              const status = file.frontmatter?.status as string | undefined
              const feedbackNote = file.frontmatter?.feedbackNote as string | undefined
              const progress = file.frontmatter?.progress as number | undefined
              const chapterNumber = file.frontmatter?.chapterNumber as number | undefined
              const currentStatus = status ? statusMap[status.toLowerCase()] : null
              const lastModified = file.dates?.modified

              return (
                <div class="feedback-item" key={file.slug}>
                  <div class="feedback-item-header">
                    <span class="item-number">#{index + 1}</span>
                    <a
                      href={resolveRelative(fileData.slug!, file.slug!)}
                      class="feedback-item-link"
                    >
                      {chapterNumber && <span class="chapter-num">{chapterNumber}.</span>}
                      <span class="item-title">{file.frontmatter?.title || file.slug}</span>
                    </a>
                  </div>

                  <div class="feedback-item-meta">
                    {currentStatus && (
                      <span class={`status-indicator ${currentStatus.color}`}>
                        {currentStatus.icon} {currentStatus.label}
                      </span>
                    )}
                    {progress !== undefined && (
                      <span class="progress-indicator">{progress}% fertig</span>
                    )}
                    {lastModified && (
                      <span class="update-time">
                        Aktualisiert: {formatDate(lastModified, cfg.locale)}
                      </span>
                    )}
                  </div>

                  {feedbackNote && (
                    <div class="feedback-note">
                      <span class="note-icon">💬</span>
                      <span class="note-text">{feedbackNote}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div class="feedback-instructions">
          <h3>Wie nutze ich das?</h3>
          <p>
            Füge zu deinem Frontmatter <code>needsFeedback: true</code> hinzu, und die Seite
            erscheint hier automatisch.
          </p>
          <p>
            Optional: Füge <code>feedbackNote: "Deine Frage"</code> hinzu, um spezifisches
            Feedback anzufragen.
          </p>
        </div>
      </div>
    )
  }

  OpenFeedback.css = style
  return OpenFeedback
}) satisfies QuartzComponentConstructor
