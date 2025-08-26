const getCusdisThread = (): HTMLElement | null => {
  const element = document.getElementById("cusdis_thread")
  console.log("Cusdis thread element:", element)
  return element
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
      console.log("Cusdis script already loaded")
      resolve()
      return
    }

    const host = (getCusdisThread()?.getAttribute("data-host") || "https://cusdis.com").replace(/\/$/, "")
    console.log("Loading Cusdis from host:", host)

    const es = document.createElement("script")
    es.src = `${host}/js/cusdis.es.js`
    es.type = "module"
    es.async = true
    es.setAttribute("data-cusdis", "true")

    es.onload = () => {
      console.log("Cusdis script loaded successfully")
      resolve()
    }
    es.onerror = (error) => {
      console.error("Failed to load Cusdis script:", error)
      resolve()
    }
    document.head.appendChild(es)
  })
}

const renderCusdis = () => {
  const container = getCusdisThread()
  if (!container) {
    console.log("Cusdis container not found")
    return
  }
  
  console.log("Rendering Cusdis, container:", container)
  console.log("Container attributes:", {
    host: container.getAttribute("data-host"),
    appId: container.getAttribute("data-app-id"),
    lang: container.getAttribute("data-lang"),
    theme: container.getAttribute("data-theme")
  })
  
  // For SPA rerenders, clear previous iframe if any so widget remounts
  while (container.firstChild) container.removeChild(container.firstChild)
  
  const w = window as any
  console.log("CUSDIS object:", w.CUSDIS)
  
  if (w.CUSDIS && typeof w.CUSDIS.renderTo === "function") {
    try {
      console.log("Calling CUSDIS.renderTo")
      w.CUSDIS.renderTo(container)
    } catch (error) {
      console.error("Error calling CUSDIS.renderTo:", error)
    }
  } else {
    console.log("CUSDIS.renderTo not available, trying alternative methods")
    // Try alternative rendering methods
    if (w.CUSDIS && typeof w.CUSDIS.init === "function") {
      try {
        console.log("Calling CUSDIS.init")
        w.CUSDIS.init()
      } catch (error) {
        console.error("Error calling CUSDIS.init:", error)
      }
    }
  }
}

document.addEventListener("nav", async () => {
  console.log("Navigation event triggered")
  const container = getCusdisThread()
  if (!container) {
    console.log("No Cusdis container found on navigation")
    return
  }
  console.log("Found Cusdis container, ensuring scripts...")
  await ensureCusdisScripts()
  console.log("Scripts ensured, rendering Cusdis...")
  renderCusdis()
})

document.addEventListener("themechange", onThemeChange)
if (typeof window.addCleanup === "function") {
  window.addCleanup(() => document.removeEventListener("themechange", onThemeChange))
}
