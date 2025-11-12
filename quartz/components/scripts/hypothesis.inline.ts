// Hypothesis SPA navigation handler
// embed.js is loaded via <script defer> in Head.tsx

let lastUrl = location.href

// Trigger Hypothesis to re-scan page content after SPA navigation
function notifyHypothesis() {
  // Wait a moment for new content to render
  setTimeout(() => {
    // Hypothesis automatically detects URL changes in modern browsers
    // But we can also dispatch events to ensure compatibility
    if (window.hypothesisEmbed) {
      // Signal that new content is available
      window.dispatchEvent(new Event("hypothesisReady"))
    }
  }, 100)
}

// Handle Quartz SPA navigation
function handleNavigation() {
  const currentUrl = location.href

  if (currentUrl !== lastUrl) {
    console.log("→ Hypothesis: Navigation detected")
    lastUrl = currentUrl
    notifyHypothesis()
  }
}

// Listen for Quartz navigation events
document.addEventListener("nav", handleNavigation)

console.log("✓ Hypothesis SPA handler ready")
