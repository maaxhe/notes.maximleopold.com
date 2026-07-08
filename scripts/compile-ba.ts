#!/usr/bin/env tsx

/**
 * compile-ba.ts
 *
 * Compiles all BA chapter files from the Obsidian vault into a single document.
 * - Resolves ![[transclusion#section]] chains recursively
 * - Strips frontmatter, outline/todo sections, Notes & Scrapbook, see also, Source
 * - Writes output back to the vault so sync picks it up automatically
 *
 * Usage: tsx scripts/compile-ba.ts
 */

import * as fs from "fs"
import * as path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"

// ============================================================================
// CONFIG
// ============================================================================

const VAULT_PATH =
  process.env.VAULT_PATH ||
  "/Users/maxmacbookpro/Library/Mobile Documents/iCloud~md~obsidian/Documents/Brain online"

const BA_PATH = path.join(VAULT_PATH, "Bachelorarbeit/4. Schreiben")
const OUTPUT_PATH = path.join(BA_PATH, "0.0 BA Compiled.md")

// Top-level chapter files in order (matching 0.0 Bachelorarbeit Gesamt.md)
const CHAPTERS = [
  "0.2 Abstract",
  "1.0 Introduction",
  "2.0 Theoretical Background",
  "3.0 Methods",
  "4.0 Results",
  "5.0 Discussion",
  "6.0 References",
  "7.0 Appendix",
  "8.0 Declaration",
  "9.0 Abbreviations",
]

// ============================================================================
// HELPERS
// ============================================================================

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** Strip YAML frontmatter */
function stripFrontmatter(raw: string): string {
  return matter(raw).content.trim()
}

/**
 * Strip trailing meta-sections:
 * - --- followed by # Notes & Scrapbook
 * - # see also (any heading level)
 * - ### Source
 */
