import type {
  ContentDefinition,
  ListContentDefinition,
  SingleContentDefinition,
} from "@/features/cms/site-content/core/types"
import { MARKETING_ICON_HINT } from "@/features/cms/site-content/core/hints"
import {
  CAREER_GALLERY_IMAGES,
  CAREER_OPENINGS,
  CAREER_PAGE_DESCRIPTION,
  CAREER_PAGE_TITLE,
  careerGrowthSectionProps,
  careerHeroProps,
  careerIntroSectionProps,
  careerMidCtaBannerProps,
  careerNewsletterProps,
  careerTeamSectionProps,
  careerWhyChooseSectionProps,
  getCareerJobById,
  type CareerJobDetail,
  type CareerOpening,
} from "@/features/career/content/career-page-content"
import { careerDetailPath, careerPath } from "@/shared/lib/constants/routes"

// ----------------------------------------------------------------------------
// Dataset: one item per job opening (list row + detail page)
// ----------------------------------------------------------------------------

export type CareerJobItem = CareerJobDetail & {
  seo: { title: string; description: string }
}

export function getCareerJobItemsDefaults(): CareerJobItem[] {
  return CAREER_OPENINGS.map((opening) => {
    const job = getCareerJobById(opening.id)
    if (!job) throw new Error(`Missing career job detail for "${opening.id}"`)
    return {
      ...job,
      seo: { title: `${job.title} | A Seven Properties`, description: job.introParagraphs[0] ?? "" },
    }
  })
}

/** Row on the /career "open roles" list, derived from a job item. */
export function toCareerOpening(job: CareerJobItem): CareerOpening {
  return { id: job.id, title: job.title, location: job.location, href: careerDetailPath(job.id) }
}

// ----------------------------------------------------------------------------
// Single: the /career page's own texts
// ----------------------------------------------------------------------------

const IMAGE_POSITION_HINT = {
  type: "select" as const,
  label: "Image position",
  options: [
    { value: "left", label: "Left" },
    { value: "right", label: "Right" },
  ],
}

export function getCareerPageDefaults() {
  return {
    seo: { title: `${CAREER_PAGE_TITLE} | A Seven Properties`, description: CAREER_PAGE_DESCRIPTION },
    hero: careerHeroProps,
    intro: careerIntroSectionProps,
    gallery: [...CAREER_GALLERY_IMAGES] as string[],
    whyChoose: careerWhyChooseSectionProps,
    team: careerTeamSectionProps,
    midCta: careerMidCtaBannerProps,
    growth: careerGrowthSectionProps,
    openings: {
      title: "Find the right job for you",
      buttonLabel: "View Job Details",
      footerLead: "Nothing quite right for you?",
      footerText:
        "Experience stress-free property management with confidence. Our experienced team handles everything.",
    },
    newsletter: careerNewsletterProps,
  }
}

export type CareerPageContent = ReturnType<typeof getCareerPageDefaults>

export const careerContentDefinitions: ContentDefinition[] = [
  {
    key: "dataset.careers",
    kind: "list",
    label: "Career openings",
    group: "Directories",
    description: "Open roles on /career and each job's detail page.",
    previewPath: careerPath(),
    defaults: getCareerJobItemsDefaults,
    idField: "id",
    titleField: "title",
    itemPath: (id: string) => careerDetailPath(id),
    hints: {
      breadcrumbsLabel: { label: "Breadcrumb label" },
      introParagraphs: { label: "Intro paragraphs" },
      summaryParagraphs: { label: "Summary paragraphs" },
      sections: { label: "Detail sections" },
      manager: { label: "Hiring manager" },
      seo: { label: "Search engine (SEO)" },
    },
  } satisfies ListContentDefinition<CareerJobItem>,
  {
    key: "page.career",
    kind: "single",
    label: "Career page",
    group: "Directories",
    previewPath: careerPath(),
    defaults: getCareerPageDefaults,
    sections: [
      { key: "hero", label: "Hero" },
      { key: "intro", label: "Intro" },
      { key: "gallery", label: "Gallery" },
      { key: "whyChoose", label: "Why choose us" },
      { key: "team", label: "Team" },
      { key: "midCta", label: "Contact banner" },
      { key: "growth", label: "Growth" },
      { key: "openings", label: "Open roles" },
      { key: "newsletter", label: "Newsletter" },
    ],
    hints: {
      seo: { label: "Search engine (SEO)" },
      gallery: { label: "Gallery images" },
      icon: MARKETING_ICON_HINT,
      imagePosition: IMAGE_POSITION_HINT,
      columns: { type: "hidden" },
      openings: { label: "Open roles", help: "the list of jobs is edited under Career openings" },
    },
  } satisfies SingleContentDefinition<CareerPageContent>,
]
