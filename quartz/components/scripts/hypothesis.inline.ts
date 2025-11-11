// Hypothesis SPA navigation handler
// This ensures Hypothesis works immediately on every page load

let hypothesisLoaded = false
let lastUrl = location.href

// Function to trigger Hypothesis to check for annotations
function refreshHypothesis() {
  if (!window.hypothesisEmbed) {
    console.log('Hypothesis not loaded yet, waiting...')
    // Wait for Hypothesis to load
    setTimeout(refreshHypothesis, 100)
    return
  }

  console.log('Hypothesis: Refreshing annotations for new page')

  // Method 1: Use Hypothesis's internal API if available
  if (window.hypothesisConfig) {
    // Trigger a re-check by dispatching events Hypothesis listens to
    window.dispatchEvent(new Event('load'))
    window.dispatchEvent(new Event('DOMContentLoaded'))
  }

  // Method 2: Force Hypothesis to re-scan the page
  // Remove and re-add the hypothesisConfig to trigger a reload
  const oldConfig = window.hypothesisConfig
  setTimeout(() => {
    window.hypothesisConfig = oldConfig

    // Hypothesis listens for this event to know when to rescan
    const event = new Event('hypothesisConfigChanged')
    window.dispatchEvent(event)
  }, 50)

  hypothesisLoaded = true
}

// Wait for Hypothesis to be ready
function waitForHypothesis() {
  return new Promise((resolve) => {
    if (window.hypothesisEmbed) {
      resolve(true)
      return
    }

    const checkInterval = setInterval(() => {
      if (window.hypothesisEmbed) {
        clearInterval(checkInterval)
        resolve(true)
      }
    }, 50)

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval)
      resolve(false)
    }, 10000)
  })
}

// Handle navigation
async function handleNav() {
  const currentUrl = location.href

  // Only act if URL actually changed or initial load
  if (currentUrl !== lastUrl || !hypothesisLoaded) {
    console.log('Hypothesis: Page navigation detected')
    lastUrl = currentUrl

    // Wait for Hypothesis to be ready
    await waitForHypothesis()

    // Small delay to let the page content load
    setTimeout(refreshHypothesis, 200)
  }
}

// Listen for Quartz's nav event (fires on every page navigation including initial load)
document.addEventListener('nav', handleNav)
