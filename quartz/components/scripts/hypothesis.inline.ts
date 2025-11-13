// Hypothesis SPA navigation handler
// Notifies Hypothesis of new page content without full reload

let lastUrl = location.href
let isReloading = false

// Notify Hypothesis of new page content (without full reload)
async function notifyHypothesis() {
  if (isReloading) {
    console.log("⏳ Hypothesis: Already processing, skipping...")
    return
  }

  isReloading = true
  console.log("→ Hypothesis: Notifying of new page content...")

  // Wait longer for content to fully render and Hypothesis to be ready
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Method 1: If Hypothesis guest API is available, destroy and recreate
    if (window.hypothesis && window.hypothesis.destroy) {
      console.log("→ Hypothesis: Destroying old instance...")
      try {
        await window.hypothesis.destroy()
      } catch (e) {
        console.log("→ Hypothesis: Destroy failed (expected):", e)
      }
    }

    // Reload the Hypothesis client if available
    if (window.hypothesisConfig) {
      console.log("→ Hypothesis: Triggering reload...")

      // Remove old iframe if exists
      const oldFrame = document.querySelector('iframe[name="hyp-sidebar"]')
      if (oldFrame) {
        oldFrame.remove()
      }

      // Dispatch events to notify Hypothesis
      window.dispatchEvent(new Event("hashchange"))
      window.dispatchEvent(new Event("popstate"))

      // Wait a bit more for Hypothesis to reinitialize
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Method 2: If Hypothesis guest API is available, use it
    if (window.hypothesis && window.hypothesis.guest) {
      console.log("→ Hypothesis: Calling guest.anchor()...")
      try {
        await window.hypothesis.guest.anchor()
        console.log("✓ Hypothesis: Guest API called successfully")
      } catch (e) {
        console.log("→ Hypothesis: Guest API not ready:", e)
      }
    }

    console.log("✓ Hypothesis: Notification complete")
  } catch (e) {
    console.error("✗ Hypothesis: Error during notification:", e)
  } finally {
    isReloading = false
  }
}

// Handle Quartz SPA navigation
function handleNavigation(e) {
  const currentUrl = location.href

  if (currentUrl !== lastUrl) {
    console.log("→ Hypothesis: Navigation detected", currentUrl)
    console.log("→ Hypothesis: Event details:", e)
    lastUrl = currentUrl
    notifyHypothesis()
  }
}

// Listen for Quartz navigation events
document.addEventListener("nav", handleNavigation)

console.log("✓ Hypothesis SPA handler ready")
