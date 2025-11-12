// Hypothesis initialization and SPA handler
// Dynamically loads embed.js after content is ready

let lastUrl = location.href
let hypothesisInitialized = false
let hypothesisScriptLoaded = false

// Load Hypothesis embed.js dynamically
function loadHypothesisScript() {
  if (hypothesisScriptLoaded) return Promise.resolve()

  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://hypothes.is/embed.js"
    script.async = false // Load synchronously to ensure proper initialization
    script.onload = () => {
      hypothesisScriptLoaded = true
      console.log("✓ Hypothesis script loaded")
      resolve(true)
    }
    script.onerror = () => {
      console.error("✗ Failed to load Hypothesis script")
      resolve(false)
    }
    document.head.appendChild(script)
  })
}

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

    // Ensure Hypothesis is loaded and ready
    if (!hypothesisScriptLoaded) {
      await loadHypothesisScript()
    }

    if (!hypothesisInitialized) {
      await ensureHypothesisReady()
    }

    // Wait for new content, then refresh
    setTimeout(refreshHypothesis, 500)
  }
}

// Initialize on page load - CRITICAL for first page load
// Load Hypothesis script after DOM is ready
async function initializeHypothesis() {
  console.log("→ Initializing Hypothesis...")

  // Load the script first
  await loadHypothesisScript()

  // Then wait for it to initialize
  await ensureHypothesisReady()

  console.log("✓ Hypothesis fully initialized and ready")
}

// Start initialization
initializeHypothesis()

// Listen for Quartz navigation
document.addEventListener("nav", handleNavigation)
