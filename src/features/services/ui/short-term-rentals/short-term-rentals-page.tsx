import {
  MarketingBenefitsGridSection,
  MarketingCtaBannerSection,
  MarketingHeroSection,
  MarketingImageGalleryTextSection,
  MarketingImageTextSection,
  MarketingSolutionsChecklistSection,
  ServiceMarketingPageLayout,
} from "@/shared/ui/marketing"
import type { SectionLayout } from "@/features/cms/site-content/core/types"
import type { ShortTermRentalsPageContent } from "@/features/services/services/content"

export type ShortTermRentalsPageProps = {
  content: ShortTermRentalsPageContent
  layout?: SectionLayout
}

export function ShortTermRentalsPage({ content, layout }: ShortTermRentalsPageProps) {
  return (
    <ServiceMarketingPageLayout
      layout={layout}
      hero={<MarketingHeroSection {...content.hero} />}
      intro={<MarketingImageGalleryTextSection {...content.guest} />}
      grid={
        <MarketingBenefitsGridSection
          title={content.why.title}
          benefits={content.why.benefits}
          columns={3}
          headingId="short-term-rentals-why-heading"
        />
      }
      afterGrid={
        <>
          <MarketingImageTextSection {...content.transform} />
          <MarketingCtaBannerSection {...content.journeyBanner} />
          <MarketingSolutionsChecklistSection {...content.services} />
        </>
      }
      testimonialsSectionProps={content.testimonials}
      faqSectionProps={content.faq}
      contactSectionProps={content.contact}
      newsletterProps={content.newsletter}
    />
  )
}
