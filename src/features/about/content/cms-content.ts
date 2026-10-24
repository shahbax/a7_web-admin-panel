import type { SingleContentDefinition } from "@/features/cms/site-content/core/types"
import { MARKETING_ICON_HINT } from "@/features/cms/site-content/core/hints"
import { SERVICE_MARKETING_SECTIONS } from "@/shared/ui/marketing/service-marketing-page-layout"
import { homeDeveloperCtaContent } from "@/features/developer/content/developer-cta-content"
import {
  ABOUT_PAGE_DESCRIPTION,
  ABOUT_PAGE_TITLE,
  aboutContactSectionProps,
  aboutCtaBannerProps,
  aboutFaqSectionProps,
  aboutHeroProps,
  aboutStatsShowcaseSectionProps,
  aboutStoryGoalsSectionProps,
  aboutTestimonialsSectionProps,
  aboutTrustSectionProps,
} from "@/features/about/content/about-page-content"

export function getAboutDefaults() {
  const { breadcrumbs: _breadcrumbs, ...trust } = aboutTrustSectionProps
  return {
    seo: { title: `${ABOUT_PAGE_TITLE} | A Seven Properties`, description: ABOUT_PAGE_DESCRIPTION },
    hero: aboutHeroProps,
    trust,
    storyGoals: aboutStoryGoalsSectionProps,
    ctaBanner: aboutCtaBannerProps,
    statsShowcase: aboutStatsShowcaseSectionProps,
    testimonials: aboutTestimonialsSectionProps,
    faq: aboutFaqSectionProps,
    contact: aboutContactSectionProps,
    newsletter: homeDeveloperCtaContent,
  }
}

export type AboutContent = ReturnType<typeof getAboutDefaults>

export const aboutContentDefinitions = [
  {
    key: "page.about",
    kind: "single",
    label: "About us",
    group: "Pages",
    previewPath: "/about",
    defaults: getAboutDefaults,
    sections: SERVICE_MARKETING_SECTIONS.filter((s) => s.key !== "overview"),
    hints: { icon: MARKETING_ICON_HINT, seo: { label: "Search engine (SEO)" } },
  } satisfies SingleContentDefinition<AboutContent>,
]
