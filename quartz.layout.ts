import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.HypothesisSPA(),
    Component.SidebarToggle(),
    Component.RAGChatbot({ collapsed: true }),
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
    Component.ContentMeta(),
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
        { Component: Component.AnnotationsBadge() },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
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
    Component.HypothesisSPA(),
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
    Component.RAGChatbot({ collapsed: true }),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Flex({
      components: [
        { Component: Component.AnnotationsBadge() },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
