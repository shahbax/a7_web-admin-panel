import type { ReactNode } from "react"

import { HomeDeveloperCtaNewsletter } from "@/shared/ui/marketing/home-developer-cta-newsletter"
import { ProjectOverviewSection } from "@/features/project/ui/projects/project-overview-section"
import { homeDeveloperCtaContent } from "@/features/developer/content/developer-cta-content"
import type { ProjectOverviewBlock } from "@/features/property"
import { renderSections } from "@/features/cms/site-content/core/sections"
import type { ContentSection, SectionLayout } from "@/features/cms/site-content/core/types"

import {
  MarketingContactSection,
  type MarketingContactSectionProps,
} from "./marketing-contact-section"
import { MarketingFaqSection, type MarketingFaqSectionProps } from "./marketing-faq-section"
import {
  MarketingTestimonialsSection,
  type MarketingTestimonialsSectionProps,
} from "./marketing-testimonials-section"

export type ServiceMarketingPageLayoutProps = {
  hero: ReactNode
  intro?: ReactNode
  grid: ReactNode
  /** Rendered after the grid and before the overview section. */
  afterGrid?: ReactNode
  overviewSections?: readonly ProjectOverviewBlock[]
  testimonialsSectionProps: MarketingTestimonialsSectionProps
  faqSectionProps: MarketingFaqSectionProps
  contactSectionProps: MarketingContactSectionProps
  /** Developer CTA + newsletter band at the bottom (defaults to the home copy). */
  newsletterProps?: typeof homeDeveloperCtaContent
  /** Admin-chosen section order/visibility; omit for the default order. */
  layout?: SectionLayout
}

/** Sections of every page built on this layout, in their default order. */
export const SERVICE_MARKETING_SECTIONS: ContentSection[] = [
  { key: "hero", label: "Hero banner" },
  { key: "intro", label: "Intro" },
  { key: "grid", label: "Main content" },
  { key: "afterGrid", label: "Highlights" },
  { key: "overview", label: "Overview" },
  { key: "testimonials", label: "Testimonials" },
  { key: "faq", label: "FAQ" },
  { key: "contact", label: "Contact form" },
  { key: "newsletter", label: "Developer prices & newsletter" },
]

const DEFAULT_LAYOUT: SectionLayout = {
  order: SERVICE_MARKETING_SECTIONS.map((s) => s.key),
  hidden: [],
}

/** Shared full-width marketing page shell used by Services and service detail pages. */
export function ServiceMarketingPageLayout({
  hero,
  intro,
  grid,
  afterGrid,
  overviewSections,
  testimonialsSectionProps,
  faqSectionProps,
  contactSectionProps,
  newsletterProps = homeDeveloperCtaContent,
  layout = DEFAULT_LAYOUT,
}: ServiceMarketingPageLayoutProps) {
  return (
    <>
      {renderSections(layout, {
        hero,
        intro: intro ?? null,
        grid,
        afterGrid,
        overview:
          overviewSections && overviewSections.length > 0 ? (
            <ProjectOverviewSection sections={[...overviewSections]} className="border-t border-border" />
          ) : null,
        testimonials: <MarketingTestimonialsSection {...testimonialsSectionProps} />,
        faq: <MarketingFaqSection {...faqSectionProps} />,
        contact: <MarketingContactSection {...contactSectionProps} />,
        newsletter: <HomeDeveloperCtaNewsletter {...newsletterProps} />,
      })}
    </>
  )
}
