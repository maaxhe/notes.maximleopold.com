/**
 * Auditory Streams Data Model
 *
 * This file contains the central configuration for all brain regions
 * involved in auditory processing streams (What/Where) and their
 * prefrontal targets.
 */

export type StreamRole = "what" | "where" | "pfc_target"
export type RegionType = "glasser" | "classical" | "network"
export type Certainty = "safe" | "uncertain"
export type FunctionTag =
  | "semantic"
  | "spatialprocessing"
  | "nonspatial"
  | "language"
  | "prosody"
  | "workingmemory"
  | "visual"
  | "motion"
  | "none"
  | string // Allow any custom function tag

export interface RegionEntry {
  /** Internal identifier (e.g., "A5", "PGi", "DAN") */
  id: string

  /** Display label shown in the UI */
  label: string

  /** Type of region: Glasser parcellation, classical anatomy, or network */
  regionType: RegionType

  /** Which streams or roles this region belongs to (can be multiple) */
  streamRoles: StreamRole[]

  /** Certainty of the assignment (safe = well-established, uncertain = tentative) */
  certainty: Certainty

  /** Optional functional specialization (single tag - deprecated, use functionTags) */
  functionTag?: FunctionTag

  /** Optional functional specializations (multiple tags supported) */
  functionTags?: FunctionTag[]

  /** Optional slug to link to detailed ROI page */
  slug?: string

  /** Optional description */
  description?: string
}

/**
 * Central registry of all regions
 *
 * To add a new region:
 * 1. Add a new RegionEntry to this array
 * 2. Set the appropriate streamRole ("what", "where", or "pfc_target")
 * 3. Set regionType ("glasser", "classical", or "network")
 * 4. Set certainty based on literature confidence
 * 5. Optionally add functionTag and slug
 */
