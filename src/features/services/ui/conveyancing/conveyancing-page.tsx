import {
  MarketingBenefitsGridSection,
  MarketingHeroSection,
  MarketingImageTextSection,
  MarketingSolutionsChecklistSection,
  ServiceMarketingPageLayout,
} from "@/shared/ui/marketing"
import type { SectionLayout } from "@/features/cms/site-content/core/types"
import type { ConveyancingPageContent } from "@/features/services/services/content"

export type ConveyancingPageProps = {
  content: ConveyancingPageContent
  layout?: SectionLayout
}

export function ConveyancingPage({ content, layout }: ConveyancingPageProps) {
  return (
    <ServiceMarketingPageLayout
      layout={layout}
      hero={<MarketingHeroSection {...content.hero} />}
      intro={<MarketingImageTextSection {...content.about} />}
      grid={
        <MarketingBenefitsGridSection
          title={content.prism.title}
          subtitle={content.prism.subtitle}
          benefits={content.prism.benefits}
          columns={4}
          headingId="conveyancing-prism-heading"
        />
      }
      afterGrid={<MarketingSolutionsChecklistSection {...content.solutions} />}
      testimonialsSectionProps={content.testimonials}
      faqSectionProps={content.faq}
      contactSectionProps={content.contact}
      newsletterProps={content.newsletter}
    />
  )
}
