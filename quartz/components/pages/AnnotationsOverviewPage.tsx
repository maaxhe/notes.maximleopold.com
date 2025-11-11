import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import Body from "../Body"
import AnnotationsOverview from "../AnnotationsOverview"

export default (() => {
  const AnnotationsOverviewPage: QuartzComponent = (props: QuartzComponentProps) => {
    return (
      <div>
        <AnnotationsOverview {...props} />
        <Body {...props} />
      </div>
    )
  }

  AnnotationsOverviewPage.css = AnnotationsOverview.css
  return AnnotationsOverviewPage
}) satisfies QuartzComponentConstructor
