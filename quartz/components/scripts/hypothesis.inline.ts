// Hypothesis SPA navigation handler
// Completely reloads Hypothesis after navigation to ensure annotations work

let lastUrl = location.href
let isReloading = false

// Wait for Hypothesis to be fully loaded and ready
function waitForHypothesis() {
  return new Promise((resolve) => {
    let attempts = 0
    const maxAttempts = 50 // 5 seconds max

    const checkInterval = setInterval(() => {
      attempts++

      // Check if Hypothesis sidebar exists and is fully initialized
      const sidebar = document.querySelector("hypothesis-sidebar")
      const hasEmbed = window.hypothesisEmbed

      if ((sidebar || hasEmbed) && window.hypothesis) {
        clearInterval(checkInterval)
        console.log(`✓ Hypothesis: Ready after ${attempts * 100}ms`)
        resolve(true)
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval)
        console.warn("⚠ Hypothesis: Timeout waiting for initialization")
        resolve(false)
      }
    }, 100)
  })
}

// Completely reload Hypothesis after SPA navigation
async function reloadHypothesis() {
  if (isReloading) {
    console.log("⏳ Hypothesis: Already reloading, skipping...")
    return
  }

  isReloading = true
  console.log("→ Hypothesis: Reloading for new page...")

  // Step 1: Destroy existing Hypothesis instance
  try {
    // Remove all Hypothesis elements
    const hypothesisElements = document.querySelectorAll(
      'hypothesis-sidebar, hypothesis-notebook, link[href*="hypothes.is"], script[src*="hypothes.is"]',
    )
    hypothesisElements.forEach((el) => el.remove())

    // Clear Hypothesis from window
    delete window.hypothesisEmbed
    delete window.hypothesis

    console.log("→ Hypothesis: Destroyed old instance")
  } catch (e) {
    console.warn("⚠ Hypothesis: Error destroying instance:", e)
  }

  // Step 2: Wait for DOM to settle
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Step 3: Reload embed.js
  console.log("→ Hypothesis: Loading new instance...")

  const script = document.createElement("script")
  script.src = `https://hypothes.is/embed.js?t=${Date.now()}`
  script.async = false // Load synchronously for reliable initialization

  script.onload = async () => {
    console.log("→ Hypothesis: Script loaded, waiting for initialization...")
    // Wait for Hypothesis to be fully ready
    await waitForHypothesis()
    isReloading = false
  }

  script.onerror = () => {
    console.error("✗ Hypothesis: Failed to reload")
    isReloading = false
  }

  document.head.appendChild(script)
}

// Handle Quartz SPA navigation
function handleNavigation(e) {
  const currentUrl = location.href

  if (currentUrl !== lastUrl) {
    console.log("→ Hypothesis: Navigation detected", currentUrl)
    console.log("→ Hypothesis: Event details:", e)
    lastUrl = currentUrl
    reloadHypothesis()
  }
}

// Listen for Quartz navigation events
document.addEventListener("nav", handleNavigation)

console.log("✓ Hypothesis SPA handler ready")
