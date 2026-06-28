// Tiny wrappers around localStorage so the app's data survives a refresh.
// (Works when you run the project locally with `npm run dev`.)

export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore write errors (e.g. storage full or disabled).
  }
}
