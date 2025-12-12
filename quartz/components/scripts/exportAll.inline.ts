// Load jsPDF from CDN
function loadJsPDF(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).jspdf) {
      resolve((window as any).jspdf)
      return
    }

    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    script.onload = () => resolve((window as any).jspdf)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

interface PageData {
  slug: string
  title: string
  tags?: string[]
  content?: string
  description?: string
}

async function fetchContentIndex(): Promise<PageData[]> {
  const response = await fetch("/static/contentIndex.json")
  const data = await response.json()

  // Convert object to array
  if (Array.isArray(data)) {
    return data
  } else {
    // contentIndex is an object, convert to array
    return Object.values(data)
  }
}

async function fetchPageContent(slug: string): Promise<string> {
  try {
    const response = await fetch(`/${slug}`)
    const html = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    // Get the main content
    const article = doc.querySelector("article")
    if (!article) return ""

    // Remove scripts, styles, nav elements
    article.querySelectorAll("script, style, nav, .backlinks, .page-navigation").forEach((el) => {
      el.remove()
    })

    return article.textContent?.trim() || ""
  } catch (error) {
    console.error(`Error fetching ${slug}:`, error)
    return ""
  }
}

function updateProgress(current: number, total: number, text: string) {
  const button = document.getElementById("export-all-button")
  const progressDiv = button?.querySelector(".export-progress") as HTMLElement
  const progressBar = button?.querySelector(".progress-bar") as HTMLElement
  const progressText = button?.querySelector(".progress-text") as HTMLElement

  if (progressDiv && progressBar && progressText) {
    progressDiv.style.display = "block"
    const percentage = Math.round((current / total) * 100)
    progressBar.style.width = `${percentage}%`
    progressText.textContent = `${percentage}% - ${text}`
  }
}

function hideProgress() {
  const button = document.getElementById("export-all-button")
  const progressDiv = button?.querySelector(".export-progress") as HTMLElement
  if (progressDiv) {
    progressDiv.style.display = "none"
  }
}

function groupPagesByFolder(pages: PageData[]): Map<string, PageData[]> {
  const grouped = new Map<string, PageData[]>()

  pages.forEach((page) => {
    const parts = page.slug.split("/")
    const folder = parts.length > 1 ? parts.slice(0, -1).join("/") : "Root"
    if (!grouped.has(folder)) {
      grouped.set(folder, [])
    }
    grouped.get(folder)!.push(page)
  })

  return grouped
}

