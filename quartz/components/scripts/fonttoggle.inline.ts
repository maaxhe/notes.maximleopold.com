const savedFont = localStorage.getItem("font") ?? "default"
document.documentElement.setAttribute("font-mode", savedFont)

document.addEventListener("nav", () => {
  const updateButtons = (mode: string) => {
    for (const btn of document.getElementsByClassName("fonttoggle")) {
      btn.setAttribute("aria-pressed", mode === "cm" ? "true" : "false")
    }
  }

  const switchFont = () => {
    const current = document.documentElement.getAttribute("font-mode")
    const next = current === "cm" ? "default" : "cm"
    document.documentElement.setAttribute("font-mode", next)
    localStorage.setItem("font", next)
    updateButtons(next)
  }

  updateButtons(document.documentElement.getAttribute("font-mode") ?? "default")

  for (const btn of document.getElementsByClassName("fonttoggle")) {
    btn.addEventListener("click", switchFont)
    window.addCleanup(() => btn.removeEventListener("click", switchFont))
  }
})
