import type { ProjectOverviewBlock, ProjectFaqItem, PropertyListing } from "@/features/property"
import { ProjectOverviewSection } from "@/features/project/ui/projects/project-overview-section"
import {
  HomeDeveloperCtaNewsletter,
  type HomeDeveloperCtaNewsletterProps,
} from "@/shared/ui/marketing/home-developer-cta-newsletter"
import { HomeFaqSection } from "@/shared/ui/marketing/home-faq-section"
import { renderSections } from "@/features/cms/site-content/core/sections"
import type { SectionLayout } from "@/features/cms/site-content/core/types"
import type { PropertyListingLocationLink } from "@/features/property/services/content"

import { PropertyListingDiscoverSection } from "./property-listing-discover-section"
import { PropertyListingResults } from "./property-listing-results"
import { PropertyListingSearchHero } from "./property-listing-search-hero"

/** Default section order (used when no CMS layout is passed). */
const DEFAULT_LAYOUT: SectionLayout = {
  order: ["hero", "discover", "results", "seoSections", "faq", "developerCta"],
  hidden: [],
}

export type PropertyListingPageProps = {
  listings: PropertyListing[]
  pageTitle: string
  faqTitle: string
  faqItems: readonly ProjectFaqItem[]
  seoSections: readonly ProjectOverviewBlock[]
  developerCta: HomeDeveloperCtaNewsletterProps
  heroImageUrl: string
  locationLinks?: readonly PropertyListingLocationLink[]
  areaPills?: readonly string[]
  /** Admin-chosen section order / visibility. */
  layout?: SectionLayout
}

export function PropertyListingPage({
  listings,
  pageTitle,
  faqTitle,
  faqItems,
  seoSections,
  developerCta,
  heroImageUrl,
  locationLinks,
  areaPills,
  layout = DEFAULT_LAYOUT,
}: PropertyListingPageProps) {
  return (
    <>
      {renderSections(layout, {
        hero: <PropertyListingSearchHero heroImageUrl={heroImageUrl} />,
        discover: <PropertyListingDiscoverSection locationLinks={locationLinks} areaPills={areaPills} />,
        results: <PropertyListingResults listings={listings} title={pageTitle} />,
        seoSections: <ProjectOverviewSection sections={[...seoSections]} className="border-t border-border" />,
        faq: <HomeFaqSection title={faqTitle} items={faqItems} />,
        developerCta: <HomeDeveloperCtaNewsletter {...developerCta} />,
      })}
    </>
  )
}
