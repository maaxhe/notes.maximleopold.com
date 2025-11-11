import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
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
    Component.NewBadge(),
    Component.FeedbackBadge(),
    Component.ReviewStatus(),
    Component.ExportButton(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    Component.ConditionalRender({
      component: Component.Graph({
        localGraph: {
          showTags: false,
          depth: -1, // Show all nodes on home page
          scale: 0.9,
          repelForce: 0.5,
          centerForce: 0.2,
          focusOnHover: true,
        },
        globalGraph: { showTags: false },
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.Graph({
        localGraph: { showTags: false },
        globalGraph: { showTags: false },
      }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.FilteredToggleList({
      summary: "#stream/dorsal",
      emptyLabel: "Keine freigegebenen Notizen für diesen Stream.",
      limit: 8,
      filter: (page) =>
        (page.frontmatter?.tags ?? []).some(
          (tag) => typeof tag === "string" && tag.toLowerCase() === "stream/dorsal",
        ),
    }),
    Component.FilteredToggleList({
      summary: "#stream/ventral",
      emptyLabel: "Keine freigegebenen Notizen für diesen Stream.",
      limit: 8,
      filter: (page) =>
        (page.frontmatter?.tags ?? []).some(
          (tag) => typeof tag === "string" && tag.toLowerCase() === "stream/ventral",
        ),
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Bibliography(),
    Component.Backlinks(),
  ],
  afterBody: [
    Component.PageNavigation(),
    Component.Comments({
      provider: "giscus",
      options: {
        repo: "maaxhe/notes.maximleopold.com",
        repoId: "R_kgDOQS7ZRQ",
        category: "General",
        categoryId: "DIC_kwDOQS7ZRc4CxpfZ",
        mapping: "pathname",
        reactionsEnabled: true,
        inputPosition: "top",
        lang: "de",
      },
    }),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
