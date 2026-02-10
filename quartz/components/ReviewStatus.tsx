import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/reviewStatus.scss"
import { classNames } from "../util/lang"

interface ReviewStatusOptions {
  showProgress?: boolean
}

const defaultOptions: ReviewStatusOptions = {
  showProgress: true,
}

// Parse title to extract major.minor chapter numbers (e.g., "3.0 Methods" → {major: 3, minor: 0})
const parseChapterVersion = (title: string): { major: number; minor: number } | null => {
  const match = title.match(/^(\d+)\.(\d+)/)
  if (match) {
    return { major: parseInt(match[1]), minor: parseInt(match[2]) }
  }
  return null
}

export default ((opts?: Partial<ReviewStatusOptions>) => {
  const options: ReviewStatusOptions = { ...defaultOptions, ...opts }

  const ReviewStatus: QuartzComponent = ({
    fileData,
    allFiles,
    displayClass,
  }: QuartzComponentProps) => {
    const frontmatter = fileData.frontmatter
    const status = frontmatter?.status as string | undefined
    const ownProgress = frontmatter?.progress as number | undefined

    // For main chapters (X.0), compute average progress from sub-chapters
    let progress = ownProgress
    const title = (frontmatter?.title as string) || ""
    const version = parseChapterVersion(title)

    if (version && version.minor === 0) {
      // Find sub-chapters (same major number, minor > 0)
      const subChapters = allFiles.filter((file) => {
        const fileTitle = (file.frontmatter?.title as string) || ""
        const fileVersion = parseChapterVersion(fileTitle)
        return fileVersion && fileVersion.major === version.major && fileVersion.minor > 0
      })

      if (subChapters.length > 0) {
        const total = subChapters.reduce(
          (acc, f) => acc + ((f.frontmatter?.progress as number) || 0),
          0,
        )
        progress = Math.round(total / subChapters.length)
      }
    }

    if (!status && progress === undefined) {
      return null
    }

    const statusMap: Record<string, { label: string; icon: string; color: string }> = {
      draft: { label: "Entwurf", icon: "🟡", color: "draft" },
      review: { label: "In Review", icon: "🔵", color: "review" },
      "needs-revision": { label: "Überarbeitung nötig", icon: "🟠", color: "needs-revision" },
      final: { label: "Final", icon: "🟢", color: "final" },
      approved: { label: "Genehmigt", icon: "✅", color: "approved" },
    }

    const currentStatus = status ? statusMap[status.toLowerCase()] : null

    return (
      <div class={classNames(displayClass, "review-status")}>
        {currentStatus && (
          <div class={`status-badge ${currentStatus.color}`}>
            <span class="status-icon">{currentStatus.icon}</span>
            <span class="status-label">{currentStatus.label}</span>
          </div>
        )}
        {options.showProgress && progress !== undefined && (
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" style={`width: ${progress}%`}></div>
            </div>
            <span class="progress-text">{progress}% fertig</span>
          </div>
        )}
      </div>
    )
  }

  ReviewStatus.css = style
  return ReviewStatus
}) satisfies QuartzComponentConstructor
