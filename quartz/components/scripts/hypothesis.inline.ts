// Hypothesis SPA navigation handler
// embed.js is loaded via <script defer> in Head.tsx

let lastUrl = location.href

// Force Hypothesis to re-scan page content after SPA navigation
function notifyHypothesis() {
  // Wait for new content to fully render
  setTimeout(() => {
    if (window.hypothesisEmbed) {
      console.log("→ Hypothesis: Triggering refresh for new content")

      // Method 1: Dispatch multiple events
      window.dispatchEvent(new Event("hypothesisReady"))
      document.dispatchEvent(new Event("DOMContentLoaded"))

      // Method 2: Try to access the Hypothesis API directly if available
      if (window.hypothesis && window.hypothesis.guest) {
        try {
          // Force Hypothesis to rescan the page
          window.hypothesis.guest.anchor()
        } catch (e) {
          console.log("→ Hypothesis: Direct API not available, using events")
        }
      }
    } else {
      console.warn("⚠ Hypothesis not loaded yet")
    }
  }, 300) // Increased timeout to ensure content is rendered
}

// Handle Quartz SPA navigation
function handleNavigation() {
  const currentUrl = location.href

  if (currentUrl !== lastUrl) {
    console.log("→ Hypothesis: Navigation detected", currentUrl)
    lastUrl = currentUrl
    notifyHypothesis()
  }
}

// Listen for Quartz navigation events
document.addEventListener("nav", handleNavigation)

console.log("✓ Hypothesis SPA handler ready")
