// Hypothesis SPA navigation handler
// Ensures Hypothesis works on FIRST page load and after SPA navigation

let lastUrl = location.href

// Trigger Hypothesis to re-scan the page
function triggerHypothesisRefresh() {
  // Hypothesis watches for these events to re-scan content
  if (window.hypothesisEmbed) {
    setTimeout(() => {
      window.dispatchEvent(new Event("hypothesisReady"))
      document.dispatchEvent(new Event("DOMContentLoaded"))
    }, 200)
  }
}

// Handle Quartz SPA navigation
function handleNavigation() {
  const currentUrl = location.href

  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl
    // Wait for new content to load, then trigger Hypothesis refresh
    setTimeout(triggerHypothesisRefresh, 400)
  }
}

// Listen for Quartz's navigation event
document.addEventListener("nav", handleNavigation)
