import type { Block } from "@/features/cms/blocks/types"

export type PageStatus = "DRAFT" | "PUBLISHED"

export type PageSummary = {
  id: string
  slug: string
  title: string
  template: string
  status: PageStatus
  isSystem: boolean
  updatedAt: string
  publishedAt: string | null
}

export type PageDetail = PageSummary & {
  seoTitle: string | null
  seoDescription: string | null
  ogImageUrl: string | null
  draft: Block[]
  published: Block[] | null
}

export type PublishedPage = {
  title: string
  slug: string
  blocks: Block[]
  seoTitle: string | null
  seoDescription: string | null
  ogImageUrl: string | null
}

// First-segment slugs that collide with coded routes or reserved areas.
export const RESERVED_SLUGS = new Set([
  "",
  "admin",
  "api",
  "uploads",
  "news",
  "properties",
  "agents",
  "areas",
  "developers",
  "events",
  "career",
  "services",
  "about",
  "sell-property",
  "off-plan",
  "projects",
  "search",
  "components",
  "icons",
  "welcome",
  "login",
  "register",
  "dashboard",
])

export function isReservedSlug(slug: string): boolean {
  const first = slug.split("/")[0] ?? ""
  return RESERVED_SLUGS.has(first)
}

export function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9/-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/\/+/g, "/")
    .replace(/(^-|-$)/g, "")
}
