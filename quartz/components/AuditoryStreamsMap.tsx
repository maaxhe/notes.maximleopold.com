import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { groupRegionsByType, RegionEntry, StreamRole } from "../data/streams"
import { resolveRelative } from "../util/path"
import style from "./styles/auditoryStreamsMap.scss"
import script from "./scripts/auditoryStreamsMap.inline"

interface StreamSectionProps {
  title: string
  subtitle: string
  streamRole: StreamRole
  currentSlug: string
}

const StreamSection: React.FC<StreamSectionProps & { baseUrl: string }> = ({
  title,
  subtitle,
  streamRole,
  currentSlug,
  baseUrl,
}) => {
  const grouped = groupRegionsByType(streamRole)

  // For PFC targets, further split by function (where vs what)
  const splitByFunction = (regions: RegionEntry[]) => {
    const hasTag = (region: RegionEntry, tags: string[]) => {
      const regionTags = region.functionTags || (region.functionTag ? [region.functionTag] : [])
      return regionTags.some(tag => tags.includes(tag))
    }

    return {
      where: regions.filter(r => hasTag(r, ["spatialprocessing"])),
      what: regions.filter(r => hasTag(r, ["semantic", "language", "nonspatial"])),
      other: regions.filter(r => !hasTag(r, ["spatialprocessing", "semantic", "language", "nonspatial"])),
    }
  }

  const renderRegionList = (regions: RegionEntry[], typeLabel: string) => {
    if (regions.length === 0) return null

    return (
      <div class="region-group">
        <h4>{typeLabel}</h4>
        <div class="region-pills">
          {regions.map((region) => {
            const certaintyIcon = region.certainty === "safe" ? "✓" : "?"
            const certaintyClass = region.certainty === "safe" ? "safe" : "uncertain"

            // Format function tag label
            const getFunctionLabel = (tag: string): string => {
              const labels: Record<string, string> = {
                semantic: "semantic",
                spatialprocessing: "spatial",
                nonspatial: "non-spatial",
                language: "language",
                prosody: "prosody",
                workingmemory: "working memory",
                visual: "visual",
                motion: "motion",
              }
              return labels[tag] || tag
            }

            // Support multiple function tags (backward compatible with single functionTag)
            const tags = region.functionTags || (region.functionTag ? [region.functionTag] : [])
            const functionBadges = tags
              .filter((tag) => tag && tag !== "none")
              .map((tag) => (
                <span key={tag} class={`function-badge ${tag}`}>
                  {getFunctionLabel(tag)}
                </span>
              ))

            const content = (
              <>
                <span class={`certainty-icon ${certaintyClass}`}>{certaintyIcon}</span>
                <span class="region-label">{region.label}</span>
                {functionBadges}
              </>
            )

            if (region.slug) {
              const href = resolveRelative(currentSlug, region.slug)
              return (
                <a key={region.id} href={href} class={`region-pill ${certaintyClass}`}>
                  {content}
                </a>
              )
            } else {
              return (
                <div key={region.id} class={`region-pill ${certaintyClass}`}>
                  {content}
                </div>
              )
            }
          })}
        </div>
      </div>
    )
  }

  // Special rendering for PFC targets with where/what split
  if (streamRole === "pfc_target") {
    const glasserSplit = splitByFunction(grouped.glasser)
    const classicalSplit = splitByFunction(grouped.classical)
    const networkSplit = splitByFunction(grouped.network)

    return (
      <section class="stream-section">
        <div class="stream-header">
          <h2>{title}</h2>
          <p class="stream-subtitle">{subtitle}</p>
        </div>

        <div class="pfc-subgroup">
          <h3 class="pfc-subgroup-title">Where-related (Spatial Processing)</h3>
          {renderRegionList(glasserSplit.where, "Glasser Regions")}
          {renderRegionList(classicalSplit.where, "Classical Regions")}
          {renderRegionList(networkSplit.where, "Networks")}
        </div>

        <div class="pfc-subgroup">
          <h3 class="pfc-subgroup-title">What-related (Semantic Processing)</h3>
          {renderRegionList(glasserSplit.what, "Glasser Regions")}
          {renderRegionList(classicalSplit.what, "Classical Regions")}
          {renderRegionList(networkSplit.what, "Networks")}
        </div>

        {(glasserSplit.other.length > 0 || classicalSplit.other.length > 0 || networkSplit.other.length > 0) && (
          <div class="pfc-subgroup">
            <h3 class="pfc-subgroup-title">Other</h3>
            {renderRegionList(glasserSplit.other, "Glasser Regions")}
            {renderRegionList(classicalSplit.other, "Classical Regions")}
            {renderRegionList(networkSplit.other, "Networks")}
          </div>
        )}
      </section>
    )
  }

  // Standard rendering for other stream roles
  return (
    <section class="stream-section">
      <div class="stream-header">
        <h2>{title}</h2>
        <p class="stream-subtitle">{subtitle}</p>
      </div>

      {renderRegionList(grouped.glasser, "Glasser Regions")}
      {renderRegionList(grouped.classical, "Classical Regions")}
      {renderRegionList(grouped.network, "Networks")}
    </section>
  )
}

const FunctionTagsLegend: React.FC = () => {
  const tags = [
    { key: "semantic", label: "semantic" },
    { key: "spatialprocessing", label: "spatial" },
    { key: "nonspatial", label: "non-spatial" },
    { key: "language", label: "language" },
    { key: "prosody", label: "prosody" },
    { key: "workingmemory", label: "working memory" },
    { key: "visual", label: "visual" },
    { key: "motion", label: "motion" },
  ]

  return (
    <div class="function-tags-legend">
      <h3>Function Tags:</h3>
      <div class="legend-tags">
        {tags.map((tag) => (
          <span key={tag.key} class={`legend-tag ${tag.key}`}>
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export const AuditoryStreamsMap: QuartzComponent = ({
  fileData,
  displayClass,
  cfg,
}: QuartzComponentProps) => {
  const currentSlug = fileData.slug!

  return (
    <div class={`auditory-streams-map ${displayClass ?? ""}`}>
      <FunctionTagsLegend />

      <StreamSection
        title="Auditory Where-Stream (Dorsal)"
        subtitle="Regions involved in spatial auditory processing and sensorimotor integration"
        streamRole="where"
        currentSlug={currentSlug}
        baseUrl={cfg.baseUrl}
      />

      <StreamSection
        title="Auditory What-Stream (Ventral)"
        subtitle="Regions involved in auditory object identification and semantic processing"
        streamRole="what"
        currentSlug={currentSlug}
        baseUrl={cfg.baseUrl}
      />

      <StreamSection
        title="Prefrontal Target Regions"
        subtitle="Prefrontal cortex regions receiving projections from auditory streams"
        streamRole="pfc_target"
        currentSlug={currentSlug}
        baseUrl={cfg.baseUrl}
      />
    </div>
  )
}

AuditoryStreamsMap.css = style
AuditoryStreamsMap.afterDOMLoaded = script

export default (() => AuditoryStreamsMap) satisfies QuartzComponentConstructor
