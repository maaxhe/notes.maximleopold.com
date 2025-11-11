import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/linkSuggestions.scss"
import { classNames } from "../util/lang"
import { resolveRelative, simplifySlug } from "../util/path"

interface Options {
  title: string
  limit: number
  minSharedTags: number
}

const defaultOptions: Options = {
  title: "Verlinkungstipps",
  limit: 5,
  minSharedTags: 1,
}

export default ((userOpts?: Partial<Options>) => {
  const opts = { ...defaultOptions, ...userOpts }

  const LinkSuggestions: QuartzComponent = ({
    fileData,
    allFiles,
    displayClass,
  }: QuartzComponentProps) => {
    const slug = fileData.slug
    if (!slug) return null

    const normalizedSlug = simplifySlug(slug)
    const currentTags = new Set(
      (fileData.frontmatter?.tags ?? [])
        .map((tag) => (typeof tag === "string" ? tag.toLowerCase().trim() : ""))
        .filter((tag) => tag.length > 0),
    )

    if (currentTags.size === 0) {
      return null
    }

    const outgoingLinks = new Set(fileData.links ?? [])
    const incomingLinks = new Set(
      allFiles
        .filter((candidate) => candidate.links?.includes(normalizedSlug))
        .map((candidate) => simplifySlug(candidate.slug!)),
    )

    const candidates = allFiles
      .filter((candidate) => candidate.slug && candidate.slug !== slug)
      .map((candidate) => {
        const candidateSlug = simplifySlug(candidate.slug!)
        const candidateTags = (candidate.frontmatter?.tags ?? [])
          .map((tag) => (typeof tag === "string" ? tag.toLowerCase().trim() : ""))
          .filter((tag) => tag.length > 0)
        const sharedTags = candidateTags.filter((tag) => currentTags.has(tag))
        const hasExistingLink =
          outgoingLinks.has(candidateSlug) || incomingLinks.has(candidateSlug)
        const lastModified =
          candidate.dates?.modified?.getTime() ?? candidate.dates?.created?.getTime() ?? 0

        return {
          slug: candidate.slug!,
          title: candidate.frontmatter?.title ?? candidate.slug!,
          sharedTags,
          href: candidate.slug!,
          score: sharedTags.length * 10 + lastModified / 1000,
          hasExistingLink,
        }
      })
      .filter(
        (candidate) =>
          candidate.sharedTags.length >= opts.minSharedTags && !candidate.hasExistingLink,
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, opts.limit)
      .map(({ score: _score, ...candidate }) => ({
        ...candidate,
        href: resolveRelative(fileData.slug!, candidate.slug) ?? candidate.slug,
      }))

    if (candidates.length === 0) {
      return null
    }

    return (
      <div class={classNames(displayClass, "link-suggestions")}>
        <h3>{opts.title}</h3>
        <ul>
          {candidates.map((candidate) => (
            <li>
              <a href={candidate.href} class="internal">
                {candidate.title}
              </a>
              <span class="tags">
                {candidate.sharedTags.map((tag) => (
                  <span class="tag">#{tag}</span>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  LinkSuggestions.css = style
  return LinkSuggestions
}) satisfies QuartzComponentConstructor
