import type {
  ContentDefinition,
  ListContentDefinition,
  SingleContentDefinition,
} from "@/features/cms/site-content/core/types"
import { homeDeveloperCtaContent } from "@/features/developer/content/developer-cta-content"
import {
  DEVELOPERS_PAGE_FAQ_ITEMS,
  DEVELOPERS_PAGE_FAQ_TITLE,
  DEVELOPERS_PAGE_INTRO,
  DEVELOPERS_PAGE_SEO_SECTIONS,
  DEVELOPERS_PAGE_TITLE,
  DUBAI_DEVELOPERS,
  type DubaiDeveloperProfile,
} from "@/features/developer/content/developers-page-content"
import {
  getDeveloperById,
  type DeveloperDetail,
} from "@/features/developer/content/developer-detail-content"
import { developerDetailPath, developersPath } from "@/shared/lib/constants/routes"

// ----------------------------------------------------------------------------
// Dataset: one item per developer (list card + detail page)
// ----------------------------------------------------------------------------

/**
 * One developer in the CMS. `learnMoreHref` is derived from the id (so new
 * items link to their own page); off-plan project cards stay in code.
 */
export type DeveloperItem = Omit<DeveloperDetail, "learnMoreHref" | "logoSrc" | "intro"> & {
  /** Empty = show the developer name instead of a logo. */
  logoSrc: string
  intro: string[]
  seo: { title: string; description: string }
}

function buildDeveloperItem(profile: DubaiDeveloperProfile): DeveloperItem {
  const detail = getDeveloperById(profile.id)
  if (!detail) throw new Error(`Missing developer detail for "${profile.id}"`)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- derived from the id
  const { learnMoreHref: _learnMoreHref, ...rest } = detail
  return {
    ...rest,
    logoSrc: detail.logoSrc ?? "",
    intro: [...detail.intro],
    seo: { title: `${detail.pageTitle} | A Seven Properties`, description: detail.intro[0] ?? "" },
  }
}

export function getDeveloperItemsDefaults(): DeveloperItem[] {
  return DUBAI_DEVELOPERS.map(buildDeveloperItem)
}

/** Detail/card shape used by the existing components. */
export function toDeveloperDetail(item: DeveloperItem): DeveloperDetail & DeveloperItem {
  return { ...item, learnMoreHref: developerDetailPath(item.id) }
}

// ----------------------------------------------------------------------------
// Single: the /developers list page's own texts
// ----------------------------------------------------------------------------

export function getDevelopersPageDefaults() {
  return {
    seo: { title: `${DEVELOPERS_PAGE_TITLE} | A Seven Properties`, description: DEVELOPERS_PAGE_INTRO[0] },
    header: { title: DEVELOPERS_PAGE_TITLE, intro: [...DEVELOPERS_PAGE_INTRO] },
    seoSections: DEVELOPERS_PAGE_SEO_SECTIONS,
    faq: { title: DEVELOPERS_PAGE_FAQ_TITLE, items: DEVELOPERS_PAGE_FAQ_ITEMS },
    newsletter: homeDeveloperCtaContent,
  }
}

export type DevelopersPageContent = ReturnType<typeof getDevelopersPageDefaults>

export const developerContentDefinitions: ContentDefinition[] = [
  {
    key: "dataset.developers",
    kind: "list",
    label: "Developers",
    group: "Directories",
    description: "Developer cards on /developers and each developer's detail page.",
    previewPath: developersPath(),
    defaults: getDeveloperItemsDefaults,
    idField: "id",
    titleField: "name",
    itemPath: (id: string) => developerDetailPath(id),
    hints: {
      logoSrc: { label: "Logo", type: "image", help: "leave empty to show the name instead" },
      description: { label: "Card description", type: "textarea" },
      pageTitle: { label: "Detail page heading" },
      intro: { label: "Detail intro paragraphs" },
      heroBackgroundUrl: { label: "Detail hero background", type: "image" },
      searchPlaceholder: { label: "Search placeholder" },
      seoSections: { label: "Overview blocks" },
      faqTitle: { label: "FAQ heading" },
      faq: { label: "FAQ" },
      seo: { label: "Search engine (SEO)" },
    },
  } satisfies ListContentDefinition<DeveloperItem>,
  {
    key: "page.developers",
    kind: "single",
    label: "Developers page",
    group: "Directories",
    previewPath: developersPath(),
    defaults: getDevelopersPageDefaults,
    sections: [
      { key: "header", label: "Heading" },
      { key: "results", label: "Developer cards" },
      { key: "overview", label: "Overview blocks" },
      { key: "faq", label: "FAQ" },
      { key: "newsletter", label: "Newsletter" },
    ],
    hints: {
      seo: { label: "Search engine (SEO)" },
      seoSections: { label: "Overview blocks" },
    },
  } satisfies SingleContentDefinition<DevelopersPageContent>,
]
