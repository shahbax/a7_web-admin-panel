import { HomeDeveloperCtaNewsletter } from "@/shared/ui/marketing/home-developer-cta-newsletter"
import { renderSections } from "@/features/cms/site-content/core/sections"
import type { SectionLayout } from "@/features/cms/site-content/core/types"
import {
  AREAS_PAGE_BREADCRUMBS,
  filterAreasByCategory,
  type DubaiAreaListing,
} from "@/features/area/services/content"
import type { AreaItem, AreasPageContent } from "@/features/area/services/area-content"
import type { BreadcrumbItem } from "@/shared/ui/breadcrumb"

import { AreasListingContent } from "./areas-listing-content"
import { AreasPageHeaderSection } from "./areas-page-header-section"
import { AreasSearchHero } from "./areas-search-hero"

type AreasPageProps = {
  content: AreasPageContent
  layout: SectionLayout
  areas: AreaItem[]
}

/** Only the fields the list cards render (keeps the client payload small). */
function toCard(area: AreaItem): DubaiAreaListing {
  return {
    id: area.id,
    title: area.title,
    description: area.description,
    imageUrls: area.imageUrls,
    thumbnails: area.thumbnails,
    pricePerSqft: area.pricePerSqft,
    propertyTypeStats: area.propertyTypeStats,
    rentAmount: area.rentAmount,
    saleAmount: area.saleAmount,
    categories: area.categories,
    propertiesAreaSlug: area.propertiesAreaSlug,
  }
}

export function AreasPage({ content, layout, areas }: AreasPageProps) {
  const cards = filterAreasByCategory(areas.map(toCard), "popular")
  const breadcrumbs: BreadcrumbItem[] = AREAS_PAGE_BREADCRUMBS.map((item) =>
    item.kind === "current" ? { ...item, label: content.header.title } : item
  )

  return (
    <>
      {renderSections(layout, {
        searchHero: <AreasSearchHero imageUrl={content.searchHero.imageUrl} />,
        header: (
          <AreasPageHeaderSection
            breadcrumbs={breadcrumbs}
            title={content.header.title}
            description={content.header.description}
          />
        ),
        listing: <AreasListingContent areas={cards} categories={content.categories} />,
        newsletter: <HomeDeveloperCtaNewsletter {...content.newsletter} />,
      })}
    </>
  )
}
