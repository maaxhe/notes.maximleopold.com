import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/exportButton.scss"

export default (() => {
  const ExportButton: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    return (
      <div class="export-button-container">
        <button
          class="export-button"
          onclick="(function(){document.querySelectorAll('img').forEach(function(img){img.style.contentVisibility='visible';if(!img.complete||img.naturalWidth===0){var s=img.src;img.src='';img.src=s;}});setTimeout(window.print.bind(window),200);})()"
          aria-label="Als PDF exportieren"
          title="Seite als PDF exportieren (Drucken → PDF speichern)"
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Als PDF exportieren</span>
        </button>
      </div>
    )
  }

  ExportButton.css = style
  return ExportButton
}) satisfies QuartzComponentConstructor
