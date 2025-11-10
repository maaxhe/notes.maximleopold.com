#!/usr/bin/env node

/**
 * Check internal links in generated HTML files
 *
 * This script validates that all internal links in the built site
 * actually point to existing pages. Helps catch broken wikilinks.
 */

import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PUBLIC_DIR = path.join(__dirname, "..", "public")

// Track statistics
const stats = {
  filesChecked: 0,
  linksChecked: 0,
  brokenLinks: [],
  warnings: [],
}

/**
 * Extract all internal links from HTML content
 */
function extractInternalLinks(html, sourceFile) {
  const links = []
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["']/gi

  let match
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1]

    // Skip external links
    if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")) {
      continue
    }

    // Skip anchors, mailto, tel, etc.
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      continue
    }

    links.push(href)
  }

  return links
}

/**
 * Resolve a link to a file path and check if it exists
 */
function checkLinkExists(link, sourceFile) {
  // Remove query string and hash
  const cleanLink = link.split("?")[0].split("#")[0]

  // Resolve relative to source file
  const sourceDir = path.dirname(sourceFile)
  let targetPath

  if (cleanLink.startsWith("/")) {
    // Absolute path from site root
    targetPath = path.join(PUBLIC_DIR, cleanLink)
  } else {
    // Relative path
    targetPath = path.join(sourceDir, cleanLink)
  }

  // If path doesn't have extension, try adding /index.html
  if (!path.extname(targetPath)) {
    if (targetPath.endsWith("/")) {
      targetPath = path.join(targetPath, "index.html")
    } else {
      targetPath = targetPath + "/index.html"
    }
  }

  // Check if file exists
  return fs.existsSync(targetPath)
}

/**
 * Walk directory recursively
 */
function walkDirectory(dir, callback) {
  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const file of files) {
    const fullPath = path.join(dir, file.name)

    if (file.isDirectory()) {
      walkDirectory(fullPath, callback)
    } else if (file.isFile()) {
      callback(fullPath)
    }
  }
}

/**
 * Check all HTML files in the public directory
 */
function checkAllLinks() {
  console.log("🔍 Checking internal links in built site...\n")

  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`❌ Public directory not found: ${PUBLIC_DIR}`)
    console.error('Please run "npm run build" first.\n')
    process.exit(1)
  }

  walkDirectory(PUBLIC_DIR, (filePath) => {
    if (!filePath.endsWith(".html")) return

    stats.filesChecked++

    const html = fs.readFileSync(filePath, "utf-8")
    const links = extractInternalLinks(html, filePath)

    for (const link of links) {
      stats.linksChecked++

      if (!checkLinkExists(link, filePath)) {
        const relativePath = path.relative(PUBLIC_DIR, filePath)
        stats.brokenLinks.push({
          source: relativePath,
          link: link,
        })
      }
    }
  })
}

/**
 * Print results
 */
function printResults() {
  console.log("╔═══════════════════════════════════════════════════════════════╗")
  console.log("║                  Link Check Results                           ║")
  console.log("╚═══════════════════════════════════════════════════════════════╝")
  console.log(`Files checked: ${stats.filesChecked}`)
  console.log(`Links checked: ${stats.linksChecked}`)
  console.log(`Broken links: ${stats.brokenLinks.length}\n`)

  if (stats.brokenLinks.length > 0) {
    console.log("⚠️  Broken internal links found:\n")

    // Group by source file
    const bySource = {}
    for (const { source, link } of stats.brokenLinks) {
      if (!bySource[source]) {
        bySource[source] = []
      }
      bySource[source].push(link)
    }

    for (const [source, links] of Object.entries(bySource)) {
      console.log(`  ${source}:`)
      for (const link of links) {
        console.log(`    → ${link}`)
      }
      console.log("")
    }

    console.log("Note: Some broken links are expected for wikilinks to notes that don't exist yet.")
    console.log("This is normal for a digital garden. The build will not fail.\n")

    // Don't fail the build - broken wikilinks are expected in digital gardens
    // process.exit(1);
  } else {
    console.log("✅ All internal links are valid!\n")
  }
}

// Main execution
checkAllLinks()
printResults()
