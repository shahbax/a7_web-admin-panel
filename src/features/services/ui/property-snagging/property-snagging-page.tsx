import {
  MarketingGlassServicesSection,
  MarketingHeroSection,
  MarketingImageTextSection,
  MarketingStepCardsSection,
  ServiceMarketingPageLayout,
} from "@/shared/ui/marketing"
import type { SectionLayout } from "@/features/cms/site-content/core/types"
import type { PropertySnaggingPageContent } from "@/features/services/services/content"

export type PropertySnaggingPageProps = {
  content: PropertySnaggingPageContent
  layout?: SectionLayout
}

export function PropertySnaggingPage({ content, layout }: PropertySnaggingPageProps) {
  return (
    <ServiceMarketingPageLayout
      layout={layout}
      hero={<MarketingHeroSection {...content.hero} />}
      intro={<MarketingImageTextSection {...content.intro} />}
      grid={<MarketingGlassServicesSection {...content.glassServices} />}
      afterGrid={<MarketingStepCardsSection {...content.stepCards} />}
      testimonialsSectionProps={content.testimonials}
      faqSectionProps={content.faq}
      contactSectionProps={content.contact}
      newsletterProps={content.newsletter}
    />
  )
}
