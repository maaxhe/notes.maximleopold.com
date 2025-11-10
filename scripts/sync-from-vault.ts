#!/usr/bin/env ts-node

/**
 * Sync script to import public content from Obsidian vault to Quartz
 *
 * This script:
 * - Copies only whitelisted directories from the vault
 * - Filters out excluded patterns (private content)
 * - Converts Obsidian image embeds to standard markdown
 * - Preserves wikilinks for Quartz to resolve
 * - Optionally filters by frontmatter publish: true
 */

import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"
import { fileURLToPath } from "url"

// ============================================================================
// CONFIGURATION - Edit these variables to match your setup
// ============================================================================

const CONFIG = {
  // Path to your Obsidian vault
  VAULT_PATH:
    process.env.VAULT_PATH ||
    "/Users/maxmacbookpro/Library/Mobile Documents/iCloud~md~obsidian/Documents/Brain online",

  // Directories to publish (relative to vault root)
  PUBLIC_DIRS: ["/Bachelorarbeit"],

  // Asset directories (images, PDFs, etc.)
  ASSETS_DIRS: ["/Bachelorarbeit/BA_Bilder"],

  // Glob patterns to exclude (never publish these)
  EXCLUDE_PATTERNS: [
    "**/Private/**",
    "**/*.excalidraw",
    "**/*.excalidraw.md",
    "**/.obsidian/**",
    "**/Templates/**",
    "**/_archive/**",
  ],

  // Target directories
  CONTENT_DIR: "./content",
  ASSETS_DIR: "./static/assets",

  // If true, only sync files with "publish: true" in frontmatter
  REQUIRE_PUBLISH_FLAG: false,
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Normalize path separators for cross-platform compatibility
 */
function normalizePath(p: string): string {
  return p.split(path.sep).join("/")
}

/**
 * Check if a path matches any exclude pattern
 */
function shouldExclude(filePath: string): boolean {
  const normalized = normalizePath(filePath)

  return CONFIG.EXCLUDE_PATTERNS.some((pattern) => {
    // Convert glob pattern to regex
    const regexPattern = pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*").replace(/\?/g, ".")

    const regex = new RegExp(regexPattern)
    return regex.test(normalized)
  })
}

/**
 * Check if file has publish: true in frontmatter
 */
function shouldPublish(content: string): boolean {
  if (!CONFIG.REQUIRE_PUBLISH_FLAG) return true

  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)

  if (!match) return false

  const frontmatter = match[1]
  return /^\s*publish:\s*true\s*$/m.test(frontmatter)
}

/**
 * Generate a slug from a filename (for URL safety)
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Decompose umlauts
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
}

/**
 * Copy file and create parent directories if needed
 */
function copyFile(src: string, dest: string): void {
  const destDir = path.dirname(dest)
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }
  fs.copyFileSync(src, dest)
}

/**
 * Calculate file hash for change detection
 */
function getFileHash(filePath: string): string {
  const content = fs.readFileSync(filePath)
  return crypto.createHash("md5").update(content).digest("hex")
}

// ============================================================================
// CONTENT TRANSFORMATION
// ============================================================================

/**
 * Transform Obsidian image embeds to standard markdown
 * ![[image.png]] -> ![](/assets/image.png)
 * ![[folder/image.png]] -> ![](/assets/folder/image.png)
 * ![[image.png|caption]] -> ![caption](/assets/image.png)
 */
function transformImageEmbeds(content: string, assetsMap: Map<string, string>): string {
  // Match ![[filename]] or ![[filename|caption]]
  const embedRegex = /!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g

  return content.replace(embedRegex, (match, filename, caption) => {
    const cleanFilename = filename.trim()

    // Check if this is an asset we've copied
    if (assetsMap.has(cleanFilename)) {
      const assetPath = assetsMap.get(cleanFilename)!
      const altText = caption ? caption.trim() : ""
      return `![${altText}](${assetPath})`
    }

    // If not found in assets, leave as wikilink (might be a note)
    return match
  })
}

/**
 * Transform dataview code blocks to warning messages
 * (Dataview is not available in static site)
 */
function transformDataview(content: string): string {
  const dataviewRegex = /```dataview\s*\n([\s\S]*?)\n```/g

  return content.replace(dataviewRegex, (match, query) => {
    return `> [!warning] Dataview Query Not Available\n> This note contains a Dataview query that cannot be rendered in the static site.\n>\n> \`\`\`\n> ${query.trim()}\n> \`\`\``
  })
}

// ============================================================================
// SYNC LOGIC
// ============================================================================

interface SyncStats {
  filesProcessed: number
  filesCopied: number
  filesSkipped: number
  assetsProcessed: number
  errors: Array<{ file: string; error: string }>
}

/**
 * Collect all asset files from ASSETS_DIRS
 */
