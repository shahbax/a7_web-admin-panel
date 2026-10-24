import type {
  ContentDefinition,
  ListContentDefinition,
  SingleContentDefinition,
} from "@/features/cms/site-content/core/types"
import { homeDeveloperCtaContent } from "@/features/developer/content/developer-cta-content"
import {
  AREA_CATEGORIES,
  AREAS_PAGE_DESCRIPTION,
  AREAS_PAGE_TITLE,
  AREAS_SEARCH_HERO_IMAGE,
  DUBAI_AREA_LISTINGS,
  type DubaiAreaListing,
} from "@/features/area/content/areas-page-content"
import { getAreaDetail, type AreaDetailContent } from "@/features/area/content/area-detail-content"
import {
  buildAreaPropertyListings,
  type AreaPropertiesSectionData,
} from "@/features/area/content/area-detail-properties-data"
import { areaDetailPath, areasPath } from "@/shared/lib/constants/routes"

// ----------------------------------------------------------------------------
// Dataset: one item per area (list card + everything the detail page shows)
// ----------------------------------------------------------------------------

/**
 * One area in the CMS. Property listing cards are not part of it: they stay in
 * code (they will come from Bitrix) and are re-attached by `toAreaDetail`.
 */
export type AreaItem = DubaiAreaListing &
  Omit<AreaDetailContent, "propertiesSection"> & {
    propertiesSection: Omit<AreaPropertiesSectionData, "listings">
    seo: { title: string; description: string }
  }

function buildAreaItem(listing: DubaiAreaListing): AreaItem {
  const detail = getAreaDetail(listing.id)
  if (!detail) throw new Error(`Missing area detail for "${listing.id}"`)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- listing cards stay in code
  const { listings: _listings, ...propertiesSection } = detail.propertiesSection
  return {
    ...listing,
    ...detail,
    id: listing.id,
    title: listing.title,
    propertiesSection,
    seo: {
      title: `${listing.title} | Areas in Dubai | A Seven Properties`,
      description: `Explore ${listing.title} — location, amenities, property trends, schools, and live listings in Dubai.`,
    },
  }
}

export function getAreaItemsDefaults(): AreaItem[] {
  return DUBAI_AREA_LISTINGS.map(buildAreaItem)
}

/** Detail-page shape: the CMS item plus the listing cards kept in code. */
export function toAreaDetail(item: AreaItem): AreaDetailContent & AreaItem {
  return {
    ...item,
    propertiesSection: {
      ...item.propertiesSection,
      listings: buildAreaPropertyListings(item.title),
    },
  }
}

// ----------------------------------------------------------------------------
// Single: the /areas list page's own texts
// ----------------------------------------------------------------------------

export function getAreasPageDefaults() {
  return {
    seo: { title: `${AREAS_PAGE_TITLE} | A Seven Properties`, description: AREAS_PAGE_DESCRIPTION },
    searchHero: { imageUrl: AREAS_SEARCH_HERO_IMAGE },
    header: { title: AREAS_PAGE_TITLE, description: AREAS_PAGE_DESCRIPTION },
    categories: AREA_CATEGORIES.map((category) => ({ ...category })),
    newsletter: homeDeveloperCtaContent,
  }
}

export type AreasPageContent = ReturnType<typeof getAreasPageDefaults>

export const areaContentDefinitions: ContentDefinition[] = [
  {
    key: "dataset.areas",
    kind: "list",
    label: "Areas",
    group: "Directories",
    description: "Dubai areas: the /areas cards and each area's detail page.",
    previewPath: areasPath(),
    defaults: getAreaItemsDefaults,
    idField: "id",
    titleField: "title",
    itemPath: (id: string) => areaDetailPath(id),
    hints: {
      description: { label: "Card description", type: "textarea" },
      imageUrls: { label: "Card slider images" },
      thumbnails: { label: "Card thumbnails" },
      categories: {
        label: "Categories",
        help: `one of: ${AREA_CATEGORIES.map((c) => c.slug).join(", ")} ("popular" areas are listed first)`,
      },
      propertiesAreaSlug: { label: "Area name used in property search" },
      searchPlaceholder: { label: "Detail search placeholder" },
      heroBackgroundUrl: { label: "Detail hero background", type: "image" },
      galleryImages: { label: "Detail gallery images" },
      galleryPhotoCount: { label: "Gallery photo count" },
      aboutParagraphs: { label: "About paragraphs" },
      "location.mapEmbedUrl": { label: "Google Maps embed URL", type: "link" },
      seo: { label: "Search engine (SEO)" },
    },
  } satisfies ListContentDefinition<AreaItem>,
  {
    key: "page.areas",
    kind: "single",
    label: "Areas page",
    group: "Directories",
    previewPath: areasPath(),
    defaults: getAreasPageDefaults,
    sections: [
      { key: "searchHero", label: "Search hero" },
      { key: "header", label: "Heading" },
      { key: "listing", label: "Area cards" },
      { key: "newsletter", label: "Newsletter" },
    ],
    hints: {
      seo: { label: "Search engine (SEO)" },
      categories: { label: "Sidebar categories" },
      "categories[].slug": { type: "hidden" },
    },
  } satisfies SingleContentDefinition<AreasPageContent>,
]
