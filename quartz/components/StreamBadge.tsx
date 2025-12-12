import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import style from "./styles/streamBadge.scss"

/**
 * StreamBadge Component
 *
 * Shows a minimal indicator of which auditory stream(s) a page belongs to,
 * with a link to the full Auditory Streams overview.
 *
 * Replaces the old long FilteredToggleList sidebars.
 */
export const StreamBadge: QuartzComponent = ({
  fileData,
  displayClass,
}: QuartzComponentProps) => {
  const tags = fileData.frontmatter?.tags ?? []

  // Check which streams this page belongs to
  const isWhatStream =
    tags.includes("stream/what") || tags.includes("stream/ventral") || tags.includes("#stream/what")
  const isWhereStream =
    tags.includes("stream/where") ||
    tags.includes("stream/dorsal") ||
    tags.includes("#stream/where")

  // Don't render if no stream tags
  if (!isWhatStream && !isWhereStream) {
    return null
  }

  const overviewSlug = "Bachelorarbeit/Auditory-Streams-Overview"
  const overviewHref = resolveRelative(fileData.slug!, overviewSlug)

  return (
    <div class={`stream-badge-container ${displayClass ?? ""}`}>
      <div class="stream-badges">
        {isWhatStream && <span class="stream-badge what">Auditory What-Stream</span>}
        {isWhereStream && <span class="stream-badge where">Auditory Where-Stream</span>}
      </div>

      <a href={overviewHref} class="stream-overview-link">
        View full Streams Map →
      </a>
    </div>
  )
}

StreamBadge.css = style

export default (() => StreamBadge) satisfies QuartzComponentConstructor