function stripTrailingSections(content: string): string {
  // Notes & Scrapbook is private scratchpad content — cut everything from that
  // heading onward regardless of whether a `---` rule precedes it (it doesn't
  // always), so a missing separator can't leak it into compiled/published output.
  content = content.replace(/\n#{1,6}\s*Notes\s*&\s*Scrapbook[\s\S]*/i, "")
  content = content.replace(/\n#{1,6}\s*see also[\s\S]*/i, "")
  content = content.replace(/\n#{1,6}\s*Source\s*\n[\s\S]*/i, "")
  return content.trim()
}

/**
 * Top-level chapter files have an outline/todo block before the main heading.
 * Jump forward to the first occurrence of `# ChapterName`.
 */
function extractFromMainHeading(content: string, chapterName: string): string {
  const escaped = escapeRegex(chapterName)
  const regex = new RegExp(`^#{1,3}\\s+${escaped}\\s*$`, "m")
  const match = regex.exec(content)
  if (!match) return content
  return content.slice(match.index).trim()
}

/**
 * Extract a named section from content.
 * Takes from the matching heading until the next heading of same or higher level.
 */
function extractSection(content: string, sectionName: string): string {
  const escaped = escapeRegex(sectionName.trim())
  const headingRegex = new RegExp(`^(#{1,6})\\s+${escaped}\\s*$`, "mi")
  const match = headingRegex.exec(content)

  if (!match) {
    // Never fall back to the full file — it may still contain a Notes & Scrapbook
    // section that stripTrailingSections() didn't catch (e.g. missing leading `---`).
    // Falling through silently would leak private scratchpad content into the
    // compiled/published output, so fail loudly instead.
    console.error(
      `    ✗ Section "${sectionName}" not found — skipping this transclusion instead of leaking full file content. Check the heading matches the wikilink exactly.`,
    )
    return ""
  }

  const headingLevel = match[1].length
  const afterHeading = content.slice(match.index + match[0].length)

  // Stop at next heading of same or higher level
  const stopRegex = new RegExp(`^#{1,${headingLevel}}\\s`, "m")
  const stopMatch = stopRegex.exec(afterHeading)

  const sectionContent = stopMatch
    ? match[0] + afterHeading.slice(0, stopMatch.index)
    : match[0] + afterHeading

  return sectionContent.trim()
}

/**
 * Resolve all ![[filename#section]] transclusions recursively.
 * - Keeps image/asset embeds as-is
 * - Skips block references (^blockId)
 * - Prevents circular transclusions
 */
function resolveTransclusions(
  content: string,
  dir: string,
  visited = new Set<string>(),
): string {
  const transclusionRegex = /!\[\[([^\]|#\n]+?)(?:#([^\]|\n]+?))?(?:\|[^\]\n]+?)?\]\]/g

  return content.replace(transclusionRegex, (match, filename, section) => {
    filename = filename.trim()
    section = section?.trim()

    // Keep image and asset embeds as-is
    if (/\.(png|jpg|jpeg|gif|svg|pdf|mp4|webm)$/i.test(filename)) return match

    // Skip block references — these are anchors, not section headings
    if (section?.startsWith("^")) return ""

    const filePath = path.join(dir, `${filename}.md`)

    if (!fs.existsSync(filePath)) {
      console.warn(`    ⚠️  Not found: ${filename}.md`)
      return ""
    }

    if (visited.has(filePath)) {
      console.warn(`    ⚠️  Circular transclusion skipped: ${filename}`)
      return ""
    }

    visited.add(filePath)

    const raw = fs.readFileSync(filePath, "utf-8")
    let body = stripFrontmatter(raw)
    body = stripTrailingSections(body)

    if (section) {
      body = extractSection(body, section)
    }

    // Resolve nested transclusions
    body = resolveTransclusions(body, dir, visited)

    visited.delete(filePath) // allow re-use across separate branches

    return body.trim()
  })
}

/** Process one top-level chapter file into clean compiled text */
function processChapter(chapterName: string): string {
  const filePath = path.join(BA_PATH, `${chapterName}.md`)

  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  Not found: ${chapterName}.md — skipping`)
    return ""
  }

  console.log(`  ✓ ${chapterName}`)

  const raw = fs.readFileSync(filePath, "utf-8")
  let content = stripFrontmatter(raw)
  content = stripTrailingSections(content)
  content = extractFromMainHeading(content, chapterName)
  content = resolveTransclusions(content, BA_PATH, new Set([filePath]))

  return content.trim()
}

// ============================================================================
// MAIN
// ============================================================================

function main(): void {
  console.log("╔═══════════════════════════════════════════════════════════════╗")
  console.log("║        Compiling Bachelorarbeit → Single Document             ║")
  console.log("╚═══════════════════════════════════════════════════════════════╝\n")

  if (!fs.existsSync(VAULT_PATH)) {
    console.warn(`⚠️  Vault not found: ${VAULT_PATH}`)
    console.log("Skipping compile — vault not available (expected in CI).")
    process.exit(0)
  }

  if (!fs.existsSync(BA_PATH)) {
    console.error(`✗ BA writing path not found: ${BA_PATH}`)
    process.exit(1)
  }

  const today = new Date().toISOString().split("T")[0]
  const sections: string[] = []

  for (const chapter of CHAPTERS) {
    const content = processChapter(chapter)
    if (content) sections.push(content)
  }

  const output = [
    "---",
    "title: Bachelorarbeit (Compiled)",
    "status: auto-generated",
    `generated: ${today}`,
    "tags:",
    "  - ba",
    "cssclasses:",
    "  - blocksatz",
    "---",
    "",
    "> [!info] Auto-generated",
    "> This file is compiled by `npm run compile-ba`. Do not edit manually.",
    "",
    sections.join("\n\n---\n\n"),
    "",
  ].join("\n")

  fs.writeFileSync(OUTPUT_PATH, output, "utf-8")
  console.log(`\n✅ ${sections.length} chapters compiled → ${OUTPUT_PATH}\n`)
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url)
if (isMain) main()

export { main }
