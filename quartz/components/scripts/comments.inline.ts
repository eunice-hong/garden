const getCusdisThread = (): HTMLElement | null => {
  return document.getElementById("cusdis_thread")
}

const applyCusdisTheme = (theme: string) => {
  const container = getCusdisThread()
  if (!container) return
  const mapped = theme === "dark" ? "dark" : theme === "light" ? "light" : "auto"
  container.setAttribute("data-theme", mapped)
  // If the widget has been mounted, try to call setTheme if exposed
  const w = window as any
  if (w.CUSDIS && typeof w.CUSDIS.setTheme === "function") {
    try {
      w.CUSDIS.setTheme(mapped)
    } catch {}
  }
}

const onThemeChange = (e: CustomEventMap["themechange"]) => {
  const theme = e.detail.theme
  applyCusdisTheme(theme)
}

const ensureCusdisScripts = (): Promise<void> => {
  return new Promise((resolve) => {
    const existing = document.querySelector('script[data-cusdis="true"]') as HTMLScriptElement | null
    if (existing) {
      resolve()
      return
    }

    const host = (getCusdisThread()?.getAttribute("data-host") || "https://cusdis.com").replace(/\/$/, "")

    const es = document.createElement("script")
    es.src = `${host}/js/cusdis.es.js`
    es.type = "module"
    es.async = true
    es.setAttribute("data-cusdis", "true")

    es.onload = () => resolve()
    es.onerror = () => resolve()
    document.head.appendChild(es)
  })
}

const renderCusdis = () => {
  const container = getCusdisThread()
  if (!container) return
  
  // For SPA rerenders, clear previous iframe if any so widget remounts
  while (container.firstChild) container.removeChild(container.firstChild)
  
  const w = window as any
  if (w.CUSDIS && typeof w.CUSDIS.renderTo === "function") {
    try {
      w.CUSDIS.renderTo(container)
    } catch (error) {
      // Silently handle rendering errors
    }
  }
}

document.addEventListener("nav", async () => {
  const container = getCusdisThread()
  if (!container) return
  await ensureCusdisScripts()
  renderCusdis()
})

document.addEventListener("themechange", onThemeChange)
if (typeof window.addCleanup === "function") {
  window.addCleanup(() => document.removeEventListener("themechange", onThemeChange))
}
