import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/shared/lib/site-url"
import { getAllPublishedSlugs } from "@/features/cms/pages/services/page-service"

const STATIC_ROUTES = [
  "",
  "about",
  "properties",
  "agents",
  "areas",
  "developers",
  "events",
  "career",
  "services",
  "sell-property",
  "services/conveyancing",
  "services/list-your-property",
  "services/mortgages",
  "services/plots",
  "services/property-management",
  "services/property-snagging",
  "services/short-term-rentals",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl()
  const now = new Date()

  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${site}/${path}`.replace(/\/$/, "") || site,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }))

  let cmsEntries: MetadataRoute.Sitemap = []
  try {
    const slugs = await getAllPublishedSlugs()
    cmsEntries = slugs.map((slug) => ({
      url: `${site}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  } catch {
    // DB unavailable at build — ship the static map.
  }

  return [...staticEntries, ...cmsEntries]
}
