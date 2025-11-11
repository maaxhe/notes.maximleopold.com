// Hypothesis SPA navigation handler
// Smart approach: Only reload when safe, don't interrupt user interaction

let lastUrl = location.href
let hypothesisLoaded = false
let isUserInteracting = false
let interactionTimeout = null

// Check if user is currently interacting with Hypothesis
function checkInteraction() {
  // Check if annotation adder is visible
  const adder = document.querySelector("hypothesis-adder")
  const sidebar = document.querySelector("hypothesis-sidebar")
  const isSidebarOpen = sidebar?.classList.contains("is-open")

  isUserInteracting = !!adder || isSidebarOpen

  if (isUserInteracting) {
    console.log("Hypothesis: User is interacting, delaying reload")
    // Reset timeout
    clearTimeout(interactionTimeout)
    interactionTimeout = setTimeout(() => {
      isUserInteracting = false
    }, 5000) // Consider user done after 5 seconds of no new interactions
  }

  return isUserInteracting
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
        hypothesisLoaded = true
        console.log("Hypothesis: Ready")
        resolve(true)
      }
    }, 100)

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval)
      resolve(false)
    }, 10000)
  })
}

// Trigger Hypothesis to refresh annotations (without full reload)
function refreshAnnotations() {
  console.log("Hypothesis: Refreshing annotations for new page")

  // Hypothesis listens to these events to refresh
  if (window.hypothesisEmbed) {
    // Dispatch events that Hypothesis monitors
    window.dispatchEvent(new Event("hypothesisLoad"))
    window.dispatchEvent(new Event("hypothesisReady"))

    // Give it a moment to process
    setTimeout(() => {
      // Force re-scan by triggering mutation observer
      const event = new Event("DOMContentLoaded")
      document.dispatchEvent(event)
    }, 100)
  }
}

// Handle navigation
async function handleNav() {
  const currentUrl = location.href

  // Only act if URL actually changed
  if (currentUrl !== lastUrl) {
    console.log("Hypothesis: Page navigation detected")
    lastUrl = currentUrl

    // Check if user is interacting
    if (checkInteraction()) {
      console.log("Hypothesis: Skipping refresh, user is interacting")
      // Try again in a moment
      setTimeout(handleNav, 2000)
      return
    }

    // Wait for Hypothesis to be ready
    if (!hypothesisLoaded) {
      await waitForHypothesis()
    }

    // Small delay to let the page content load
    setTimeout(refreshAnnotations, 300)
  }
}

// Monitor for user interactions
document.addEventListener(
  "mouseup",
  () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim().length > 0) {
      isUserInteracting = true
      clearTimeout(interactionTimeout)
      interactionTimeout = setTimeout(() => {
        isUserInteracting = false
      }, 3000)
    }
  },
  true,
)

// Initial load - wait for Hypothesis
waitForHypothesis()

// Listen for Quartz's nav event
document.addEventListener("nav", handleNav)
