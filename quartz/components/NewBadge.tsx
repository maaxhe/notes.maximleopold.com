import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/newBadge.scss"
import { classNames } from "../util/lang"
import { getDate } from "./Date"

interface NewBadgeOptions {
  daysThreshold?: number // How many days to show "New" badge
}

const defaultOptions: NewBadgeOptions = {
  daysThreshold: 7,
}

export default ((opts?: Partial<NewBadgeOptions>) => {
  const options: NewBadgeOptions = { ...defaultOptions, ...opts }

  const NewBadge: QuartzComponent = ({ fileData, displayClass, cfg }: QuartzComponentProps) => {
    if (!fileData.dates) {
      return null
    }

    const date = getDate(cfg, fileData)
    if (!date) {
      return null
    }

    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Only show badge if page was modified within threshold
    if (diffDays > options.daysThreshold!) {
      return null
    }

    let timeText = ""
    if (diffDays === 0) {
      timeText = "Heute aktualisiert"
    } else if (diffDays === 1) {
      timeText = "Gestern aktualisiert"
    } else {
      timeText = `Vor ${diffDays} Tagen aktualisiert`
    }

    return (
      <div class={classNames(displayClass, "new-badge-container")}>
        <div class="new-badge">
          <span class="new-icon">🆕</span>
          <span class="new-text">Neu</span>
          <span class="new-time">{timeText}</span>
        </div>
      </div>
    )
  }

  NewBadge.css = style
  return NewBadge
}) satisfies QuartzComponentConstructor
