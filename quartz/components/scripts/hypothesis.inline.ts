// Hypothesis SPA navigation handler
// Ensures annotations work on first load AND after navigation

let lastUrl = location.href
let hypothesisReady = false

// Wait for Hypothesis to fully load
function waitForHypothesis() {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.hypothesisEmbed || document.querySelector("hypothesis-sidebar")) {
      hypothesisReady = true
      resolve(true)
      return
    }

    // Poll for Hypothesis to be ready
    const checkInterval = setInterval(() => {
      if (window.hypothesisEmbed || document.querySelector("hypothesis-sidebar")) {
        clearInterval(checkInterval)
        hypothesisReady = true
        console.log("✓ Hypothesis loaded and ready")
        resolve(true)
      }
    }, 50)

    // Timeout after 15 seconds
    setTimeout(() => {
      clearInterval(checkInterval)
      if (!hypothesisReady) {
        console.warn("⚠ Hypothesis failed to load")
      }
      resolve(false)
    }, 15000)
  })
}

// Trigger Hypothesis to scan the page for annotations
function refreshHypothesis() {
  if (!hypothesisReady) return

  // Trigger events that make Hypothesis re-scan the page
  setTimeout(() => {
    window.dispatchEvent(new Event("hypothesisReady"))
    document.dispatchEvent(new Event("DOMContentLoaded"))
  }, 100)
}

// Handle navigation between pages
async function handleNav() {
  const currentUrl = location.href

  if (currentUrl !== lastUrl) {
    console.log("→ Page changed, refreshing Hypothesis")
    lastUrl = currentUrl

    if (!hypothesisReady) {
      await waitForHypothesis()
    }

    // Give the page content time to load, then refresh
    setTimeout(refreshHypothesis, 500)
  }
}

// Initialize on first load
waitForHypothesis().then(() => {
  console.log("✓ Hypothesis initialized for first page load")
})

// Listen for Quartz SPA navigation
document.addEventListener("nav", handleNav)
