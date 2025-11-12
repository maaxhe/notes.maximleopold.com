// Hypothesis SPA navigation handler
// Completely reloads Hypothesis after navigation to ensure annotations work

let lastUrl = location.href

// Completely reload Hypothesis after SPA navigation
function reloadHypothesis() {
  console.log("→ Hypothesis: Reloading for new page...")

  // Step 1: Destroy existing Hypothesis instance
  if (window.hypothesisEmbed) {
    try {
      // Remove all Hypothesis elements
      const hypothesisElements = document.querySelectorAll(
        'hypothesis-sidebar, hypothesis-notebook, link[href*="hypothes.is"], script[src*="hypothes.is"]'
      )
      hypothesisElements.forEach((el) => el.remove())

      // Clear Hypothesis from window
      delete window.hypothesisEmbed
      delete window.hypothesis

      console.log("→ Hypothesis: Destroyed old instance")
    } catch (e) {
      console.warn("⚠ Hypothesis: Error destroying instance:", e)
    }
  }

  // Step 2: Wait for DOM to settle, then reload
  setTimeout(() => {
    console.log("→ Hypothesis: Loading new instance...")

    // Reload embed.js with cache buster to force fresh load
    const script = document.createElement("script")
    script.src = `https://hypothes.is/embed.js?t=${Date.now()}`
    script.async = true

    script.onload = () => {
      console.log("✓ Hypothesis: Reloaded successfully")
    }

    script.onerror = () => {
      console.error("✗ Hypothesis: Failed to reload")
    }

    document.head.appendChild(script)
  }, 500) // Wait for content to fully render
}

// Handle Quartz SPA navigation
function handleNavigation() {
  const currentUrl = location.href

  if (currentUrl !== lastUrl) {
    console.log("→ Hypothesis: Navigation detected", currentUrl)
    lastUrl = currentUrl
    reloadHypothesis()
  }
}

// Listen for Quartz navigation events
document.addEventListener("nav", handleNavigation)

console.log("✓ Hypothesis SPA handler ready")
