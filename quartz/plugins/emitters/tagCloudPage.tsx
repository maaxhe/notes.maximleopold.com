import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { FullSlug } from "../../util/path"
import { sharedPageComponents, defaultListPageLayout } from "../../../quartz.layout"
import { TagCloud } from "../../components"
import { defaultProcessedContent } from "../vfile"
import { write } from "./helpers"

export const TagCloudPage: QuartzEmitterPlugin = () => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: TagCloud(),
  }

  const { head: Head, pageBody, footer: Footer } = opts
  const Body = BodyConstructor()

  return {
    name: "TagCloudPage",
    getQuartzComponents() {
      return [Head, Body, pageBody, Footer]
    },
    async *emit(ctx, content, resources) {
      const cfg = ctx.cfg.configuration
      const slug = "alle-tags" as FullSlug

      const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
      const path = url.pathname as FullSlug
      const title = "Alle Tags"
      const description = "Übersicht aller Tags und deren Häufigkeit"

      const [tree, vfile] = defaultProcessedContent({
        slug,
        text: title,
        description: description,
        frontmatter: { title, tags: [] },
      })

      const externalResources = pageResources(path, resources)
      const componentData: QuartzComponentProps = {
        ctx,
        fileData: vfile.data,
        externalResources,
        cfg,
        children: [],
        tree,
        allFiles: content.map((c) => c[1].data),
      }

      yield write({
        ctx,
        content: renderPage(cfg, slug, componentData, opts, externalResources),
        slug,
        ext: ".html",
      })
    },
    async *partialEmit() {},
  }
}
