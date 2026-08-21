// Light/dark theme toggle, persisted in localStorage.

const STORAGE_KEY = "tripdrop-theme";

export function initTheme() {
  document.querySelector("#theme-toggle").addEventListener("click", () => {
    const isLight = document.documentElement.dataset.theme === "light";
    setTheme(isLight ? "dark" : "light");
  });
}

function setTheme(theme) {
  if (theme === "light") {
    document.documentElement.dataset.theme = "light";
  } else {
    delete document.documentElement.dataset.theme;
  }
  localStorage.setItem(STORAGE_KEY, theme);
}
