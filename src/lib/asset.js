// Public-folder assets are referenced with hardcoded root-relative paths (e.g. "/gallery/x.png")
// throughout the app. That breaks when the site is deployed under a subpath (GitHub Pages project
// sites serve from "/<repo-name>/", not "/"). This resolves them against Vite's configured base
// so the same code works locally (base "/") and on a subpath deployment.
export function asset(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
