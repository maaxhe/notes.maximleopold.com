#!/usr/bin/env ts-node

/**
 * File watcher script that automatically syncs content from Obsidian vault
 * when files are created, modified, moved, or deleted.
 */

import chokidar from "chokidar"
import { spawn } from "child_process"
import * as path from "path"
import * as fs from "fs"

// Import the config from sync script
const VAULT_PATH =
  process.env.VAULT_PATH ||
  "/Users/maxmacbookpro/Library/Mobile Documents/iCloud~md~obsidian/Documents/Brain online"

const PUBLIC_DIRS = ["/Bachelorarbeit"]
const ASSETS_DIRS = ["/a Literatur-Notizen/Bilder", "/a Literatur-Notizen/PDFs"]

// Debounce sync operations to avoid running too frequently
let syncTimeout: NodeJS.Timeout | null = null
let isRunningSync = false

function runSync(): void {
  if (isRunningSync) {
    console.log("⏳ Sync already running, queuing next sync...")
    return
  }

  isRunningSync = true
  console.log("\n🔄 Running sync...")

  const syncProcess = spawn("npm", ["run", "sync"], {
    stdio: "inherit",
    shell: true,
  })

  syncProcess.on("close", (code) => {
    isRunningSync = false
    if (code === 0) {
      console.log("✅ Sync completed successfully!\n")
      console.log("👀 Watching for changes...")
    } else {
      console.error(`❌ Sync failed with code ${code}\n`)
      console.log("👀 Watching for changes...")
    }
  })

  syncProcess.on("error", (error) => {
    isRunningSync = false
    console.error("❌ Failed to run sync:", error)
    console.log("👀 Watching for changes...")
  })
}

function debouncedSync(): void {
  if (syncTimeout) {
    clearTimeout(syncTimeout)
  }

  // Wait 1 second after last change before syncing
  syncTimeout = setTimeout(() => {
    runSync()
  }, 1000)
}

function main(): void {
  console.log("╔═══════════════════════════════════════════════════════════════╗")
  console.log("║       Obsidian Vault Watcher (Auto-Sync)                    ║")
  console.log("╚═══════════════════════════════════════════════════════════════╝\n")

  // Check if vault exists
  if (!fs.existsSync(VAULT_PATH)) {
    console.error(`❌ Vault path does not exist: ${VAULT_PATH}`)
    console.log("Please update VAULT_PATH or set the VAULT_PATH environment variable.")
    process.exit(1)
  }

  // Build watch paths
  const watchPaths = [
    ...PUBLIC_DIRS.map((dir) => path.join(VAULT_PATH, dir)),
    ...ASSETS_DIRS.map((dir) => path.join(VAULT_PATH, dir)),
  ]

  console.log("Configuration:")
  console.log(`  Vault: ${VAULT_PATH}`)
  console.log(`  Watching paths:`)
  watchPaths.forEach((p) => console.log(`    - ${p}`))
  console.log("")

  // Run initial sync
  console.log("🚀 Running initial sync...")
  runSync()

  // Set up file watcher
  const watcher = chokidar.watch(watchPaths, {
    persistent: true,
    ignoreInitial: true, // Don't trigger for existing files
    ignored: [
      "**/.obsidian/**",
      "**/Templates/**",
      "**/_archive/**",
      "**/*.excalidraw",
      "**/*.excalidraw.md",
      "**/Private/**",
    ],
    awaitWriteFinish: {
      stabilityThreshold: 500,
      pollInterval: 100,
    },
  })

  watcher
    .on("add", (filePath) => {
      console.log(`\n📄 File added: ${path.basename(filePath)}`)
      debouncedSync()
    })
    .on("change", (filePath) => {
      console.log(`\n✏️  File changed: ${path.basename(filePath)}`)
      debouncedSync()
    })
    .on("unlink", (filePath) => {
      console.log(`\n🗑️  File deleted: ${path.basename(filePath)}`)
      debouncedSync()
    })
    .on("addDir", (dirPath) => {
      console.log(`\n📁 Directory added: ${path.basename(dirPath)}`)
      debouncedSync()
    })
    .on("unlinkDir", (dirPath) => {
      console.log(`\n📁 Directory deleted: ${path.basename(dirPath)}`)
      debouncedSync()
    })
    .on("error", (error) => {
      console.error("❌ Watcher error:", error)
    })
    .on("ready", () => {
      console.log("\n✅ Watcher ready!")
      console.log("👀 Watching for changes... (Press Ctrl+C to stop)\n")
    })

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n\n🛑 Stopping watcher...")
    watcher.close().then(() => {
      console.log("👋 Goodbye!")
      process.exit(0)
    })
  })
}

main()
