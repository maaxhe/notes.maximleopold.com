import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { JSX } from "preact"

interface HypothesisOptions {
  /**
   * Enable highlighting and annotations
   */
  enable?: boolean
  /**
   * Show the sidebar by default
   */
  showSidebar?: boolean
}

const defaultOptions: HypothesisOptions = {
  enable: true,
  showSidebar: false,
}

export default ((opts?: Partial<HypothesisOptions>) => {
  const options: HypothesisOptions = { ...defaultOptions, ...opts }

  const Hypothesis: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
    if (!options.enable) {
      return null
    }

    // Configuration for Hypothesis
    const config = {
      showHighlights: "always",
      openSidebar: options.showSidebar,
    }

    return (
      <>
        {/* Hypothesis configuration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.hypothesisConfig = function () {
              return ${JSON.stringify(config)};
            };`,
          }}
        />
        {/* Hypothesis embed script */}
        <script async src="https://hypothes.is/embed.js"></script>
      </>
    )
  }

  return Hypothesis
}) satisfies QuartzComponentConstructor
