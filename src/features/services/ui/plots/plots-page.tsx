import {
  MarketingAudienceChecklistSection,
  MarketingBenefitsGridSection,
  MarketingBreadcrumbsBand,
  MarketingDualCtaImageTextSection,
  MarketingHeroSection,
  MarketingMarketInsightsSection,
  MarketingPlotsListingsSection,
  MarketingStepCardsSection,
  ServiceMarketingPageLayout,
} from "@/shared/ui/marketing"
import type { SectionLayout } from "@/features/cms/site-content/core/types"
import type { PlotsPageContent } from "@/features/services/services/content"

export type PlotsPageProps = {
  content: PlotsPageContent
  layout?: SectionLayout
}

export function PlotsPage({ content, layout }: PlotsPageProps) {
  return (
    <ServiceMarketingPageLayout
      layout={layout}
      hero={<MarketingHeroSection {...content.hero} />}
      intro={
        <>
          <MarketingBreadcrumbsBand items={content.breadcrumbs} />
          <MarketingBenefitsGridSection {...content.whyChoose} />
        </>
      }
      grid={<MarketingAudienceChecklistSection {...content.audience} />}
      afterGrid={
        <>
          <MarketingPlotsListingsSection {...content.listings} />
          <MarketingStepCardsSection {...content.howItWorks} />
          <MarketingMarketInsightsSection {...content.marketInsights} />
          <MarketingDualCtaImageTextSection {...content.legacy} />
        </>
      }
      testimonialsSectionProps={content.testimonials}
      faqSectionProps={content.faq}
      contactSectionProps={content.contact}
      newsletterProps={content.newsletter}
    />
  )
}
