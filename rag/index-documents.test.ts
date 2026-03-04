import { test, describe } from "node:test"
import assert from "node:assert/strict"

import { chunkMarkdownByHeadings, chunkText, extractCategory } from "./index-documents.ts"

describe("chunkMarkdownByHeadings", () => {
  test("returns empty array for empty string", () => {
    const chunks = chunkMarkdownByHeadings("")
    assert.deepEqual(chunks, [])
  })

  test("returns empty array for very short input", () => {
    const chunks = chunkMarkdownByHeadings("Hi")
    assert.deepEqual(chunks, [])
  })

  test("splits at H2 headings", () => {
    const md = `## Section One\n${"word ".repeat(20)}\n\n## Section Two\n${"word ".repeat(20)}`
    const chunks = chunkMarkdownByHeadings(md)
    assert.ok(chunks.length >= 2)
  })

  test("each chunk meets minimum length", () => {
    const md = `## Intro\n${"This is content. ".repeat(10)}\n\n## Details\n${"More content here. ".repeat(10)}`
    const chunks = chunkMarkdownByHeadings(md)
    for (const chunk of chunks) {
      assert.ok(chunk.length >= 80, `Chunk too short: "${chunk.slice(0, 40)}..."`)
    }
  })

  test("very long section gets split into multiple chunks", () => {
    const longSection = `## Long Section\n${"This is a sentence. ".repeat(100)}`
    const chunks = chunkMarkdownByHeadings(longSection)
    assert.ok(chunks.length > 1)
  })
})

describe("chunkText", () => {
  test("returns single chunk for short text", () => {
    const text = "This is a short sentence."
    const chunks = chunkText(text, 800, 150)
    assert.equal(chunks.length, 1)
  })

  test("splits long text into multiple chunks", () => {
    const text = "Short sentence. ".repeat(100)
    const chunks = chunkText(text, 200, 50)
    assert.ok(chunks.length > 1)
  })

  test("no chunk exceeds maxChunkSize by too much", () => {
    const text = "A sentence with exactly five words. ".repeat(50)
    const maxSize = 300
    const chunks = chunkText(text, maxSize, 50)
    for (const chunk of chunks) {
      // Allow some overshoot due to single-sentence overflow
      assert.ok(chunk.length <= maxSize * 2)
    }
  })

  test("returns empty array for empty string", () => {
    const chunks = chunkText("")
    assert.deepEqual(chunks, [])
  })
})

describe("extractCategory", () => {
  test("extracts category from Bachelorarbeit path", () => {
    const cat = extractCategory("content/Bachelorarbeit/1. Einleitung/Overview.md")
    assert.equal(cat, "Einleitung")
  })

  test("strips leading number from category", () => {
    const cat = extractCategory("content/Bachelorarbeit/3. Methodik/file.md")
    assert.equal(cat, "Methodik")
  })

  test("returns Unknown for non-Bachelorarbeit path", () => {
    const cat = extractCategory("content/SomeOtherFolder/file.md")
    assert.equal(cat, "Unknown")
  })

  test("returns Unknown for path without subdirectory after Bachelorarbeit", () => {
    const cat = extractCategory("content/Bachelorarbeit")
    assert.equal(cat, "Unknown")
  })
})
