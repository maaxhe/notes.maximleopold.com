/**
 * Auditory Streams Map - Fully Dynamic from File Tags
 *
 * This script builds the entire streams overview dynamically by reading
 * tags from markdown files. No hardcoded data needed!
 */

interface ContentIndexEntry {
  title?: string
  tags?: string[]
  slug?: string
  frontmatter?: {
    tags?: string[]
  }
}

interface ContentIndex {
  [slug: string]: ContentIndexEntry
}

interface RegionData {
  slug: string
  title: string
  streamRoles: ("what" | "where" | "pfc_target" | "core")[]
  certainty: "safe" | "uncertain"
  regionType: "glasser" | "classical" | "network" | null
  functionTags: string[]
}

function normalizeTags(tags: string[] | undefined): string[] {
  if (!tags) return []
  return tags.map((tag) => tag.replace(/^#/, "").toLowerCase())
}

function extractRegionData(slug: string, entry: ContentIndexEntry): RegionData | null {
  const tags = normalizeTags(entry.tags || entry.frontmatter?.tags)

  // Determine stream roles (can have multiple)
  const streamRoles: ("what" | "where" | "pfc_target" | "core")[] = []
  if (tags.some((t) => t === "stream/core" || t === "auditory/core" || t === "region/core")) {
    streamRoles.push("core")
  }
  if (tags.some((t) => t === "stream/what" || t === "stream/ventral")) {
    streamRoles.push("what")
  }
  if (tags.some((t) => t === "stream/where" || t === "stream/dorsal")) {
    streamRoles.push("where")
  }
  if (tags.some((t) => t === "stream/pfc" || t === "stream/pfc_target")) {
    streamRoles.push("pfc_target")
  }

  // Skip if no stream roles
  if (streamRoles.length === 0) return null

  // Determine certainty
  let certainty: "safe" | "uncertain" = "uncertain"
  if (tags.some((t) => t === "stream/safe" || t === "certainty/safe")) {
    certainty = "safe"
  } else if (tags.some((t) => t === "stream/uncertain" || t === "certainty/uncertain")) {
    certainty = "uncertain"
  }

  // Determine region type
  let regionType: "glasser" | "classical" | "network" | null = null
  if (tags.some((t) => t === "region/glasser" || t === "type/glasser")) {
    regionType = "glasser"
  } else if (tags.some((t) => t === "region/classical" || t === "type/classical")) {
    regionType = "classical"
  } else if (tags.some((t) => t === "region/network" || t === "type/network")) {
    regionType = "network"
  }

  // Auto-detect type from slug if not specified
  if (!regionType) {
    if (slug.includes("Glasser-areas") || slug.includes("2.-Glasser")) {
      regionType = "glasser"
    } else if (slug.includes("Other-areas") || slug.includes("3.-Other")) {
      regionType = "classical"
    } else if (
      slug.toLowerCase().includes("network") ||
      slug.includes("VAN") ||
      slug.includes("DAN") ||
      slug.includes("FPN")
    ) {
      regionType = "network"
    }
  }

  // Extract function tags
  const functionTags = tags
    .filter((t) => t.startsWith("function/"))
    .map((t) => t.replace("function/", ""))

  return {
    slug,
    title: entry.title || slug.split("/").pop() || slug,
    streamRoles,
    certainty,
    regionType,
    functionTags,
  }
}

function getFunctionLabel(tag: string): string {
  const labels: Record<string, string> = {
    semantic: "semantic",
    spatialprocessing: "spatial",
    language: "language",
    prosody: "prosody",
  }
  return labels[tag] || tag
}

function createRegionPill(region: RegionData, currentPath: string): HTMLElement {
  const certaintyIcon = region.certainty === "safe" ? "✓" : "?"
  const certaintyClass = region.certainty === "safe" ? "safe" : "uncertain"

  const pill = document.createElement("a")
  pill.className = `region-pill ${certaintyClass}`
  pill.href = `/${region.slug}`

  const certaintySpan = document.createElement("span")
  certaintySpan.className = `certainty-icon ${certaintyClass}`
  certaintySpan.textContent = certaintyIcon
  pill.appendChild(certaintySpan)

  const labelSpan = document.createElement("span")
  labelSpan.className = "region-label"
  labelSpan.textContent = region.title
  pill.appendChild(labelSpan)

  // Add function badges
  for (const tag of region.functionTags) {
    const badge = document.createElement("span")
    badge.className = `function-badge ${tag}`
    badge.textContent = getFunctionLabel(tag)
    pill.appendChild(badge)
  }

  return pill
}

function renderRegionGroup(
  regions: RegionData[],
  typeLabel: string,
  currentPath: string,
): HTMLElement | null {
  if (regions.length === 0) return null

  const group = document.createElement("div")
  group.className = "region-group"

  const heading = document.createElement("h4")
  heading.textContent = typeLabel
  group.appendChild(heading)

  const pillsContainer = document.createElement("div")
  pillsContainer.className = "region-pills"

  for (const region of regions) {
    pillsContainer.appendChild(createRegionPill(region, currentPath))
  }

  group.appendChild(pillsContainer)
  return group
}

function renderFunctionTagsLegend(): HTMLElement {
  const legend = document.createElement("div")
  legend.className = "function-tags-legend"

  const h3 = document.createElement("h3")
  h3.textContent = "Function Tags:"
  legend.appendChild(h3)

  const tagsContainer = document.createElement("div")
  tagsContainer.className = "legend-tags"

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

  for (const tag of tags) {
    const span = document.createElement("span")
    span.className = `legend-tag ${tag.key}`
    span.textContent = tag.label
    tagsContainer.appendChild(span)
  }

  legend.appendChild(tagsContainer)
  return legend
}

function renderStreamSection(
  title: string,
  subtitle: string,
  regions: RegionData[],
  currentPath: string,
): HTMLElement {
  const section = document.createElement("section")
  section.className = "stream-section"

  const header = document.createElement("div")
  header.className = "stream-header"

  const h2 = document.createElement("h2")
  h2.textContent = title
  header.appendChild(h2)

  const subtitleP = document.createElement("p")
  subtitleP.className = "stream-subtitle"
  subtitleP.textContent = subtitle
  header.appendChild(subtitleP)

  section.appendChild(header)

  // Group by region type
  const glasser = regions.filter((r) => r.regionType === "glasser")
  const classical = regions.filter((r) => r.regionType === "classical")
  const network = regions.filter((r) => r.regionType === "network")

  const glasserGroup = renderRegionGroup(glasser, "Glasser Regions", currentPath)
  const classicalGroup = renderRegionGroup(classical, "Classical Regions", currentPath)
  const networkGroup = renderRegionGroup(network, "Networks", currentPath)

  if (glasserGroup) section.appendChild(glasserGroup)
  if (classicalGroup) section.appendChild(classicalGroup)
  if (networkGroup) section.appendChild(networkGroup)

  return section
}

function renderPFCSection(
  title: string,
  subtitle: string,
  regions: RegionData[],
  currentPath: string,
): HTMLElement {
  const section = document.createElement("section")
  section.className = "stream-section"

  const header = document.createElement("div")
  header.className = "stream-header"

  const h2 = document.createElement("h2")
  h2.textContent = title
  header.appendChild(h2)

  const subtitleP = document.createElement("p")
  subtitleP.className = "stream-subtitle"
  subtitleP.textContent = subtitle
  header.appendChild(subtitleP)

  section.appendChild(header)

  // Split regions by function tags AND stream roles
  const isWhere = (region: RegionData) => {
    // Check if region has where stream role OR spatial function tags
    return (
      region.streamRoles.includes("where") ||
      region.functionTags.some((tag) => tag === "spatialprocessing")
    )
  }

  const isWhat = (region: RegionData) => {
    // Check if region has what stream role OR semantic/language function tags
    return (
      region.streamRoles.includes("what") ||
      region.functionTags.some((tag) =>
        ["semantic", "language", "nonspatial"].includes(tag),
      )
    )
  }

  const whereRegions = regions.filter(isWhere)
  const whatRegions = regions.filter(isWhat)
  const otherRegions = regions.filter((r) => !isWhere(r) && !isWhat(r))

  // Where-related subgroup
  if (whereRegions.length > 0) {
    const whereSubgroup = document.createElement("div")
    whereSubgroup.className = "pfc-subgroup"

    const whereTitle = document.createElement("h3")
    whereTitle.className = "pfc-subgroup-title"
    whereTitle.textContent = "Where-related (Spatial Processing)"
    whereSubgroup.appendChild(whereTitle)

    const glasser = whereRegions.filter((r) => r.regionType === "glasser")
    const classical = whereRegions.filter((r) => r.regionType === "classical")
    const network = whereRegions.filter((r) => r.regionType === "network")

    const glasserGroup = renderRegionGroup(glasser, "Glasser Regions", currentPath)
    const classicalGroup = renderRegionGroup(classical, "Classical Regions", currentPath)
    const networkGroup = renderRegionGroup(network, "Networks", currentPath)

    if (glasserGroup) whereSubgroup.appendChild(glasserGroup)
    if (classicalGroup) whereSubgroup.appendChild(classicalGroup)
    if (networkGroup) whereSubgroup.appendChild(networkGroup)

    section.appendChild(whereSubgroup)
  }

  // What-related subgroup
  if (whatRegions.length > 0) {
    const whatSubgroup = document.createElement("div")
    whatSubgroup.className = "pfc-subgroup"

    const whatTitle = document.createElement("h3")
    whatTitle.className = "pfc-subgroup-title"
    whatTitle.textContent = "What-related (Semantic Processing)"
    whatSubgroup.appendChild(whatTitle)

    const glasser = whatRegions.filter((r) => r.regionType === "glasser")
    const classical = whatRegions.filter((r) => r.regionType === "classical")
    const network = whatRegions.filter((r) => r.regionType === "network")

    const glasserGroup = renderRegionGroup(glasser, "Glasser Regions", currentPath)
    const classicalGroup = renderRegionGroup(classical, "Classical Regions", currentPath)
    const networkGroup = renderRegionGroup(network, "Networks", currentPath)

    if (glasserGroup) whatSubgroup.appendChild(glasserGroup)
    if (classicalGroup) whatSubgroup.appendChild(classicalGroup)
    if (networkGroup) whatSubgroup.appendChild(networkGroup)

    section.appendChild(whatSubgroup)
  }

  // Other subgroup
  if (otherRegions.length > 0) {
    const otherSubgroup = document.createElement("div")
    otherSubgroup.className = "pfc-subgroup"

    const otherTitle = document.createElement("h3")
    otherTitle.className = "pfc-subgroup-title"
    otherTitle.textContent = "Other"
    otherSubgroup.appendChild(otherTitle)

    const glasser = otherRegions.filter((r) => r.regionType === "glasser")
    const classical = otherRegions.filter((r) => r.regionType === "classical")
    const network = otherRegions.filter((r) => r.regionType === "network")

    const glasserGroup = renderRegionGroup(glasser, "Glasser Regions", currentPath)
    const classicalGroup = renderRegionGroup(classical, "Classical Regions", currentPath)
    const networkGroup = renderRegionGroup(network, "Networks", currentPath)

    if (glasserGroup) otherSubgroup.appendChild(glasserGroup)
    if (classicalGroup) otherSubgroup.appendChild(classicalGroup)
    if (networkGroup) otherSubgroup.appendChild(networkGroup)

    section.appendChild(otherSubgroup)
  }

  return section
}

// Wait for CSS to be loaded to prevent FOUC
function waitForStyles(): Promise<void> {
  return new Promise((resolve) => {
    // Check if styles are already loaded
    const testElement = document.createElement("div")
    testElement.className = "region-pill"
    testElement.style.visibility = "hidden"
    testElement.style.position = "absolute"
    document.body.appendChild(testElement)

    const checkStyles = () => {
      const styles = window.getComputedStyle(testElement)
      // Check if our custom styles are applied
      if (styles.borderRadius !== "0px" || styles.display === "inline-flex") {
        document.body.removeChild(testElement)
        resolve()
      } else {
        // Styles not loaded yet, check again soon
        setTimeout(checkStyles, 50)
      }
    }

    // Start checking, but timeout after 2 seconds
    const timeout = setTimeout(() => {
      document.body.removeChild(testElement)
      resolve()
    }, 2000)

    checkStyles()
  })
}

async function buildDynamicStreamsMap() {
  try {
    // Wait for styles to be fully loaded to prevent FOUC
    await waitForStyles()

    // Fetch content index
    const response = await fetch("/static/contentIndex.json")
    const contentIndex: ContentIndex = await response.json()

    // Extract all regions from content index
    const allRegions: RegionData[] = []
    for (const [slug, entry] of Object.entries(contentIndex)) {
      const regionData = extractRegionData(slug, entry)
      if (regionData) {
        allRegions.push(regionData)
      }
    }

    // Group by stream role (regions can appear in multiple)
    const coreRegions = allRegions.filter((r) => r.streamRoles.includes("core"))
    const whereRegions = allRegions.filter((r) => r.streamRoles.includes("where"))
    const whatRegions = allRegions.filter((r) => r.streamRoles.includes("what"))
    const pfcRegions = allRegions.filter((r) => r.streamRoles.includes("pfc_target"))

    // Find the container
    const container = document.querySelector(".auditory-streams-map")
    if (!container) {
      console.error("Auditory streams map container not found")
      return
    }

    // Add a fade-out transition before clearing
    container.style.opacity = "0"
    await new Promise(resolve => setTimeout(resolve, 150))

    // Clear existing content
    container.innerHTML = ""

    // Get current path for relative links
    const currentPath = window.location.pathname

    // Add Function Tags Legend at the top
    container.appendChild(renderFunctionTagsLegend())

    // Render sections (Core first, then Where, What, PFC)
    if (coreRegions.length > 0) {
      container.appendChild(
        renderStreamSection(
          "Core/Belt Auditory Regions",
          "Primary auditory cortex regions and belt areas that serve as the foundation for auditory processing",
          coreRegions,
          currentPath,
        ),
      )
    }

    container.appendChild(
      renderStreamSection(
        "Auditory Where-Stream (Dorsal)",
        "Regions involved in spatial auditory processing and sensorimotor integration",
        whereRegions,
        currentPath,
      ),
    )

    container.appendChild(
      renderStreamSection(
        "Auditory What-Stream (Ventral)",
        "Regions involved in auditory object identification and semantic processing",
        whatRegions,
        currentPath,
      ),
    )

    // Use specialized PFC renderer with Where/What split
    container.appendChild(
      renderPFCSection(
        "Prefrontal Target Regions",
        "Prefrontal cortex regions receiving projections from auditory streams",
        pfcRegions,
        currentPath,
      ),
    )

    // Fade back in with a smooth transition
    container.style.transition = "opacity 0.3s ease-in"
    container.style.opacity = "1"
  } catch (error) {
    console.error("Failed to build dynamic streams map:", error)
    // Ensure container is visible even if there's an error
    const container = document.querySelector(".auditory-streams-map") as HTMLElement
    if (container) {
      container.style.opacity = "1"
    }
  }
}

// Run when page loads
document.addEventListener("nav", () => {
  // Only run on the auditory streams page
  if (
    window.location.pathname.includes("auditory-streams") ||
    window.location.pathname.includes("Auditory-Streams-Overview")
  ) {
    buildDynamicStreamsMap()
  }
})
