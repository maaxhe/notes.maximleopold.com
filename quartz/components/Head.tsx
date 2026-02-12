import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"
export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    // Url of current page
    const socialUrl =
      fileData.slug === "404" ? url.toString() : joinSegments(url.toString(), fileData.slug!)

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {/* Vault authentication - inline check and overlay injection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  // Magic Link Configuration (must match vault-auth.js)
  var MAGIC_LINK_TOKEN = "recruiter-access-2026-mxlpd";
  var MAGIC_LINK_EXPIRY = new Date("2026-01-31T23:59:59").getTime();

  function isTokenValid() {
    try {
      var token = localStorage.getItem('vault_auth_token');
      var timestamp = localStorage.getItem('vault_auth_timestamp');
      if (!token || !timestamp) return false;
      var daysSince = (Date.now() - parseInt(timestamp, 10)) / (1000 * 60 * 60 * 24);
      return daysSince < 30;
    } catch (e) {
      return false;
    }
  }

  function isMagicLinkValid() {
    try {
      var urlParams = new URLSearchParams(window.location.search);
      var accessToken = urlParams.get('access_token');
      if (!accessToken) return false;
      if (accessToken !== MAGIC_LINK_TOKEN) return false;
      if (Date.now() > MAGIC_LINK_EXPIRY) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  if (!isTokenValid() && !isMagicLinkValid()) {
    document.write('<style id="vault-overlay-style">body::after{content:"";position:fixed;top:0;left:0;width:100%;height:100%;background:#0a0a0a;z-index:999998;}</style>');
  }
})();
            `,
          }}
        />
        <script src={joinSegments(baseDir, "static/vault-auth.js")}></script>
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={description} />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta
              property="og:image:type"
              content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`}
            />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
          </>
        )}

        <link rel="icon" href={iconPath} />
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}

        {/* Hypothesis configuration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.hypothesisConfig = function () { return { showHighlights: 'always', openSidebar: false, enableExperimentalNewNoteButton: true }; };`,
          }}
        />
        {/* Load Hypothesis with defer to ensure DOM is ready but script loads early */}
        <script defer src="https://hypothes.is/embed.js"></script>
        {/* Dedicated print stylesheet - loaded last to override everything */}
        <link rel="stylesheet" href={joinSegments(baseDir, "static/print-override.css")} media="print" />
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
