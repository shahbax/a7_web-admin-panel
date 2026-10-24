import {
  MarketingHeroSection,
  MarketingWhyChooseSection,
  ServiceMarketingPageLayout,
} from "@/shared/ui/marketing"
import type { SectionLayout } from "@/features/cms/site-content/core/types"
import type { PropertyManagementPageContent } from "@/features/services/services/content"

import { PropertyManagementFeaturesSection } from "./property-management-features-section"
import { PropertyManagementIntroSection } from "./property-management-intro-section"

export type PropertyManagementPageProps = {
  content: PropertyManagementPageContent
  layout?: SectionLayout
}

export function PropertyManagementPage({ content, layout }: PropertyManagementPageProps) {
  return (
    <ServiceMarketingPageLayout
      layout={layout}
      hero={<MarketingHeroSection {...content.hero} />}
      intro={<PropertyManagementIntroSection intro={content.intro} />}
      grid={<PropertyManagementFeaturesSection features={content.features} />}
      afterGrid={<MarketingWhyChooseSection {...content.why} />}
      testimonialsSectionProps={content.testimonials}
      faqSectionProps={content.faq}
      contactSectionProps={content.contact}
      newsletterProps={content.newsletter}
    />
  )
}
