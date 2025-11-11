const LIGHTBOX_CONTAINER_SELECTOR = ".image-lightbox"
const LIGHTBOX_IMAGE_SELECTOR = ".image-lightbox img"
const LIGHTBOX_CAPTION_SELECTOR = ".image-lightbox figcaption"

function getElements() {
  const container = document.querySelector(LIGHTBOX_CONTAINER_SELECTOR) as HTMLElement | null
  if (!container) return null
  const figure = container.querySelector("figure") as HTMLElement | null
  const image = container.querySelector(LIGHTBOX_IMAGE_SELECTOR) as HTMLImageElement | null
  const caption = container.querySelector(LIGHTBOX_CAPTION_SELECTOR) as HTMLElement | null
  const closeButton = container.querySelector(".lightbox-close") as HTMLButtonElement | null
  const backdrop = container.querySelector(".lightbox-backdrop") as HTMLElement | null
  return { container, figure, image, caption, closeButton, backdrop }
}

function lockScroll(lock: boolean) {
  if (lock) {
    document.documentElement.classList.add("lightbox-open")
  } else {
    document.documentElement.classList.remove("lightbox-open")
  }
}

function setupLightbox() {
  const elements = getElements()
  if (!elements) return
  const { container, image, caption, closeButton, backdrop } = elements

  if (closeButton) closeButton.addEventListener("click", closeLightbox)
  if (backdrop) backdrop.addEventListener("click", closeLightbox)

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeLightbox()
    }
  }

  function showLightbox(src: string, alt: string) {
    if (!image) return
    image.src = src
    image.alt = alt
    if (caption) {
      caption.textContent = alt || ""
      caption.style.display = alt ? "block" : "none"
    }
    container?.classList.add("open")
    lockScroll(true)
    document.addEventListener("keydown", handleKeydown)
  }

  function closeLightbox() {
    container?.classList.remove("open")
    lockScroll(false)
    document.removeEventListener("keydown", handleKeydown)
  }

  function handleImageClick(event: Event) {
    const target = event.currentTarget as HTMLImageElement | null
    if (!target || !target.src) return
    const altText = target.getAttribute("data-caption") || target.alt || ""
    showLightbox(target.src, altText)
  }

  function bindImages() {
    const candidates = document.querySelectorAll("article img, .content img")
    candidates.forEach((img) => {
      if (!(img instanceof HTMLImageElement)) return
      if (img.closest(LIGHTBOX_CONTAINER_SELECTOR)) return
      if (img.dataset.noLightbox === "true") return
      if (img.dataset.lightboxBound === "true") return
      img.dataset.lightboxBound = "true"
      img.style.cursor = "zoom-in"
      img.addEventListener("click", handleImageClick)
      window.addCleanup?.(() => img.removeEventListener("click", handleImageClick))
    })
  }

  bindImages()
  document.addEventListener("nav", bindImages as EventListener)
  window.addCleanup?.(() => {
    document.removeEventListener("nav", bindImages as EventListener)
    lockScroll(false)
  })
}

document.addEventListener("DOMContentLoaded", setupLightbox, { once: true })
