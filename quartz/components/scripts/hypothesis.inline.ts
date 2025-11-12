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

  // Wait a moment for new content to render
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    // Method 1: Dispatch standard DOM events
    console.log("→ Hypothesis: Dispatching DOM events...")
    window.dispatchEvent(new Event("hashchange"))
    window.dispatchEvent(new Event("popstate"))
    document.dispatchEvent(new Event("DOMContentLoaded"))

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

    // Method 3: Trigger Hypothesis-specific events
    if (window.hypothesisEmbed) {
      console.log("→ Hypothesis: Triggering hypothesisReady event...")
      window.dispatchEvent(new Event("hypothesisReady"))
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
