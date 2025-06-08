const DEFAULT_LANG = "ko";

function applyLanguage(lang: string) {
  document.querySelectorAll<HTMLElement>("[data-lang]").forEach((el) => {
    const langs = (el.getAttribute("data-lang") || DEFAULT_LANG).split(",");
    if (langs.includes(lang)) {
      el.classList.remove("lang-hidden");
    } else {
      el.classList.add("lang-hidden");
    }
  });
}

document.addEventListener("nav", () => {
  const selector = document.getElementById("language-select") as HTMLSelectElement | null;
  if (!selector) return;
  const stored = localStorage.getItem("language") || DEFAULT_LANG;
  selector.value = stored;
  applyLanguage(stored);

  const onChange = () => {
    const lang = selector.value;
    localStorage.setItem("language", lang);
    applyLanguage(lang);
  };
  selector.addEventListener("change", onChange);
  window.addCleanup(() => selector.removeEventListener("change", onChange));
});
