import "server-only"

import { isReservedSlug } from "@/features/cms/pages/core/entity"
import {
  slugExists,
} from "@/features/cms/pages/core/page.repository"

export {
  listPages,
  getPageById,
  getPageBySlug,
  getPublishedPage,
  getDraftPage,
  getAllPublishedSlugs,
  createPage,
  updatePageDraft,
  publishPage,
  unpublishPage,
  deletePage,
  listPageVersions,
  restorePageVersion,
} from "@/features/cms/pages/core/page.repository"

export type { PageVersionSummary } from "@/features/cms/pages/core/page.repository"

export async function isReservedSlugOrExists(slug: string): Promise<boolean> {
  if (isReservedSlug(slug)) return true
  return slugExists(slug)
}
