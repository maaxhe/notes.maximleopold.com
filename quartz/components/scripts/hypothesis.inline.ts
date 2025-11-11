// Hypothesis initialization and SPA handler
// CRITICAL: Ensures Hypothesis is fully ready on first page load

let lastUrl = location.href
let hypothesisInitialized = false

// Wait until Hypothesis is fully loaded and initialized
function ensureHypothesisReady() {
  return new Promise((resolve) => {
    // Check if Hypothesis is already loaded
    if (
      window.hypothesisEmbed ||
      document.querySelector("hypothesis-sidebar") ||
      document.querySelector(".hypothesis-sidebar")
    ) {
      hypothesisInitialized = true
      console.log("✓ Hypothesis ready on first load")
      resolve(true)
      return
    }

    // Poll until Hypothesis is ready (max 20 seconds)
    let attempts = 0
    const maxAttempts = 200 // 20 seconds with 100ms intervals

    const checkInterval = setInterval(() => {
      attempts++

      if (
        window.hypothesisEmbed ||
        document.querySelector("hypothesis-sidebar") ||
        document.querySelector(".hypothesis-sidebar")
      ) {
        clearInterval(checkInterval)
        hypothesisInitialized = true
        console.log(`✓ Hypothesis ready after ${attempts * 100}ms`)
        resolve(true)
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval)
        console.error("✗ Hypothesis failed to load after 20 seconds")
        resolve(false)
      }
    }, 100)
  })
}

// Trigger Hypothesis to re-scan page content
function refreshHypothesis() {
  if (!hypothesisInitialized) return

  setTimeout(() => {
    if (window.hypothesisEmbed) {
      window.dispatchEvent(new Event("hypothesisReady"))
      document.dispatchEvent(new Event("DOMContentLoaded"))
    }
  }, 300)
}

// Handle Quartz SPA navigation
async function handleNavigation() {
  const currentUrl = location.href

  if (currentUrl !== lastUrl) {
    console.log("→ Navigation detected")
    lastUrl = currentUrl

    // Ensure Hypothesis is ready before refreshing
    if (!hypothesisInitialized) {
      await ensureHypothesisReady()
    }

    // Wait for new content, then refresh
    setTimeout(refreshHypothesis, 500)
  }
}

// Initialize on page load - CRITICAL for first page load
ensureHypothesisReady()

// Listen for Quartz navigation
document.addEventListener("nav", handleNavigation)
