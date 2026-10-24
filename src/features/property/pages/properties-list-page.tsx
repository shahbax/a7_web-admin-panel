import type { Metadata } from "next"

import { PropertyListingPage } from "@/features/property/ui/property-list/property-listing-page"
import { fetchPropertyListings } from "@/features/property"
import { loadPropertiesPageContent } from "@/features/property/services/properties-page-content"
import { loadDeveloperCtaContent } from "@/features/home/services/shared-cta-content"

export async function generatePropertiesListMetadata(): Promise<Metadata> {
  const { content } = await loadPropertiesPageContent()
  return { title: content.seo.title, description: content.seo.description }
}

export async function PropertiesListPage() {
  const [listings, { content, layout }, developerCta] = await Promise.all([
    fetchPropertyListings(),
    loadPropertiesPageContent(),
    loadDeveloperCtaContent(),
  ])

  return (
    <main>
      <PropertyListingPage
        listings={listings}
        pageTitle={content.results.title}
        faqTitle={content.faq.title}
        faqItems={content.faq.items}
        seoSections={content.seoSections}
        developerCta={developerCta.home}
        heroImageUrl={content.hero.imageUrl}
        locationLinks={content.discover.locationLinks}
        areaPills={content.discover.areaPills}
        layout={layout}
      />
    </main>
  )
}
