import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import Body from "../Body"
import OpenFeedback from "../OpenFeedback"

export default (() => {
  const OpenFeedbackPage: QuartzComponent = (props: QuartzComponentProps) => {
    return (
      <div>
        <OpenFeedback {...props} />
        <Body {...props} />
      </div>
    )
  }

  OpenFeedbackPage.css = OpenFeedback.css
  return OpenFeedbackPage
}) satisfies QuartzComponentConstructor
