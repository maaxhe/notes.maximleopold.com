import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/lightbox.inline"
import style from "./styles/lightbox.scss"

const ImageLightbox: QuartzComponent = () => {
  return (
    <div class="image-lightbox" aria-hidden="true">
      <div class="lightbox-backdrop" aria-hidden="true"></div>
      <figure class="lightbox-content" role="dialog" aria-modal="true">
        <button class="lightbox-close" aria-label="Schließen">
          ×
        </button>
        <img alt="" loading="lazy" decoding="async" />
        <figcaption></figcaption>
      </figure>
    </div>
  )
}

ImageLightbox.css = style
ImageLightbox.afterDOMLoaded = script

export default (() => ImageLightbox) satisfies QuartzComponentConstructor
