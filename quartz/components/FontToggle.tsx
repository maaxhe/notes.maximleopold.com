// @ts-ignore
import fontToggleScript from "./scripts/fonttoggle.inline"
import styles from "./styles/fonttoggle.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const FontToggle: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <button class={classNames(displayClass, "fonttoggle")} aria-label="Toggle Computer Modern font">
      <span class="font-label-default" title="Zu Computer Modern wechseln">
        Aa
      </span>
      <span class="font-label-cm" title="Standardschrift wiederherstellen">
        Aa
      </span>
    </button>
  )
}

FontToggle.beforeDOMLoaded = fontToggleScript
FontToggle.css = styles

export default (() => FontToggle) satisfies QuartzComponentConstructor
