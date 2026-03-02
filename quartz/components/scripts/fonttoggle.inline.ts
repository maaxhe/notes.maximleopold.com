const savedFont = localStorage.getItem("font") ?? "default"
document.documentElement.setAttribute("font-mode", savedFont)

document.addEventListener("nav", () => {
  const switchFont = () => {
    const current = document.documentElement.getAttribute("font-mode")
    const next = current === "cm" ? "default" : "cm"
    document.documentElement.setAttribute("font-mode", next)
    localStorage.setItem("font", next)
  }

  for (const btn of document.getElementsByClassName("fonttoggle")) {
    btn.addEventListener("click", switchFont)
    window.addCleanup(() => btn.removeEventListener("click", switchFont))
  }
})
