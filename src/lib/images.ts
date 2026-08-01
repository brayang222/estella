const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

/**
 * Resolves a relative image path (as stored in the DB, e.g. "/products/x.webp")
 * against the configured image host. Empty NEXT_PUBLIC_IMAGE_BASE_URL means
 * "serve from this project's /public folder" (the local dev default); point
 * it at a CDN/storage domain later and every stored path keeps working as-is.
 * Paths that are already absolute URLs pass through unchanged.
 */
export function imageUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//.test(path)) return path;
  return `${IMAGE_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
