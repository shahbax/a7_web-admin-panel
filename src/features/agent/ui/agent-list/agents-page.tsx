import { HomeDeveloperCtaNewsletter } from "@/shared/ui/marketing/home-developer-cta-newsletter"
import { ProjectOverviewSection } from "@/features/project/ui/projects/project-overview-section"
import { renderSections } from "@/features/cms/site-content/core/sections"
import type { SectionLayout } from "@/features/cms/site-content/core/types"
import type { RealEstateAgentProfile } from "@/features/agent/core/domain/entity/agent.entity"
import type { ProjectOverviewBlock } from "@/features/property"
import type { BreadcrumbItem } from "@/shared/ui/breadcrumb"
import type { HomeDeveloperCtaNewsletterProps } from "@/shared/ui/marketing/home-developer-cta-newsletter"

import { AgentsListingShell } from "./agents-listing-shell"
import { AgentsSearchHero } from "./agents-search-hero"

export type AgentsPageProps = {
  agents: RealEstateAgentProfile[]
  breadcrumbs: BreadcrumbItem[]
  seoSections: ProjectOverviewBlock[]
  developerCta: HomeDeveloperCtaNewsletterProps
  title?: string
  searchHeroImageUrl?: string
  layout?: SectionLayout
}

const DEFAULT_LAYOUT: SectionLayout = {
  order: ["searchHero", "listing", "seoSections", "newsletter"],
  hidden: [],
}

export function AgentsPage({
  agents,
  breadcrumbs,
  seoSections,
  developerCta,
  title,
  searchHeroImageUrl,
  layout = DEFAULT_LAYOUT,
}: AgentsPageProps) {
  return (
    <>
      {renderSections(layout, {
        searchHero: <AgentsSearchHero imageUrl={searchHeroImageUrl} />,
        listing: <AgentsListingShell agents={agents} breadcrumbs={breadcrumbs} title={title} />,
        seoSections: <ProjectOverviewSection sections={seoSections} className="border-t border-border" />,
        newsletter: <HomeDeveloperCtaNewsletter {...developerCta} />,
      })}
    </>
  )
}