function collectAssets(): Map<string, string> {
  const assetsMap = new Map<string, string>()

  console.log("\n📦 Collecting assets...")

  for (const assetsDir of CONFIG.ASSETS_DIRS) {
    const fullPath = path.join(CONFIG.VAULT_PATH, assetsDir)

    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  Assets directory not found: ${fullPath}`)
      continue
    }

    walkDirectory(fullPath, (filePath) => {
      if (shouldExclude(filePath)) return

      const ext = path.extname(filePath).toLowerCase()
      const isAsset = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".pdf", ".mp4", ".webm"].includes(
        ext,
      )

      if (isAsset) {
        const relativePath = path.relative(fullPath, filePath)
        const destPath = path.join(CONFIG.ASSETS_DIR, relativePath)

        // Store both the filename and the full path as keys
        const filename = path.basename(filePath)
        const webPath = "/assets/" + normalizePath(relativePath)

        assetsMap.set(filename, webPath)
        assetsMap.set(relativePath, webPath)

        // Copy asset
        copyFile(filePath, destPath)
        console.log(`  ✓ ${filename}`)
      }
    })
  }

  console.log(`✅ Collected ${assetsMap.size} assets\n`)
  return assetsMap
}

/**
 * Sync markdown content from PUBLIC_DIRS
 */
function syncContent(assetsMap: Map<string, string>): SyncStats {
  const stats: SyncStats = {
    filesProcessed: 0,
    filesCopied: 0,
    filesSkipped: 0,
    assetsProcessed: assetsMap.size,
    errors: [],
  }

  console.log("📝 Syncing content...")

  for (const publicDir of CONFIG.PUBLIC_DIRS) {
    const fullPath = path.join(CONFIG.VAULT_PATH, publicDir)

    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  Public directory not found: ${fullPath}`)
      continue
    }

    console.log(`\nProcessing: ${publicDir}`)

    walkDirectory(fullPath, (filePath) => {
      if (shouldExclude(filePath)) {
        console.log(`  ⊘ Excluded: ${path.basename(filePath)}`)
        return
      }

      if (path.extname(filePath) !== ".md") return

      stats.filesProcessed++

      try {
        const content = fs.readFileSync(filePath, "utf-8")

        // Check publish flag if required
        if (!shouldPublish(content)) {
          stats.filesSkipped++
          console.log(`  ⊗ No publish flag: ${path.basename(filePath)}`)
          return
        }

        // Transform content
        let transformed = content
        transformed = transformImageEmbeds(transformed, assetsMap)
        transformed = transformDataview(transformed)

        // Determine destination path (preserve directory structure)
        const relativePath = path.relative(fullPath, filePath)
        const destPath = path.join(CONFIG.CONTENT_DIR, publicDir, relativePath)

        // Write transformed content
        const destDir = path.dirname(destPath)
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true })
        }

        fs.writeFileSync(destPath, transformed, "utf-8")
        stats.filesCopied++
        console.log(`  ✓ ${path.basename(filePath)}`)
      } catch (error) {
        stats.errors.push({
          file: filePath,
          error: error instanceof Error ? error.message : String(error),
        })
        console.error(`  ✗ Error processing ${path.basename(filePath)}:`, error)
      }
    })
  }

  return stats
}

/**
 * Recursively walk a directory and call callback for each file
 */
function walkDirectory(dir: string, callback: (filePath: string) => void): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      walkDirectory(fullPath, callback)
    } else {
      callback(fullPath)
    }
  }
}

/**
 * Clean destination directories before sync
 */
function cleanDestinations(): void {
  console.log("🧹 Cleaning destination directories...")

  if (fs.existsSync(CONFIG.CONTENT_DIR)) {
    fs.rmSync(CONFIG.CONTENT_DIR, { recursive: true, force: true })
  }

  if (fs.existsSync(CONFIG.ASSETS_DIR)) {
    fs.rmSync(CONFIG.ASSETS_DIR, { recursive: true, force: true })
  }

  fs.mkdirSync(CONFIG.CONTENT_DIR, { recursive: true })
  fs.mkdirSync(CONFIG.ASSETS_DIR, { recursive: true })

  console.log("✅ Cleaned\n")
}

// ============================================================================
// MAIN
// ============================================================================

function main(): void {
  console.log("╔═══════════════════════════════════════════════════════════════╗")
  console.log("║       Obsidian → Quartz Content Sync                         ║")
  console.log("╚═══════════════════════════════════════════════════════════════╝\n")

  console.log("Configuration:")
  console.log(`  Vault: ${CONFIG.VAULT_PATH}`)
  console.log(`  Public dirs: ${CONFIG.PUBLIC_DIRS.join(", ")}`)
  console.log(`  Require publish flag: ${CONFIG.REQUIRE_PUBLISH_FLAG}\n`)

  // Validate vault path
  if (!fs.existsSync(CONFIG.VAULT_PATH)) {
    console.warn(`⚠️  Vault path does not exist: ${CONFIG.VAULT_PATH}`)
    console.log(
      "Skipping sync - this is expected in CI/CD environments where content is already committed.",
    )
    console.log(
      "For local development, please update VAULT_PATH in the script or set the VAULT_PATH environment variable.",
    )
    console.log("\n✅ Sync skipped (vault not available)\n")
    process.exit(0)
  }

  // Clean and prepare
  cleanDestinations()

  // Collect and copy assets first
  const assetsMap = collectAssets()

  // Sync content
  const stats = syncContent(assetsMap)

  // Print summary
  console.log("\n╔═══════════════════════════════════════════════════════════════╗")
  console.log("║                    Sync Summary                               ║")
  console.log("╚═══════════════════════════════════════════════════════════════╝")
  console.log(`Files processed: ${stats.filesProcessed}`)
  console.log(`Files copied: ${stats.filesCopied}`)
  console.log(`Files skipped: ${stats.filesSkipped}`)
  console.log(`Assets copied: ${stats.assetsProcessed}`)

  if (stats.errors.length > 0) {
    console.log(`\n⚠️  Errors: ${stats.errors.length}`)
    stats.errors.forEach(({ file, error }) => {
      console.log(`  - ${path.basename(file)}: ${error}`)
    })
  }

  console.log("\n✅ Sync complete!\n")
}

// Run if executed directly (ES module check)
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url)
if (isMainModule) {
  main()
}

export { main, CONFIG }
