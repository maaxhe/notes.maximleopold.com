import { test, describe } from "node:test"
import assert from "node:assert/strict"

import { countThesisWords } from "./thesisWordCount.ts"

describe("countThesisWords", () => {
  test("returns 0 if no main chapter heading found", () => {
    const md = "# Introduction\nSome text here."
    assert.equal(countThesisWords(md), 0)
  })

  test("counts words after main chapter heading", () => {
    const md = `# 1.1 Einleitung\nThis sentence has five words.`
    const count = countThesisWords(md)
    assert.ok(count > 0)
  })

  test("ignores content before main heading", () => {
    const md = `Outline stuff here ignored ignored ignored\n# 2.1 Methodik\nActual prose content here.`
    const count = countThesisWords(md)
    // "Actual prose content here." → 4 words
    assert.equal(count, 4)
  })

  test("stops counting at Notes & Scrapbook section", () => {
    const md = `# 1.1 Title\nCounted words here.\n## Notes & Scrapbook\nNot counted.`
    const countWithNotes = countThesisWords(`# 1.1 Title\nNot counted.\n## Notes & Scrapbook\nNot counted.`)
    const countWithout = countThesisWords(`# 1.1 Title\nCounted words here.`)
    assert.ok(countWithout > countWithNotes)
  })

  test("excludes checkbox items", () => {
    const md = `# 3.1 Chapter\n- [x] Done task not counted\n- [ ] Todo not counted\nReal prose here.`
    const count = countThesisWords(md)
    // Only "Real prose here." should be counted
    assert.equal(count, 3)
  })

  test("excludes transclusion embeds", () => {
    const md = `# 1.2 Chapter\n![[SomeFile#Heading]]\nActual text counts.`
    const count = countThesisWords(md)
    assert.equal(count, 3)
  })

  test("excludes heading lines", () => {
    const md = `# 2.3 Main\n## Subheading not counted\nOnly prose counts.`
    const count = countThesisWords(md)
    assert.equal(count, 3)
  })

  test("resolves wiki-links with display text", () => {
    const md = `# 1.1 Title\nSee [[Target|display text]] for more.`
    const count = countThesisWords(md)
    // "See display text for more." → 5 words
    assert.equal(count, 5)
  })

  test("strips inline formatting", () => {
    const md = `# 1.1 Title\n**bold word** and _italic word_ here.`
    const count = countThesisWords(md)
    // "bold word and italic word here." → 6 words
    assert.equal(count, 6)
  })

  test("excludes template placeholder text", () => {
    const md = `# 1.1 Chapter\nHier schreiben...\nReal content.`
    const count = countThesisWords(md)
    assert.equal(count, 2)
  })

  test("handles empty string", () => {
    assert.equal(countThesisWords(""), 0)
  })
})
