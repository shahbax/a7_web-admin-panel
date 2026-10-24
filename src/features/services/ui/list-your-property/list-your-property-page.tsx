import {
  MarketingHeroSection,
  MarketingHowItWorksSection,
  MarketingWhyChooseSection,
  ServiceMarketingPageLayout,
} from "@/shared/ui/marketing"
import type { SectionLayout } from "@/features/cms/site-content/core/types"
import type { ListYourPropertyPageContent } from "@/features/services/services/content"

export type ListYourPropertyPageProps = {
  content: ListYourPropertyPageContent
  layout?: SectionLayout
}

export function ListYourPropertyPage({ content, layout }: ListYourPropertyPageProps) {
  return (
    <ServiceMarketingPageLayout
      layout={layout}
      hero={<MarketingHeroSection {...content.hero} />}
      grid={
        <>
          <MarketingWhyChooseSection {...content.why} />
          <MarketingHowItWorksSection
            title={content.howItWorks.title}
            subtitle={content.howItWorks.subtitle}
            steps={content.howItWorks.steps}
            headingId="list-your-property-how-heading"
          />
        </>
      }
      testimonialsSectionProps={content.testimonials}
      faqSectionProps={content.faq}
      contactSectionProps={content.contact}
      newsletterProps={content.newsletter}
    />
  )
}
