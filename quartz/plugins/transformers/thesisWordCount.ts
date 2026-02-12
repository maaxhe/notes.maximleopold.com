import matter from "gray-matter"
import { QuartzTransformerPlugin } from "../types"

/**
 * Computes thesis-specific word counts by extracting only actual prose content
 * from BA chapter files, ignoring outlines, checkboxes, notes, template text, etc.
 * Also tracks transclusion references so the dashboard can build the inclusion chain.
 */
export const ThesisWordCount: QuartzTransformerPlugin = () => {
  return {
    name: "ThesisWordCount",
    markdownPlugins() {
      return [
        () => {
          return (_, file) => {
            const raw = Buffer.from(file.value as Uint8Array).toString("utf-8")
            const { data, content } = matter(raw)

            const tags = Array.isArray(data.tags) ? data.tags : []
            const isBA = tags.some(
              (t: unknown) => typeof t === "string" && t.toLowerCase() === "ba",
            )

            if (!isBA) return

            file.data.thesisWordCount = countThesisWords(content)

            // Extract transclusion references: ![[FileName#Heading]] → "FileName"
            const transcludes: string[] = []
            const transclusionPattern = /!\[\[([^\]#|]*)/g
            let match
            while ((match = transclusionPattern.exec(content)) !== null) {
              const ref = match[1].trim()
              if (ref.length > 0 && !ref.match(/\.(png|jpg|jpeg|gif|svg|webp|pdf)$/i)) {
                transcludes.push(ref)
              }
            }
            file.data.thesisTranscludes = transcludes
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
  text = text.replace(/!\[\[[^\]]*\]\]/g, "") // transclusion embeds
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, "") // image embeds
  text = text.replace(/^[\t ]*-\s*\[[ x]\]\s*.*$/gm, "") // checkbox items
  text = text.replace(/Hier schreiben\.\.\./gi, "") // template placeholder
  text = text.replace(/\*?Hier Dinge abladen[^*\n]*Schreibfluss nicht stoppt\.\*?/gi, "")
  text = text.replace(/^-{3,}$/gm, "") // horizontal rules
  text = text.replace(/^\*{3,}$/gm, "")
  text = text.replace(/^(Type|Tags|Status|Location|Created|Source):.*$/gm, "") // metadata
  text = text.replace(/^\[\[[^\]]*\]\]\s*$/gm, "") // bare wiki-links on own line
  text = text.replace(/^##\s+\d+\.\s+Subheading\s*$/gim, "") // template subheadings
  text = text.replace(/-->\s*.*/gm, "") // inline comments from --> to end of line
  text = text.replace(/\(Quelle\??\)/gi, "") // source annotations
  text = text.replace(/\(Quelle benötigt\)/gi, "")

  // 3b. Strip heading lines entirely (structural, not prose)
  text = text.replace(/^#{1,6}\s+.*$/gm, "")

  // 3c. Strip figure/table captions
  text = text.replace(/^(Figure|Table|Abbildung|Tabelle)\s+\d+[.:]\s*.*$/gim, "")

  // 3d. Strip table formatting rows (only dashes, colons, pipes, spaces)
  text = text.replace(/^[\s\-:|]+$/gm, "")

  // 4. Clean inline syntax but preserve display text
  // Wiki-links with display text: [[target|display]] → display
  text = text.replace(/\[\[([^|\]]*)\|([^\]]*)\]\]/g, "$2")
  // Wiki-links with anchors: [[target#anchor]] → target (strip #anchor/#^blockref)
  text = text.replace(/\[\[([^\]#]*?)(?:#[^\]]*)?\]\]/g, "$1")
  // Markdown links: [text](url) → text
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
  // Bold/italic
  text = text.replace(/\*\*([^*]*)\*\*/g, "$1")
  text = text.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, "$1")
  text = text.replace(/_([^_\s][^_]*)_/g, "$1")
  // Blockquote markers
  text = text.replace(/^>\s*/gm, "")
  // Table pipes
  text = text.replace(/\|/g, " ")

  // 5. Count words
  return text.split(/\s+/).filter((w) => w.length > 0).length
}

declare module "vfile" {
  interface DataMap {
    thesisWordCount: number | undefined
    thesisTranscludes: string[] | undefined
  }
}
