import { ServiceMarketingPageLayout } from "@/shared/ui/marketing/service-marketing-page-layout"
import type { SectionLayout } from "@/features/cms/site-content/core/types"
import type { ServicesPageContent } from "@/features/services/services/content"

import { ServicesGridSection } from "./services-grid-section"
import { ServicesHeroSection } from "./services-hero-section"
import { ServicesIntroSection } from "./services-intro-section"

export type ServicesPageProps = {
  content: ServicesPageContent
  layout?: SectionLayout
}

export function ServicesPage({ content, layout }: ServicesPageProps) {
  return (
    <ServiceMarketingPageLayout
      layout={layout}
      hero={<ServicesHeroSection hero={content.hero} />}
      intro={<ServicesIntroSection intro={content.intro} />}
      grid={<ServicesGridSection heading={content.grid.heading} offerings={content.grid.offerings} />}
      overviewSections={content.overview}
      testimonialsSectionProps={content.testimonials}
      faqSectionProps={content.faq}
      contactSectionProps={content.contact}
      newsletterProps={content.newsletter}
    />
  )
}
