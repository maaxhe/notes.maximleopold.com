import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// The standalone Funkkurs site (funk.maximilianherrmann.com) is a stripped-down
// public course: no "Zuletzt geändert / Wörter"-Meta, no Mika RAG-Chatbot and no
// Hypothesis annotations. Detected via the build env var that scripts/publish-funk.sh
// sets; the main notes site keeps all of these.
const isFunkBuild = process.env.QUARTZ_BASE_URL === "funk.maximilianherrmann.com"
const contentMeta = isFunkBuild ? [] : [Component.ContentMeta()]
const hypothesis = isFunkBuild ? [] : [Component.HypothesisSPA()]
const ragChatbot = isFunkBuild ? [] : [Component.RAGChatbot({ collapsed: true })]
const annotationsBadge = isFunkBuild ? [] : [{ Component: Component.AnnotationsBadge() }]

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    ...hypothesis,
    Component.SidebarToggle(),
    ...ragChatbot,
  ],
  footer: Component.Footer({
    links: {
      "Mein GitHub": "https://github.com/maaxhe",
      "Website": "https://maximleopold.com",
      "Feedback": "mailto:deine-email@example.com",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    ...contentMeta,
    Component.ConditionalRender({
      component: Component.ThesisDashboard({ compact: true, showProgress: true }),
      condition: (page) => {
        const title = (page.fileData.frontmatter?.title as string) || ""
        return title.startsWith("0.0 ") || title.startsWith("0.1 ")
      },
    }),
    Component.FeedbackBadge(),
    Component.ReviewStatus(),
    Component.ExportButton(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Flex({
      components: [
        ...annotationsBadge,
        { Component: Component.Darkmode() },
        { Component: Component.FontToggle() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      filterFn: (node) => node.slugSegment !== "tags",
    }),
  ],
  right: [
    Component.ConditionalRender({
      component: Component.Graph({
        collapsible: false,
        showTitle: false,
        localGraph: {
          showTags: false,
          depth: -1, // Show all nodes on home page
          scale: 0.9,
          repelForce: 1.8,
          centerForce: 1.3,
          focusOnHover: true,
        },
        globalGraph: { showTags: false },
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.Graph({
        collapsible: false,
        showTitle: false,
        localGraph: {
          showTags: false,
          scale: 0.9,
          repelForce: 1.5,
          centerForce: 0.1,
          focusOnHover: true,
        },
        globalGraph: { showTags: false },
      }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.StreamBadge(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Bibliography(),
  ],
  afterBody: [
    Component.ImageLightbox(),
    ...hypothesis,
    Component.SidebarToggle(),
    Component.ConditionalRender({
      component: Component.ExportAllButton(),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.AuditoryStreamsMap(),
      condition: (page) =>
        page.fileData.slug === "auditory-streams" ||
        page.fileData.slug === "Bachelorarbeit/auditory-streams" ||
        page.fileData.slug === "Bachelorarbeit/Auditory-Streams-Overview",
    }),
    Component.ConditionalRender({
      component: Component.ThesisDashboard(),
      condition: (page) => page.fileData.slug?.toLowerCase().endsWith("dashboard-ba") ?? false,
    }),
    Component.Comments({
      provider: "giscus",
      options: {
        repo: "maaxhe/notes.maximleopold.com",
        repoId: "R_kgDOQS7ZRQ",
        category: "General",
        categoryId: "DIC_kwDOQS7ZRc4CxpfZ",
        mapping: "pathname",
        strict: false,
        reactionsEnabled: true,
        inputPosition: "bottom",
      },
    }),
    Component.Backlinks(),
    Component.PageNavigation(),
    ...ragChatbot,
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), ...contentMeta],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Flex({
      components: [
        ...annotationsBadge,
        { Component: Component.Darkmode() },
        { Component: Component.FontToggle() },
      ],
    }),
    Component.Explorer({
      filterFn: (node) => node.slugSegment !== "tags",
    }),
  ],
  right: [],
}
