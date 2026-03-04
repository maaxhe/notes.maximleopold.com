import { test, describe } from "node:test"
import assert from "node:assert/strict"

import {
  cosineSimilarity,
  bm25Score,
  rerankChunks,
  normalizeCitationKey,
  containsInvalidCitation,
  extractCitationMentions,
  buildPublicUrlFromSource,
  parseSourceMetadata,
} from "./server.ts"

describe("cosineSimilarity", () => {
  test("identical vectors → 1", () => {
    assert.equal(cosineSimilarity([1, 0, 0], [1, 0, 0]), 1)
  })

  test("orthogonal vectors → 0", () => {
    assert.equal(cosineSimilarity([1, 0], [0, 1]), 0)
  })

  test("opposite vectors → -1", () => {
    assert.equal(cosineSimilarity([1, 0], [-1, 0]), -1)
  })

  test("different lengths → 0", () => {
    assert.equal(cosineSimilarity([1, 2], [1, 2, 3]), 0)
  })
})

describe("bm25Score", () => {
  test("returns 0 for no matching terms", () => {
    const score = bm25Score(["foo"], "bar baz qux", 10)
    assert.equal(score, 0)
  })

  test("returns positive score for matching terms", () => {
    const score = bm25Score(["term"], "this text contains the term here", 10)
    assert.ok(score > 0)
  })

  test("higher score for more frequent term", () => {
    const low = bm25Score(["word"], "only one word here in context", 6)
    const high = bm25Score(["word"], "word word word word word word", 6)
    assert.ok(high > low)
  })
})

describe("rerankChunks", () => {
  const makeChunk = (id: string, content: string, score: number, bm25: number) => ({
    id,
    content,
    metadata: { source: "test.md", type: "markdown" as const },
    score,
    bm25,
  })

  test("returns topK items", () => {
    const candidates = [
      makeChunk("a", "alpha beta", 0.9, 1.0),
      makeChunk("b", "gamma delta", 0.5, 0.5),
      makeChunk("c", "epsilon zeta", 0.3, 0.2),
    ]
    const result = rerankChunks(candidates, ["alpha"], 2)
    assert.equal(result.length, 2)
  })

  test("returns all items when topK >= candidates", () => {
    const candidates = [makeChunk("a", "foo", 0.8, 0.8), makeChunk("b", "bar", 0.4, 0.4)]
    const result = rerankChunks(candidates, ["foo"], 10)
    assert.equal(result.length, 2)
  })

  test("result is sorted by descending score", () => {
    const candidates = [
      makeChunk("a", "unrelated text here", 0.2, 0.1),
      makeChunk("b", "keyword keyword keyword", 0.8, 1.0),
    ]
    const result = rerankChunks(candidates, ["keyword"], 2)
    assert.ok(result[0].score >= result[1].score)
  })
})

describe("normalizeCitationKey", () => {
  test("lowercases and strips punctuation", () => {
    assert.equal(normalizeCitationKey("Smith (2020)."), "smith 2020")
  })

  test("handles undefined", () => {
    assert.equal(normalizeCitationKey(undefined), "")
  })

  test("collapses whitespace", () => {
    assert.equal(normalizeCitationKey("  foo   bar  "), "foo bar")
  })
})

describe("containsInvalidCitation", () => {
  test("detects 'quelle'", () => {
    assert.equal(containsInvalidCitation("Quelle fehlt hier"), true)
  })

  test("detects 'source 1'", () => {
    assert.equal(containsInvalidCitation("see source 1 for details"), true)
  })

  test("returns false for clean text", () => {
    assert.equal(containsInvalidCitation("This is a well-cited sentence."), false)
  })

  test("returns false for empty string", () => {
    assert.equal(containsInvalidCitation(""), false)
  })
})

describe("extractCitationMentions", () => {
  test("extracts single bracket citation", () => {
    const result = extractCitationMentions("See [Smith 2020] for details.")
    assert.ok(result.has("smith 2020"))
  })

  test("extracts multiple citations", () => {
    const result = extractCitationMentions("[Müller 2019] and [Jones 2021]")
    assert.equal(result.size, 2)
  })

  test("returns empty map for no citations", () => {
    const result = extractCitationMentions("No citations here.")
    assert.equal(result.size, 0)
  })

  test("handles empty string", () => {
    const result = extractCitationMentions("")
    assert.equal(result.size, 0)
  })
})

describe("buildPublicUrlFromSource", () => {
  test("returns null for null input", () => {
    assert.equal(buildPublicUrlFromSource(null), null)
  })

  test("returns null for undefined input", () => {
    assert.equal(buildPublicUrlFromSource(undefined), null)
  })

  test("passthrough for http URL", () => {
    assert.equal(buildPublicUrlFromSource("https://example.com/page"), "https://example.com/page")
  })

  test("strips content/ prefix and .md extension", () => {
    const url = buildPublicUrlFromSource("content/Bachelorarbeit/1. Intro/Overview.md")
    assert.ok(url?.startsWith("/"))
    assert.ok(!url?.includes(".md"))
    assert.ok(!url?.includes("content/"))
  })

  test("replaces spaces with dashes", () => {
    const url = buildPublicUrlFromSource("content/My Notes/Hello World.md")
    assert.equal(url, "/My-Notes/Hello-World")
  })
})

describe("parseSourceMetadata", () => {
  test("parses academic citation format", () => {
    const result = parseSourceMetadata("Smith, J. (2020) - The Title - Nature")
    assert.equal(result.year, "2020")
    assert.ok(result.authors.includes("Smith"))
    assert.equal(result.title, "The Title")
    assert.equal(result.venue, "Nature")
  })

  test("handles plain title without year", () => {
    const result = parseSourceMetadata("Some Random Document")
    assert.equal(result.rawTitle, "Some Random Document")
    assert.equal(result.year, "")
  })

  test("uses fallbackCategory as venue when no venue found", () => {
    const result = parseSourceMetadata("Smith (2021) - Title", "My Category")
    assert.equal(result.venue, "My Category")
  })

  test("handles empty string gracefully", () => {
    const result = parseSourceMetadata("")
    assert.equal(result.rawTitle, "Unbenannte Quelle")
  })
})
