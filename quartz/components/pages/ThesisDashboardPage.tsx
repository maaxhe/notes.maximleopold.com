import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import Body from "../Body"
import ThesisDashboard from "../ThesisDashboard"

export default (() => {
  const ThesisDashboardPage: QuartzComponent = (props: QuartzComponentProps) => {
    return (
      <div>
        <ThesisDashboard {...props} />
        <Body {...props} />
      </div>
    )
  }

  ThesisDashboardPage.css = ThesisDashboard.css
  return ThesisDashboardPage
}) satisfies QuartzComponentConstructor
