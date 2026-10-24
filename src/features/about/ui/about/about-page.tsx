import {
  MarketingBreadcrumbsBand,
  MarketingCtaBannerSection,
  MarketingHeroSection,
  ServiceMarketingPageLayout,
} from "@/shared/ui/marketing"
import type { SectionLayout } from "@/features/cms/site-content/core/types"
import { ABOUT_BREADCRUMBS } from "@/features/about/services/content"
import type { AboutContent } from "@/features/about/services/about-content"

import { AboutStatsShowcaseSection } from "./about-stats-showcase-section"
import { AboutStoryGoalsSection } from "./about-story-goals-section"
import { AboutTrustSection } from "./about-trust-section"

export function AboutPage({ content, layout }: { content: AboutContent; layout?: SectionLayout }) {
  return (
    <ServiceMarketingPageLayout
      layout={layout}
      hero={<MarketingHeroSection {...content.hero} />}
      intro={
        <>
          <MarketingBreadcrumbsBand items={ABOUT_BREADCRUMBS} />
          <AboutTrustSection {...content.trust} breadcrumbs={undefined} className="pt-6 md:pt-8" />
        </>
      }
      grid={
        <>
          <AboutStoryGoalsSection {...content.storyGoals} />
          <MarketingCtaBannerSection {...content.ctaBanner} />
        </>
      }
      afterGrid={<AboutStatsShowcaseSection {...content.statsShowcase} />}
      testimonialsSectionProps={content.testimonials}
      faqSectionProps={content.faq}
      contactSectionProps={content.contact}
      newsletterProps={content.newsletter}
    />
  )
}
