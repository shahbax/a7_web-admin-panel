import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/shared/lib/site-url"
import { getSettings } from "@/features/cms/settings/service"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = getSiteUrl()
  const { seo } = await getSettings()

  if (!seo.indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] }
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
  }
}
