import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/reviewStatus.scss"
import { classNames } from "../util/lang"

interface ReviewStatusOptions {
  showProgress?: boolean
}

const defaultOptions: ReviewStatusOptions = {
  showProgress: true,
}

export default ((opts?: Partial<ReviewStatusOptions>) => {
  const options: ReviewStatusOptions = { ...defaultOptions, ...opts }

  const ReviewStatus: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const frontmatter = fileData.frontmatter
    const status = frontmatter?.status as string | undefined
    const progress = frontmatter?.progress as number | undefined

    if (!status && !progress) {
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
