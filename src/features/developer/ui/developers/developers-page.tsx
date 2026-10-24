import { HomeDeveloperCtaNewsletter } from "@/shared/ui/marketing/home-developer-cta-newsletter"
import { ProjectOverviewSection } from "@/features/project/ui/projects/project-overview-section"
import { renderSections } from "@/features/cms/site-content/core/sections"
import type { SectionLayout } from "@/features/cms/site-content/core/types"
import {
  DEVELOPERS_PAGE_BREADCRUMBS,
  type DubaiDeveloperProfile,
} from "@/features/developer/services/content"
import type { DevelopersPageContent } from "@/features/developer/services/developer-content"

import { DevelopersFaqSection } from "./developers-faq-section"
import { DevelopersPageHeaderSection } from "./developers-page-header-section"
import { DevelopersResultsSection } from "./developers-results-section"

type DevelopersPageProps = {
  content: DevelopersPageContent
  layout: SectionLayout
  developers: DubaiDeveloperProfile[]
}

/** Only the fields the cards render (keeps the client payload small). */
function toCard(developer: DubaiDeveloperProfile): DubaiDeveloperProfile {
  return {
    id: developer.id,
    name: developer.name,
    foundedYear: developer.foundedYear,
    logoSrc: developer.logoSrc,
    description: developer.description,
    learnMoreHref: developer.learnMoreHref,
  }
}

export function DevelopersPage({ content, layout, developers }: DevelopersPageProps) {
  return (
    <>
      {renderSections(layout, {
        header: (
          <DevelopersPageHeaderSection
            breadcrumbs={DEVELOPERS_PAGE_BREADCRUMBS}
            title={content.header.title}
            intro={content.header.intro}
          />
        ),
        results: <DevelopersResultsSection developers={developers.map(toCard)} />,
        overview: <ProjectOverviewSection sections={content.seoSections} className="border-t border-border" />,
        faq: <DevelopersFaqSection title={content.faq.title} items={content.faq.items} />,
        newsletter: <HomeDeveloperCtaNewsletter {...content.newsletter} />,
      })}
    </>
  )
}