export const regions: RegionEntry[] = [
  // ============================================================================
  // AUDITORY WHAT-STREAM (VENTRAL)
  // ============================================================================

  // --- Glasser Regions (What-Stream) ---
  {
    id: "PGi",
    label: "PGi",
    regionType: "glasser",
    streamRoles: ["what"],
    certainty: "uncertain",
    functionTag: "semantic",
    slug: "Bachelorarbeit/2.-Glasser-areas/PGi",
  },
  {
    id: "PSL",
    label: "PSL",
    regionType: "glasser",
    streamRoles: ["what"],
    certainty: "uncertain",
    functionTag: "semantic",
    slug: "Bachelorarbeit/2.-Glasser-areas/PSL",
  },
  {
    id: "STV",
    label: "STV",
    regionType: "glasser",
    streamRoles: ["what"],
    certainty: "uncertain",
    functionTag: "semantic",
    slug: "Bachelorarbeit/2.-Glasser-areas/STV",
  },
  {
    id: "TPOJ1",
    label: "TPOJ1",
    regionType: "glasser",
    streamRoles: ["what"],
    certainty: "uncertain",
    functionTag: "semantic",
    slug: "Bachelorarbeit/2.-Glasser-areas/TPOJ1",
  },
  {
    id: "STS",
    label: "STS",
    regionType: "glasser",
    streamRoles: ["what"],
    certainty: "uncertain",
    functionTag: "semantic",
    slug: "Bachelorarbeit/2.-Glasser-areas/STS",
  },
  {
    id: "STSvp",
    label: "STSvp",
    regionType: "glasser",
    streamRoles: ["what"],
    certainty: "safe",
    functionTag: "semantic",
    slug: "Bachelorarbeit/2.-Glasser-areas/STSvp",
  },
  {
    id: "STGa",
    label: "STGa",
    regionType: "glasser",
    streamRoles: ["what"],
    certainty: "safe",
    functionTag: "semantic",
    slug: "Bachelorarbeit/2.-Glasser-areas/STGa",
  },
  {
    id: "TGv",
    label: "TGv",
    regionType: "glasser",
    streamRoles: ["what"],
    certainty: "safe",
    functionTag: "semantic",
    slug: "Bachelorarbeit/2.-Glasser-areas/TGv",
  },
  {
    id: "TGd",
    label: "TGd",
    regionType: "glasser",
    streamRoles: ["what"],
    certainty: "safe",
    functionTag: "semantic",
    slug: "Bachelorarbeit/2.-Glasser-areas/TGd",
  },
  {
    id: "TA2",
    label: "TA2",
    regionType: "glasser",
    streamRoles: ["what"],
    certainty: "safe",
    functionTag: "semantic",
    slug: "Bachelorarbeit/2.-Glasser-areas/TA2",
  },
  {
    id: "LBelt",
    label: "LBelt",
    regionType: "glasser",
    streamRoles: ["what"],
    certainty: "safe",
    slug: "Bachelorarbeit/2.-Glasser-areas/LBelt",
  },

  // --- Classical Regions (What-Stream) ---
  {
    id: "pSTG",
    label: "posterior STG",
    regionType: "classical",
    streamRoles: ["what"],
    certainty: "safe",
    functionTag: "semantic",
    slug: "Bachelorarbeit/3.-Other-areas/pSTG",
  },
  {
    id: "mSTG",
    label: "middle STG",
    regionType: "classical",
    streamRoles: ["what"],
    certainty: "safe",
    functionTag: "semantic",
    slug: "Bachelorarbeit/3.-Other-areas/mSTG",
  },

  // --- Networks (What-Stream) ---
  {
    id: "VAN",
    label: "VAN (Ventral Attention Network)",
    regionType: "network",
    streamRoles: ["what"],
    certainty: "safe",
    functionTag: "semantic",
    slug: "Bachelorarbeit/VAN",
  },

  // ============================================================================
  // AUDITORY WHERE-STREAM (DORSAL)
  // ============================================================================

  // --- Glasser Regions (Where-Stream) ---
  {
    id: "A5",
    label: "A5",
    regionType: "glasser",
    streamRoles: ["where"],
    certainty: "uncertain",
    functionTag: "spatialprocessing",
    slug: "Bachelorarbeit/2.-Glasser-areas/A5",
  },
  {
    id: "A4",
    label: "A4",
    regionType: "glasser",
    streamRoles: ["where"],
    certainty: "safe",
    functionTag: "spatialprocessing",
    slug: "Bachelorarbeit/2.-Glasser-areas/A4",
  },
  {
    id: "PBelt",
    label: "PBelt",
    regionType: "glasser",
    streamRoles: ["where"],
    certainty: "uncertain",
    functionTag: "spatialprocessing",
    slug: "Bachelorarbeit/2.-Glasser-areas/PBelt",
  },
  {
    id: "MBelt",
    label: "MBelt",
    regionType: "glasser",
    streamRoles: ["where"],
    certainty: "safe",
    functionTag: "spatialprocessing",
    slug: "Bachelorarbeit/2.-Glasser-areas/MBelt",
  },
  {
    id: "MT",
    label: "MT",
    regionType: "glasser",
    streamRoles: ["where"],
    certainty: "safe",
    functionTag: "spatialprocessing",
    slug: "Bachelorarbeit/2.-Glasser-areas/MT",
  },
  {
    id: "MST",
    label: "MST",
    regionType: "glasser",
    streamRoles: ["where"],
    certainty: "safe",
    functionTag: "spatialprocessing",
    slug: "Bachelorarbeit/2.-Glasser-areas/MST",
  },
  {
    id: "STSdp",
    label: "STSdp",
    regionType: "glasser",
    streamRoles: ["where"],
    certainty: "safe",
    functionTag: "spatialprocessing",
    slug: "Bachelorarbeit/2.-Glasser-areas/STSdp",
  },
  {
    id: "STSda",
    label: "STSda",
    regionType: "glasser",
    streamRoles: ["where"],
    certainty: "safe",
    functionTag: "spatialprocessing",
    slug: "Bachelorarbeit/2.-Glasser-areas/STSda",
  },

  // --- Classical Regions (Where-Stream) ---
  {
    id: "IPL",
    label: "IPL (Inferior Parietal Lobule)",
    regionType: "classical",
    streamRoles: ["where"],
    certainty: "safe",
    functionTag: "spatialprocessing",
    slug: "Bachelorarbeit/3.-Other-areas/IPL",
  },
  {
    id: "SPL",
    label: "SPL (Superior Parietal Lobule)",
    regionType: "classical",
    streamRoles: ["where"],
    certainty: "safe",
    functionTag: "spatialprocessing",
    slug: "Bachelorarbeit/3.-Other-areas/SPL",
  },
  {
    id: "PPo",
    label: "PPo (Planum Polare)",
    regionType: "classical",
    streamRoles: ["where"],
    certainty: "safe",
    functionTag: "spatialprocessing",
    slug: "Bachelorarbeit/3.-Other-areas/PPo",
  },
  {
    id: "pPPo",
    label: "pPPo (posterior Planum Polare)",
    regionType: "classical",
    streamRoles: ["where"],
    certainty: "safe",
    functionTag: "spatialprocessing",
    slug: "Bachelorarbeit/3.-Other-areas/pPPo",
  },

  // --- Networks (Where-Stream) ---
  {
    id: "DAN",
    label: "DAN (Dorsal Attention Network)",
    regionType: "network",
    streamRoles: ["where"],
    certainty: "safe",
    functionTag: "spatialprocessing",
    slug: "Bachelorarbeit/1.-Streams-and-related/DAN",
  },

  // ============================================================================
  // PREFRONTAL TARGETS
  // ============================================================================

  // --- Glasser Regions (PFC) ---
  {
    id: "FEF",
    label: "FEF (Frontal Eye Field)",
    regionType: "glasser",
    streamRoles: ["pfc_target"],
    certainty: "safe",
    functionTag: "spatialprocessing",
    slug: "Bachelorarbeit/2.-Glasser-areas/FEF",
  },
  {
    id: "IFJ",
    label: "IFJ (Inferior Frontal Junction)",
    regionType: "glasser",
    streamRoles: ["pfc_target"],
    certainty: "safe",
    functionTag: "semantic",
    slug: "Bachelorarbeit/2.-Glasser-areas/IFJ",
  },
  {
    id: "BA44",
    label: "BA44 (Broca's Area)",
    regionType: "glasser",
    streamRoles: ["pfc_target"],
    certainty: "safe",
    functionTag: "semantic",
    slug: "Bachelorarbeit/2.-Glasser-areas/BA44,-44",
  },
  {
    id: "BA45",
    label: "BA45",
    regionType: "glasser",
    streamRoles: ["pfc_target"],
    certainty: "safe",
    functionTag: "semantic",
    slug: "Bachelorarbeit/2.-Glasser-areas/BA45,-45",
  },
  {
    id: "BA47l",
    label: "BA47l",
    regionType: "glasser",
    streamRoles: ["pfc_target"],
    certainty: "safe",
    functionTag: "semantic",
    slug: "Bachelorarbeit/2.-Glasser-areas/BA47l,-47l",
  },

  // --- Classical Regions (PFC) ---
  {
    id: "IFG",
    label: "IFG (Inferior Frontal Gyrus)",
    regionType: "classical",
    streamRoles: ["pfc_target"],
    certainty: "safe",
    functionTag: "semantic",
    slug: "Bachelorarbeit/3.-Other-areas/IFG",
  },
  {
    id: "dlPFC",
    label: "dlPFC (Dorsolateral PFC)",
    regionType: "classical",
    streamRoles: ["pfc_target"],
    certainty: "safe",
    functionTag: "spatialprocessing",
    slug: "Bachelorarbeit/3.-Other-areas/dorsolateral-PFC",
  },
  {
    id: "vlPFC",
    label: "vlPFC (Ventrolateral PFC)",
    regionType: "classical",
    streamRoles: ["pfc_target"],
    certainty: "safe",
    functionTag: "semantic",
    slug: "Bachelorarbeit/3.-Other-areas/Ventrolateral-PFC",
  },
  {
    id: "fOP",
    label: "fOP (frontal Operculum)",
    regionType: "classical",
    streamRoles: ["pfc_target"],
    certainty: "safe",
    slug: "Bachelorarbeit/3.-Other-areas/fOP",
  },

  // --- Networks (PFC) ---
  {
    id: "FPN",
    label: "FPN (Frontoparietal Network)",
    regionType: "network",
    streamRoles: ["pfc_target"],
    certainty: "safe",
    slug: "Bachelorarbeit/1.-Streams-and-related/FPN",
  },
]

/**
 * Helper functions to filter regions
 */

export function getRegionsByStreamRole(role: StreamRole): RegionEntry[] {
  return regions.filter((r) => r.streamRoles.includes(role))
}

export function getRegionsByType(
  streamRole: StreamRole,
  regionType: RegionType,
): RegionEntry[] {
  return regions.filter((r) => r.streamRoles.includes(streamRole) && r.regionType === regionType)
}

export function groupRegionsByType(streamRole: StreamRole): {
  glasser: RegionEntry[]
  classical: RegionEntry[]
  network: RegionEntry[]
} {
  const filtered = getRegionsByStreamRole(streamRole)
  return {
    glasser: filtered.filter((r) => r.regionType === "glasser"),
    classical: filtered.filter((r) => r.regionType === "classical"),
    network: filtered.filter((r) => r.regionType === "network"),
  }
}
