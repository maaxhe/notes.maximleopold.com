import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/exportAll.inline"

const ExportAllButton: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
  return (
    <button
      id="export-all-button"
      class={`export-all-button ${displayClass ?? ""}`}
      aria-label="Gesamte Website als PDF exportieren"
      title="Alle Notizen als ein strukturiertes PDF exportieren"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="12" y2="18"></line>
        <line x1="15" y1="15" x2="12" y2="18"></line>
      </svg>
      <span>Website als PDF</span>
      <div class="export-progress" style="display: none;">
        <div class="progress-bar"></div>
        <span class="progress-text">0%</span>
      </div>
    </button>
  )
}

ExportAllButton.afterDOMLoaded = script

export default (() => ExportAllButton) satisfies QuartzComponentConstructor