async function exportAllToPDF() {
  const button = document.getElementById("export-all-button")
  if (!button) return

  try {
    button.setAttribute("disabled", "true")
    updateProgress(0, 100, "Lade jsPDF...")

    const jsPDFModule = await loadJsPDF()
    const { jsPDF } = jsPDFModule

    updateProgress(10, 100, "Lade Seiten-Index...")
    const pages = await fetchContentIndex()

    // Group pages by folder
    const groupedPages = groupPagesByFolder(pages)
    const folders = Array.from(groupedPages.keys()).sort()

    updateProgress(20, 100, "Erstelle PDF...")

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const maxWidth = pageWidth - margin * 2
    let yPos = margin

    // Title page
    doc.setFontSize(28)
    doc.setFont("helvetica", "bold")
    doc.text("Max' Notizen", pageWidth / 2, 50, { align: "center" })

    doc.setFontSize(14)
    doc.setFont("helvetica", "normal")
    doc.text("Gesamte Website Export", pageWidth / 2, 65, { align: "center" })

    doc.setFontSize(10)
    const exportDate = new Date().toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    doc.text(`Exportiert am ${exportDate}`, pageWidth / 2, 75, { align: "center" })

    doc.text(`${pages.length} Seiten`, pageWidth / 2, 85, { align: "center" })

    // Table of Contents
    doc.addPage()
    yPos = margin
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Inhaltsverzeichnis", margin, yPos)
    yPos += 15

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    let pageNumber = 3 // Start after title and TOC
    const tocEntries: { folder: string; page: PageData; pageNum: number }[] = []

    folders.forEach((folder) => {
      const folderPages = groupedPages.get(folder)!
      folderPages.forEach((page) => {
        tocEntries.push({ folder, page, pageNum: pageNumber })
        pageNumber++
      })
    })

    // Write TOC
    folders.forEach((folder) => {
      if (yPos > pageHeight - margin) {
        doc.addPage()
        yPos = margin
      }

      doc.setFont("helvetica", "bold")
      doc.text(folder, margin, yPos)
      yPos += 6

      const folderPages = groupedPages.get(folder)!
      doc.setFont("helvetica", "normal")

      folderPages.forEach((page) => {
        if (yPos > pageHeight - margin) {
          doc.addPage()
          yPos = margin
        }

        const entry = tocEntries.find((e) => e.page.slug === page.slug)
        const tocLine = `  ${page.title}`
        doc.text(tocLine, margin + 5, yPos)
        doc.text(`${entry?.pageNum}`, pageWidth - margin, yPos, { align: "right" })
        yPos += 5
      })

      yPos += 3
    })

    // Content pages
    let processed = 0
    const total = pages.length

    for (const folder of folders) {
      const folderPages = groupedPages.get(folder)!

      for (const page of folderPages) {
        processed++
        updateProgress(20 + Math.round((processed / total) * 70), 100, `${page.title}...`)

        doc.addPage()
        yPos = margin

        // Folder name
        doc.setFontSize(10)
        doc.setFont("helvetica", "italic")
        doc.setTextColor(100, 100, 100)
        doc.text(folder, margin, yPos)
        yPos += 10

        // Page title
        doc.setFontSize(18)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(0, 0, 0)
        const titleLines = doc.splitTextToSize(page.title, maxWidth)
        doc.text(titleLines, margin, yPos)
        yPos += titleLines.length * 8 + 5

        // Tags if available
        if (page.tags && page.tags.length > 0) {
          doc.setFontSize(9)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(70, 130, 180)
          const tagsText = page.tags.join(", ")
          doc.text(`Tags: ${tagsText}`, margin, yPos)
          yPos += 8
        }

        // Description if available
        if (page.description) {
          doc.setFontSize(10)
          doc.setFont("helvetica", "italic")
          doc.setTextColor(50, 50, 50)
          const descLines = doc.splitTextToSize(page.description, maxWidth)
          doc.text(descLines, margin, yPos)
          yPos += descLines.length * 5 + 8
        }

        // Separator
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, yPos, pageWidth - margin, yPos)
        yPos += 8

        // Content
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(0, 0, 0)

        const content = await fetchPageContent(page.slug)
        if (content) {
          const lines = content.split("\n")

          for (const line of lines) {
            if (!line.trim()) {
              yPos += 4
              continue
            }

            const wrappedLines = doc.splitTextToSize(line, maxWidth)

            for (const wrappedLine of wrappedLines) {
              if (yPos > pageHeight - margin) {
                doc.addPage()
                yPos = margin
              }

              doc.text(wrappedLine, margin, yPos)
              yPos += 5
            }

            yPos += 2
          }
        } else {
          doc.text("(Inhalt konnte nicht geladen werden)", margin, yPos)
        }
      }
    }

    updateProgress(95, 100, "Speichere PDF...")

    // Add page numbers
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(150, 150, 150)
      doc.text(`Seite ${i} von ${totalPages}`, pageWidth / 2, pageHeight - 10, {
        align: "center",
      })
    }

    // Save the PDF
    const filename = `Max-Notizen-Export-${new Date().toISOString().split("T")[0]}.pdf`
    doc.save(filename)

    updateProgress(100, 100, "Fertig!")

    setTimeout(() => {
      hideProgress()
      button.removeAttribute("disabled")
    }, 2000)
  } catch (error) {
    console.error("Error exporting PDF:", error)
    alert("Fehler beim Exportieren: " + error)
    hideProgress()
    button?.removeAttribute("disabled")
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("export-all-button")
  if (button) {
    button.addEventListener("click", exportAllToPDF)
  }
})
