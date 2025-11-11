// Hypothesis SPA navigation handler
// AGGRESSIVE APPROACH: Completely destroy and reload Hypothesis on every navigation

let lastUrl = location.href
let hypothesisScript = null

// Completely remove Hypothesis from the page
function destroyHypothesis() {
  console.log("Hypothesis: Destroying current instance")

  // Remove all Hypothesis elements
  const selectors = [
    "hypothesis-sidebar",
    "hypothesis-adder",
    'link[type="application/annotator+html"]',
    'iframe[title="Hypothesis annotation viewer"]',
    'iframe[src*="hypothes.is"]',
    ".annotator-frame",
    ".annotator-wrapper",
    ".hypothesis-highlights",
  ]

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => el.remove())
  })

  // Remove the script tag
  if (hypothesisScript && hypothesisScript.parentNode) {
    hypothesisScript.parentNode.removeChild(hypothesisScript)
    hypothesisScript = null
  }

  // Clear window objects
  delete window.hypothesisEmbed
  delete window.Hypothesis
}

// Load Hypothesis fresh
function loadHypothesis() {
  console.log("Hypothesis: Loading fresh instance for", location.href)

  // Destroy any existing instance first
  destroyHypothesis()

  // Recreate the config
  window.hypothesisConfig = function () {
    return {
      showHighlights: "always",
      openSidebar: false,
      theme: "clean",
    }
  }

  // Create and inject new script
  hypothesisScript = document.createElement("script")
  hypothesisScript.src = "https://hypothes.is/embed.js"
  hypothesisScript.async = true

  // Add load handler
  hypothesisScript.onload = function () {
    console.log("Hypothesis: Script loaded successfully")
  }

  hypothesisScript.onerror = function () {
    console.error("Hypothesis: Failed to load script")
  }

  document.head.appendChild(hypothesisScript)
}

// Handle navigation
function handleNav() {
  const currentUrl = location.href

  // Only reload if URL actually changed
  if (currentUrl !== lastUrl) {
    console.log("Hypothesis: Navigation detected, reloading")
    lastUrl = currentUrl

    // Give the page a moment to settle, then reload Hypothesis
    setTimeout(loadHypothesis, 500)
  }
}

// Initial load
loadHypothesis()

// Listen for Quartz's nav event
document.addEventListener("nav", handleNav)
