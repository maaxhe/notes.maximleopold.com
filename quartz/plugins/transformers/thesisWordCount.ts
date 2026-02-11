import matter from "gray-matter"
import { QuartzTransformerPlugin } from "../types"

/**
 * Computes thesis-specific word counts by extracting only actual prose content
 * from BA chapter files, ignoring outlines, checkboxes, notes, template text, etc.
 */
export const ThesisWordCount: QuartzTransformerPlugin = () => {
  return {
    name: "ThesisWordCount",
    markdownPlugins() {
      return [
        () => {
          return (_, file) => {
            // Parse raw content to check for 'ba' tag
            const raw = Buffer.from(file.value as Uint8Array).toString("utf-8")
            const { data, content } = matter(raw)

            const tags = Array.isArray(data.tags) ? data.tags : []
            const isBA = tags.some(
              (t: unknown) => typeof t === "string" && t.toLowerCase() === "ba",
            )

            if (!isBA) return

            file.data.thesisWordCount = countThesisWords(content)
          }
        },
      ]
    },
  }
}

function countThesisWords(markdown: string): number {
  let text = markdown

  // 1. Find main chapter heading (# X.X ... where X are digits)
  //    Everything before it (outlines, todos) is excluded
  const mainHeadingMatch = text.match(/^# \d+\.\d+/m)
  if (mainHeadingMatch && mainHeadingMatch.index !== undefined) {
    text = text.slice(mainHeadingMatch.index)
  } else {
    // No standard chapter heading → no countable thesis content
    return 0
  }

  // 2. Cut off at end markers (notes, scrapbook, see also, next chapter)
  for (const pattern of [
    /^#+ Notes\s*&?\s*Scrapbook/m,
    /^#{1,3}\s+see also/im,
    /^#+ Next Chapter/im,
  ]) {
    const match = text.match(pattern)
    if (match?.index !== undefined) {
      text = text.slice(0, match.index)
    }
  }

  // 3. Remove non-content elements
  text = text.replace(/!\[\[[^\]]*\]\]/g, "") // transclusion embeds ![[...]]
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, "") // image embeds ![](url)
  text = text.replace(/^[\t ]*-\s*\[[ x]\]\s*.*$/gm, "") // checkbox items
  text = text.replace(/Hier schreiben\.\.\./gi, "") // template placeholder
  text = text.replace(/\*?Hier Dinge abladen[^*\n]*Schreibfluss nicht stoppt\.\*?/gi, "") // scrapbook placeholder
  text = text.replace(/^-{3,}$/gm, "") // horizontal rules
  text = text.replace(/^\*{3,}$/gm, "") // horizontal rules (asterisks)
  text = text.replace(/^(Type|Tags|Status|Location|Created|Source):.*$/gm, "") // metadata lines
  text = text.replace(/^\[\[[^\]]*\]\]\s*$/gm, "") // bare wiki-links on own line

  // 4. Clean inline syntax but preserve display text
  text = text.replace(/\[\[([^|\]]*)\|([^\]]*)\]\]/g, "$1") // [[display|target]] → display
  text = text.replace(/\[\[([^\]]*)\]\]/g, "$1") // [[target]] → target
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // [text](url) → text
  text = text.replace(/^#{1,6}\s+/gm, "") // heading markers
  text = text.replace(/\*\*([^*]*)\*\*/g, "$1") // bold
  text = text.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, "$1") // italic (*)
  text = text.replace(/_([^_\s][^_]*)_/g, "$1") // italic (_)
  text = text.replace(/^>\s*/gm, "") // blockquote markers
  text = text.replace(/\|/g, " ") // table pipes

  // 5. Count words
  return text.split(/\s+/).filter((w) => w.length > 0).length
}

declare module "vfile" {
  interface DataMap {
    thesisWordCount: number | undefined
  }
}
