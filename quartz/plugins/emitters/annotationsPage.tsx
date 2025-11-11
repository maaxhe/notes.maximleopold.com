import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { FullSlug } from "../../util/path"
import { sharedPageComponents, defaultListPageLayout } from "../../../quartz.layout"
import { AnnotationsOverview } from "../../components"
import { defaultProcessedContent } from "../vfile"
import { write } from "./helpers"

export const AnnotationsPage: QuartzEmitterPlugin = () => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: AnnotationsOverview(),
  }

  const { head: Head, pageBody, footer: Footer } = opts
  const Body = BodyConstructor()

  return {
    name: "AnnotationsPage",
    getQuartzComponents() {
      return [Head, Body, pageBody, Footer]
    },
    async *emit(ctx, _content, resources) {
      const cfg = ctx.cfg.configuration
      const slug = "Bachelorarbeit/Annotationen" as FullSlug

      const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
      const path = url.pathname as FullSlug
      const title = "Alle Annotationen"
      const description = "Übersicht aller öffentlichen Annotationen auf dieser Website"

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
        allFiles: [],
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
