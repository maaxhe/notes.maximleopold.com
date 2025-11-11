import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/hypothesis.inline"

interface HypothesisSPAOptions {
  enable?: boolean
}

const defaultOptions: HypothesisSPAOptions = {
  enable: true,
}

export default ((opts?: Partial<HypothesisSPAOptions>) => {
  const options: HypothesisSPAOptions = { ...defaultOptions, ...opts }

  const HypothesisSPA: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    if (!options.enable) {
      return null
    }

    // Return empty div - the script is loaded via afterDOMLoaded
    return <div style="display: none;" data-hypothesis-spa="true"></div>
  }

  HypothesisSPA.afterDOMLoaded = script

  return HypothesisSPA
}) satisfies QuartzComponentConstructor
