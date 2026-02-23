const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const slug = entry.target.id
    const tocEntryElements = document.querySelectorAll(`a[data-for="${slug}"]`)
    const windowHeight = entry.rootBounds?.height
    if (windowHeight && tocEntryElements.length > 0) {
      if (entry.boundingClientRect.y < windowHeight) {
        tocEntryElements.forEach((tocEntryElement) => tocEntryElement.classList.add("in-view"))
      } else {
        tocEntryElements.forEach((tocEntryElement) => tocEntryElement.classList.remove("in-view"))
      }
    }
  }
})

function toggleToc(this: HTMLElement) {
  this.classList.toggle("collapsed")
  this.setAttribute(
    "aria-expanded",
    this.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )
  const content = this.nextElementSibling as HTMLElement | undefined
  if (!content) return
  content.classList.toggle("collapsed")
}

function setupToc() {
  for (const toc of document.getElementsByClassName("toc")) {
    const button = toc.querySelector(".toc-header")
    const content = toc.querySelector(".toc-content")
    if (!button || !content) return
    button.addEventListener("click", toggleToc)
    window.addCleanup(() => button.removeEventListener("click", toggleToc))
  }
}

function addTranscludedHeadingsToToc() {
  const tocContent = document.querySelector(".toc-content ul, .toc-content ol, .toc-content")
  if (!tocContent) return

  // Find all headings inside transcluded blocks
  const transcludes = document.querySelectorAll("blockquote.transclude")
  if (transcludes.length === 0) return

  // Determine the minimum depth already in TOC (to normalize depth)
  const existingDepths = Array.from(tocContent.querySelectorAll("li[class]"))
    .map(li => parseInt(li.className.replace("depth-", "")) || 0)
  const baseDepth = existingDepths.length > 0 ? Math.min(...existingDepths) : 0

  transcludes.forEach((block) => {
    const headings = block.querySelectorAll("h2, h3, h4")
    headings.forEach((heading) => {
      const h = heading as HTMLElement
      const text = h.textContent?.trim() || ""
      if (!text) return

      // Ensure the heading has an id for anchor linking
      if (!h.id) {
        h.id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
      }

      const depth = parseInt(h.tagName[1]) - 2 // h2 → 0, h3 → 1, h4 → 2
      const li = document.createElement("li")
      li.className = `depth-${depth + baseDepth} transcluded-toc-entry`
      const a = document.createElement("a")
      a.href = `#${h.id}`
      a.setAttribute("data-for", h.id)
      a.textContent = text
      li.appendChild(a)

      // Find a list inside tocContent or use tocContent directly
      const list = tocContent.querySelector("ul, ol") || tocContent
      list.appendChild(li)
      observer.observe(h)
    })
  })
}

document.addEventListener("nav", () => {
  setupToc()

  // update toc entry highlighting
  observer.disconnect()
  const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
  headers.forEach((header) => observer.observe(header))

  // Add headings from transcluded content
  addTranscludedHeadingsToToc()
})
