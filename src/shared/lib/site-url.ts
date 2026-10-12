/** Canonical public origin, used for sitemap, robots, canonical URLs and JSON-LD. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.AUTH_URL ||
    "https://a7grouprealestate.com"
  return raw.replace(/\/+$/, "")
}
