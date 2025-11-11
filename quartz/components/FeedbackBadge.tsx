import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/feedbackBadge.scss"
import { classNames } from "../util/lang"

interface FeedbackBadgeOptions {
  showMessage?: boolean
}

const defaultOptions: FeedbackBadgeOptions = {
  showMessage: true,
}

export default ((opts?: Partial<FeedbackBadgeOptions>) => {
  const options: FeedbackBadgeOptions = { ...defaultOptions, ...opts }

  const FeedbackBadge: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const needsFeedback = fileData.frontmatter?.needsFeedback as boolean | undefined
    const feedbackNote = fileData.frontmatter?.feedbackNote as string | undefined

    if (!needsFeedback) {
      return null
    }

    return (
      <div class={classNames(displayClass, "feedback-badge-container")}>
        <div class="feedback-badge-box">
          <div class="feedback-header">
            <span class="feedback-icon">⚠️</span>
            <span class="feedback-title">Feedback benötigt</span>
          </div>
          {options.showMessage && feedbackNote && (
            <div class="feedback-message">{feedbackNote}</div>
          )}
          {options.showMessage && !feedbackNote && (
            <div class="feedback-message">
              An diesem Kapitel wird noch gearbeitet. Feedback ist willkommen!
            </div>
          )}
        </div>
      </div>
    )
  }

  FeedbackBadge.css = style
  return FeedbackBadge
}) satisfies QuartzComponentConstructor
