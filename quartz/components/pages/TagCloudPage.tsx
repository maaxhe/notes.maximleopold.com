import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import Body from "../Body"
import TagCloud from "../TagCloud"

export default (() => {
  const TagCloudPage: QuartzComponent = (props: QuartzComponentProps) => {
    return (
      <div>
        <TagCloud {...props} />
        <Body {...props} />
      </div>
    )
  }

  TagCloudPage.css = TagCloud.css
  return TagCloudPage
}) satisfies QuartzComponentConstructor
