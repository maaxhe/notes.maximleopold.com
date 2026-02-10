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

  // Parse title to extract major.minor chapter numbers (e.g., "3.2 Selection of ROIs" → {major: 3, minor: 2})
  const parseChapterVersion = (title: string): { major: number; minor: number } | null => {
    const match = title.match(/^(\d+)\.(\d+)/)
    if (match) {
      return { major: parseInt(match[1]), minor: parseInt(match[2]) }
    }
    return null
  }

  type FileEntry = ReturnType<typeof Array.prototype.filter<any>> extends (infer T)[] ? T : never

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

    // Don't show dashboard if there are no thesis files
    if (thesisFiles.length === 0) {
      return null
    }

    // Group files by major chapter number
    interface ChapterGroup {
      major: number
      main: (typeof thesisFiles)[number] | null
      subs: (typeof thesisFiles)[number][]
    }

    const groups = new Map<number, ChapterGroup>()
    const ungrouped: (typeof thesisFiles)[number][] = []

    for (const file of thesisFiles) {
      const title = (file.frontmatter?.title as string) || file.slug || ""
      const version = parseChapterVersion(title)

      if (version) {
        if (!groups.has(version.major)) {
          groups.set(version.major, { major: version.major, main: null, subs: [] })
        }
        const group = groups.get(version.major)!
        if (version.minor === 0) {
          group.main = file
        } else {
          group.subs.push(file)
        }
      } else {
        ungrouped.push(file)
      }
    }

    // Sort groups by major number and subs by minor number
    const sortedGroups = [...groups.entries()]
      .sort(([a], [b]) => a - b)
      .map(([_, group]) => {
        group.subs.sort((a, b) => {
          const va = parseChapterVersion((a.frontmatter?.title as string) || "")
          const vb = parseChapterVersion((b.frontmatter?.title as string) || "")
          return (va?.minor ?? 0) - (vb?.minor ?? 0)
        })
        return group
      })

    // Calculate average progress for a chapter group (only from sub-chapters)
    const groupAverageProgress = (group: ChapterGroup): number => {
      if (group.subs.length === 0) return 0
      const total = group.subs.reduce(
        (acc, f) => acc + ((f.frontmatter?.progress as number) || 0),
        0,
      )
      return Math.round(total / group.subs.length)
    }

    // Flatten all files for statistics (preserving original behavior)
    const allThesisFiles = [
      ...sortedGroups.flatMap((g) => [...(g.main ? [g.main] : []), ...g.subs]),
      ...ungrouped,
    ]

    // Calculate overall statistics
    const totalFiles = allThesisFiles.length
    const statusOf = (f: (typeof thesisFiles)[number]) =>
      typeof f.frontmatter?.status === "string" ? f.frontmatter.status.toLowerCase() : undefined
    const draftFiles = allThesisFiles.filter((f) => statusOf(f) === "draft").length
    const inReviewFiles = allThesisFiles.filter((f) => statusOf(f) === "review").length
    const needsRevisionFiles = allThesisFiles.filter(
      (f) => statusOf(f) === "needs-revision",
    ).length
    const finalFiles = allThesisFiles.filter((f) => statusOf(f) === "final").length
    const approvedFiles = allThesisFiles.filter((f) => statusOf(f) === "approved").length

    const averageProgress =
      allThesisFiles.length > 0
        ? Math.round(
            allThesisFiles.reduce((acc, f) => acc + (f.frontmatter?.progress || 0), 0) /
              allThesisFiles.length,
          )
        : 0

    const statusMap: Record<string, { label: string; icon: string; color: string }> = {
      draft: { label: "Entwurf", icon: "🟡", color: "draft" },
      review: { label: "Review", icon: "🔵", color: "review" },
      "needs-revision": { label: "Überarbeitung", icon: "🟠", color: "needs-revision" },
      final: { label: "Final", icon: "🟢", color: "final" },
      approved: { label: "Genehmigt", icon: "✅", color: "approved" },
    }

    // Render a single chapter card
    const renderChapterCard = (
      file: (typeof thesisFiles)[number],
      isSub: boolean,
      overrideProgress?: number,
    ) => {
      const status = file.frontmatter?.status as string | undefined
      const progress = overrideProgress ?? (file.frontmatter?.progress as number | undefined)
      const needsFeedback = file.frontmatter?.needsFeedback as boolean | undefined
      const chapterNumber = file.frontmatter?.chapterNumber as number | undefined
      const currentStatus = status ? statusMap[status.toLowerCase()] : null
      const lastModified = file.dates?.modified

      return (
        <a
          href={resolveRelative(fileData.slug!, file.slug!)}
          class={`chapter-card${isSub ? " chapter-sub" : ""}`}
          key={file.slug}
        >
          <div class="chapter-header">
            <div class="chapter-title-section">
              {chapterNumber != null && <span class="chapter-number">{chapterNumber}.</span>}
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
    }

    return (
      <div class="thesis-dashboard">
        <h1>{options.title}</h1>

        <div class="dashboard-stats">
          <div class="stat-card">
            <div class="stat-number">{totalFiles}</div>
            <div class="stat-label">Gesamt Seiten</div>
          </div>
          <div class="stat-card draft">
            <div class="stat-number">{draftFiles}</div>
            <div class="stat-label">Draft</div>
          </div>
          <div class="stat-card review">
            <div class="stat-number">{inReviewFiles}</div>
            <div class="stat-label">In Review</div>
          </div>
          <div class="stat-card needs-revision">
            <div class="stat-number">{needsRevisionFiles}</div>
            <div class="stat-label">Überarbeitung</div>
          </div>
          <div class="stat-card completed">
            <div class="stat-number">{finalFiles}</div>
            <div class="stat-label">Final</div>
          </div>
          <div class="stat-card approved">
            <div class="stat-number">{approvedFiles}</div>
            <div class="stat-label">Genehmigt</div>
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
            {sortedGroups.map((group) => {
              const hasSubs = group.subs.length > 0
              const hasMain = group.main !== null
              const avgProgress = hasSubs && hasMain ? groupAverageProgress(group) : undefined

              return (
                <>
                  {group.main && renderChapterCard(group.main, false, avgProgress)}
                  {group.subs.map((sub) => renderChapterCard(sub, hasMain))}
                </>
              )
            })}
            {ungrouped.map((file) => renderChapterCard(file, false))}
          </div>
        </div>
      </div>
    )
  }

  ThesisDashboard.css = style
  return ThesisDashboard
}) satisfies QuartzComponentConstructor
