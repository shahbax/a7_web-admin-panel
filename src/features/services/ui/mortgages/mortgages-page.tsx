import {
  MarketingBenefitsGridSection,
  MarketingHeroSection,
  MarketingImageTextSection,
  MarketingServicesSplitSection,
  ServiceMarketingPageLayout,
} from "@/shared/ui/marketing"
import type { SectionLayout } from "@/features/cms/site-content/core/types"
import type { MortgagesPageContent } from "@/features/services/services/content"

export type MortgagesPageProps = {
  content: MortgagesPageContent
  layout?: SectionLayout
}

export function MortgagesPage({ content, layout }: MortgagesPageProps) {
  return (
    <ServiceMarketingPageLayout
      layout={layout}
      hero={<MarketingHeroSection {...content.hero} />}
      intro={<MarketingServicesSplitSection {...content.ourServices} />}
      grid={
        <MarketingBenefitsGridSection
          title={content.whyWork.title}
          subtitle={content.whyWork.subtitle}
          benefits={content.whyWork.benefits}
          headingId="mortgages-why-work-heading"
        />
      }
      afterGrid={<MarketingImageTextSection {...content.whyA7} />}
      testimonialsSectionProps={content.testimonials}
      faqSectionProps={content.faq}
      contactSectionProps={content.contact}
      newsletterProps={content.newsletter}
    />
  )
}
