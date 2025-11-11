import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import Body from "../Body"
import RecentChanges from "../RecentChanges"

export default (() => {
  const RecentChangesPage: QuartzComponent = (props: QuartzComponentProps) => {
    return (
      <div>
        <RecentChanges {...props} />
        <Body {...props} />
      </div>
    )
  }

  RecentChangesPage.css = RecentChanges.css
  return RecentChangesPage
}) satisfies QuartzComponentConstructor
