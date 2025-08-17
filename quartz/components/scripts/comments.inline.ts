const changeTheme = (e: CustomEventMap["themechange"]) => {
  const theme = e.detail.theme
  const commentboxContainer = document.querySelector(".commentbox") as HTMLElement
  if (!commentboxContainer) {
    return
  }

  // CommentBox.io automatically adapts to the current theme
  // No manual theme switching needed as it uses CSS variables
}

type CommentBoxElement = Omit<HTMLElement, "dataset"> & {
  dataset: DOMStringMap & {
    projectId: string
    tlcParam: string
    sortOrder: "best" | "newest" | "oldest"
    backgroundColor: string
    textColor: string
    subtextColor: string
  }
}

document.addEventListener("nav", () => {
  const commentboxContainer = document.querySelector(".commentbox")
  if (!commentboxContainer) {
    return
  }

  // Load CommentBox.io script
  const commentboxScript = document.createElement("script")
  commentboxScript.src = "https://unpkg.com/commentbox.io/dist/commentBox.min.js"
  commentboxScript.async = true
  commentboxScript.crossOrigin = "anonymous"
  commentboxScript.setAttribute("data-loading", "lazy")

  // Initialize CommentBox with project ID
  const projectId = commentboxContainer.dataset.projectId || "TODO"
  
  // Create options object for CommentBox
  const options: any = {
    className: 'commentbox',
    defaultBoxId: commentboxContainer.id || 'commentbox',
    tlcParam: commentboxContainer.dataset.tlcParam || 'tlc',
    sortOrder: commentboxContainer.dataset.sortOrder || 'best',
    backgroundColor: commentboxContainer.dataset.backgroundColor || null,
    textColor: commentboxContainer.dataset.textColor || null,
    subtextColor: commentboxContainer.dataset.subtextColor || null,
  }

  // Initialize CommentBox
  commentboxScript.onload = () => {
    if (typeof (window as any).commentBox === 'function') {
      (window as any).commentBox(projectId, options)
    }
  }

  document.head.appendChild(commentboxScript)

  document.addEventListener("themechange", changeTheme)
  window.addCleanup(() => document.removeEventListener("themechange", changeTheme))
})
