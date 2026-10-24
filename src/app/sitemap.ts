import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/shared/lib/site-url"
import { getAllPublishedSlugs } from "@/features/cms/pages/services/page-service"
import { getContentItemIds } from "@/features/cms/site-content/service"
import { listNewsArticles } from "@/features/news/services/news"

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
  "news",
]

/** Directory datasets and the URL prefix of their detail pages. */
const DATASET_ROUTES: [key: string, prefix: string][] = [
  ["dataset.areas", "areas"],
  ["dataset.developers", "developers"],
  ["dataset.events", "events"],
  ["dataset.careers", "career"],
  ["dataset.agents", "agents"],
  ["dataset.offPlanProjects", "off-plan"],
  ["dataset.projects", "projects"],
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

  const detailPaths: string[] = []
  for (const [key, prefix] of DATASET_ROUTES) {
    try {
      for (const id of await getContentItemIds(key)) detailPaths.push(`${prefix}/${id}`)
    } catch {
      // Unknown key or DB unavailable — skip this directory.
    }
  }
  for (const article of await listNewsArticles()) detailPaths.push(`news/${article.slug}`)
  const detailEntries = detailPaths.map((path) => ({
    url: `${site}/${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }))

  return [...staticEntries, ...detailEntries, ...cmsEntries]
}
