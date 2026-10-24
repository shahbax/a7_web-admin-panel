import type { SingleContentDefinition } from "@/features/cms/site-content/core/types"
import {
  PROPERTY_LISTING_AREA_PILLS,
  PROPERTY_LISTING_FAQ_ITEMS,
  PROPERTY_LISTING_LOCATION_LINKS,
  PROPERTY_LISTING_PAGE_DESCRIPTION,
  PROPERTY_LISTING_PAGE_TITLE,
  PROPERTY_LISTING_SEARCH_HERO_IMAGE,
  PROPERTY_LISTING_SEO_SECTIONS,
} from "@/features/property/content/property-listing-page-content"

/**
 * Page-level texts of /properties. The listings themselves (and the search
 * filters) are not part of this: they come from the property feed.
 * The bottom newsletter band is the shared "shared.developerCta".
 */
export function getPropertiesPageDefaults() {
  return {
    seo: {
      title: `${PROPERTY_LISTING_PAGE_TITLE} | A Seven Properties`,
      description: PROPERTY_LISTING_PAGE_DESCRIPTION,
    },
    hero: { imageUrl: PROPERTY_LISTING_SEARCH_HERO_IMAGE },
    discover: {
      locationLinks: PROPERTY_LISTING_LOCATION_LINKS.map((l) => ({ ...l })),
      areaPills: [...PROPERTY_LISTING_AREA_PILLS] as string[],
    },
    results: { title: PROPERTY_LISTING_PAGE_TITLE },
    seoSections: PROPERTY_LISTING_SEO_SECTIONS.map((b) => ({ ...b })),
    faq: {
      title: `${PROPERTY_LISTING_PAGE_TITLE} — FAQs`,
      items: PROPERTY_LISTING_FAQ_ITEMS.map((f) => ({ ...f })),
    },
  }
}

export type PropertiesPageContent = ReturnType<typeof getPropertiesPageDefaults>

export const PROPERTIES_PAGE_SECTIONS = [
  { key: "hero", label: "Search hero" },
  { key: "discover", label: "Locations & popular areas" },
  { key: "results", label: "Listings" },
  { key: "seoSections", label: "SEO text blocks" },
  { key: "faq", label: "FAQ" },
  { key: "developerCta", label: "Developer prices & newsletter band" },
]

export const propertiesPageContentDefinitions = [
  {
    key: "page.properties",
    kind: "single",
    label: "Properties (list page)",
    group: "Pages",
    description:
      "Texts around the property listings. Listings come from the property feed; the bottom newsletter band is under Shared.",
    previewPath: "/properties",
    defaults: getPropertiesPageDefaults,
    sections: PROPERTIES_PAGE_SECTIONS,
    hints: {
      seo: { label: "Search engine (SEO)" },
      "hero.imageUrl": { label: "Search background image", type: "image" },
      "discover.locationLinks": { label: "Locations" },
      "discover.locationLinks[].count": { label: "Listing count shown", type: "number" },
      "discover.areaPills": { label: "Popular areas" },
      "results.title": { label: "Listings heading" },
      seoSections: { label: "SEO text blocks" },
      "seoSections[].description": { type: "textarea" },
      "faq.items[].title": { label: "Question" },
      "faq.items[].content": { label: "Answer", type: "textarea" },
    },
  } satisfies SingleContentDefinition<PropertiesPageContent>,
]
