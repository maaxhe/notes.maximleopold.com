import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/graph.inline"
import style from "./styles/graph.scss"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

export interface D3Config {
  drag: boolean
  zoom: boolean
  depth: number
  scale: number
  repelForce: number
  centerForce: number
  linkDistance: number
  fontSize: number
  opacityScale: number
  removeTags: string[]
  showTags: boolean
  focusOnHover?: boolean
  enableRadial?: boolean
}

interface GraphOptions {
  localGraph: Partial<D3Config> | undefined
  globalGraph: Partial<D3Config> | undefined
  collapsible?: boolean
  showTitle?: boolean
}

const defaultOptions: GraphOptions = {
  localGraph: {
    drag: true,
    zoom: true,
    depth: 1,
    scale: 1.1,
    repelForce: 0.5,
    centerForce: 0.3,
    linkDistance: 30,
    fontSize: 0.6,
    opacityScale: 1,
    showTags: true,
    removeTags: [],
    focusOnHover: false,
    enableRadial: false,
  },
  globalGraph: {
    drag: true,
    zoom: true,
    depth: -1,
    scale: 0.9,
    repelForce: 0.5,
    centerForce: 0.2,
    linkDistance: 30,
    fontSize: 0.6,
    opacityScale: 1,
    showTags: true,
    removeTags: [],
    focusOnHover: true,
    enableRadial: true,
  },
}

export default ((opts?: Partial<GraphOptions>) => {
  const Graph: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const localGraph = { ...defaultOptions.localGraph, ...opts?.localGraph }
    const globalGraph = { ...defaultOptions.globalGraph, ...opts?.globalGraph }
    const collapsible = opts?.collapsible ?? true
    const showTitle = opts?.showTitle ?? true

    return (
      <div class={classNames(displayClass, "graph")}>
        {collapsible ? (
          <button
            type="button"
            class="graph-header"
            aria-controls="graph-outer"
            aria-expanded="true"
          >
            {showTitle && <h3>{i18n(cfg.locale).components.graph.title}</h3>}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="fold"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        ) : (
          showTitle && (
            <div class="graph-header graph-header-static">
              <h3>{i18n(cfg.locale).components.graph.title}</h3>
            </div>
          )
        )}
        <div class="graph-outer" id="graph-outer">
          <div class="graph-container" data-cfg={JSON.stringify(localGraph)}></div>
          <div class="graph-controls">
            <button class="graph-settings-icon" aria-label="Graph Settings" title="Graph Settings">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m5.196-14.196l-4.242 4.242m0 5.657l4.242 4.242M23 12h-6m-6 0H1m14.196-5.196l-4.242 4.242m0 5.657l4.242 4.242"></path>
              </svg>
            </button>
            <button class="global-graph-icon" aria-label="Global Graph" title="Global Graph (Ctrl/Cmd + G)">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 55 55"
                fill="currentColor"
                xmlSpace="preserve"
              >
                <path
                  d="M49,0c-3.309,0-6,2.691-6,6c0,1.035,0.263,2.009,0.726,2.86l-9.829,9.829C32.542,17.634,30.846,17,29,17
                  s-3.542,0.634-4.898,1.688l-7.669-7.669C16.785,10.424,17,9.74,17,9c0-2.206-1.794-4-4-4S9,6.794,9,9s1.794,4,4,4
                  c0.74,0,1.424-0.215,2.019-0.567l7.669,7.669C21.634,21.458,21,23.154,21,25s0.634,3.542,1.688,4.897L10.024,42.562
                  C8.958,41.595,7.549,41,6,41c-3.309,0-6,2.691-6,6s2.691,6,6,6s6-2.691,6-6c0-1.035-0.263-2.009-0.726-2.86l12.829-12.829
                  c1.106,0.86,2.44,1.436,3.898,1.619v10.16c-2.833,0.478-5,2.942-5,5.91c0,3.309,2.691,6,6,6s6-2.691,6-6c0-2.967-2.167-5.431-5-5.91
                  v-10.16c1.458-0.183,2.792-0.759,3.898-1.619l7.669,7.669C41.215,39.576,41,40.26,41,41c0,2.206,1.794,4,4,4s4-1.794,4-4
                  s-1.794-4-4-4c-0.74,0-1.424,0.215-2.019,0.567l-7.669-7.669C36.366,28.542,37,26.846,37,25s-0.634-3.542-1.688-4.897l9.665-9.665
                  C46.042,11.405,47.451,12,49,12c3.309,0,6-2.691,6-6S52.309,0,49,0z M11,9c0-1.103,0.897-2,2-2s2,0.897,2,2s-0.897,2-2,2
                  S11,10.103,11,9z M6,51c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S8.206,51,6,51z M33,49c0,2.206-1.794,4-4,4s-4-1.794-4-4
                  s1.794-4,4-4S33,46.794,33,49z M29,31c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S32.309,31,29,31z M47,41c0,1.103-0.897,2-2,2
                  s-2-0.897-2-2s0.897-2,2-2S47,39.897,47,41z M49,10c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S51.206,10,49,10z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="global-graph-outer">
          <div class="global-graph-container" data-cfg={JSON.stringify(globalGraph)}></div>
        </div>
        <div class="graph-settings-panel">
          <div class="graph-settings-header">
            <h4>Graph Settings</h4>
            <button class="graph-settings-close" aria-label="Close Settings">×</button>
          </div>
          <div class="graph-settings-content">
            <div class="graph-setting">
              <label>
                <span>Repel Force</span>
                <span class="graph-setting-value" data-setting="repelForce">0.5</span>
              </label>
              <input type="range" min="0" max="2" step="0.1" value="0.5" data-setting="repelForce" />
              <small>How strongly nodes push away from each other</small>
            </div>
            <div class="graph-setting">
              <label>
                <span>Link Distance</span>
                <span class="graph-setting-value" data-setting="linkDistance">30</span>
              </label>
              <input type="range" min="10" max="100" step="5" value="30" data-setting="linkDistance" />
              <small>Distance between connected nodes</small>
            </div>
            <div class="graph-setting">
              <label>
                <span>Center Force</span>
                <span class="graph-setting-value" data-setting="centerForce">0.3</span>
              </label>
              <input type="range" min="0" max="1" step="0.05" value="0.3" data-setting="centerForce" />
              <small>How strongly nodes are pulled to center</small>
            </div>
            <div class="graph-setting">
              <label>
                <span>Node Size</span>
                <span class="graph-setting-value" data-setting="fontSize">0.6</span>
              </label>
              <input type="range" min="0.3" max="1.5" step="0.1" value="0.6" data-setting="fontSize" />
              <small>Size of node labels</small>
            </div>
            <div class="graph-setting graph-setting-toggle">
              <label>
                <input type="checkbox" data-setting="showTags" checked />
                <span>Show Tags</span>
              </label>
              <small>Display tag nodes in the graph</small>
            </div>
            <div class="graph-setting graph-setting-toggle">
              <label>
                <input type="checkbox" data-setting="focusOnHover" />
                <span>Focus on Hover</span>
              </label>
              <small>Highlight connected nodes on hover</small>
            </div>
          </div>
          <div class="graph-settings-footer">
            <button class="graph-settings-reset">Reset to Defaults</button>
          </div>
        </div>
      </div>
    )
  }

  Graph.css = style
  Graph.afterDOMLoaded = script

  return Graph
}) satisfies QuartzComponentConstructor
