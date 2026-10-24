import type {
  ListContentDefinition,
  SingleContentDefinition,
} from "@/features/cms/site-content/core/types"
import { agentProfilePath } from "@/shared/lib/constants/routes"
import { homeDeveloperCtaContent } from "@/features/developer/content/developer-cta-content"
import { PROPERTY_LISTING_SEARCH_HERO_IMAGE } from "@/features/property/services/content"
import type { PropertyAgentSocialLink } from "@/features/property"
import type { AgentProfileStat } from "@/features/agent/core/domain/entity/agent.entity"
import {
  AGENTS_PAGE_SEO_SECTIONS,
  AGENTS_PAGE_TITLE,
  REAL_ESTATE_AGENTS,
} from "@/features/agent/content/agents-page-content"
import {
  getAgentProfileDetail,
  getAllAgentProfileIds,
} from "@/features/agent/content/agent-profile-content"
import {
  getAgentAreaExpertise,
  type AgentAreaCommunity,
} from "@/features/agent/content/agent-area-expertise"
import { AGENT_PROFILE_COPY } from "@/features/agent/content/agent-profile-copy"

// ----------------------------------------------------------------------------
// dataset.agents — one item per agent profile (/agents/[id])
// ----------------------------------------------------------------------------

export type AgentContentArea = {
  id: string
  label: string
  /** Route slug for `/areas/[id]`. */
  detailAreaId: string
  communities: AgentAreaCommunity[]
}

export type AgentContentItem = {
  id: string
  name: string
  subtitle: string
  roleBadge: string
  languages: string
  expertiseAreas: string[]
  imageUrl: string
  heroBackgroundUrl: string
  showRankMedal: boolean
  /** Listed on the /agents directory (home-carousel experts only have a profile). */
  showInDirectory: boolean
  phoneHref: string
  emailHref: string
  whatsAppHref: string
  rating: number
  activeProperties: number
  responseTimeLabel: string
  stats: AgentProfileStat[]
  aboutParagraphs: string[]
  policiesParagraphs: string[]
  socialLinks: PropertyAgentSocialLink[]
  areaExpertise: AgentContentArea[]
}

const DIRECTORY_IDS = new Set(REAL_ESTATE_AGENTS.map((a) => a.id))

export function getAgentItemsDefaults(): AgentContentItem[] {
  return getAllAgentProfileIds().flatMap((id) => {
    const agent = getAgentProfileDetail(id)
    if (!agent) return []
    const item: AgentContentItem = {
      id: agent.id,
      name: agent.name,
      subtitle: agent.subtitle,
      roleBadge: agent.roleBadge ?? "",
      languages: agent.languages,
      expertiseAreas: [...agent.expertiseAreas],
      imageUrl: agent.imageUrl,
      heroBackgroundUrl: agent.heroBackgroundUrl,
      showRankMedal: Boolean(agent.showRankMedal),
      showInDirectory: DIRECTORY_IDS.has(agent.id),
      phoneHref: agent.phoneHref,
      emailHref: agent.emailHref,
      whatsAppHref: agent.whatsAppHref,
      rating: agent.rating,
      activeProperties: agent.activeProperties,
      responseTimeLabel: agent.responseTimeLabel,
      stats: agent.stats.map((s) => ({ ...s })),
      aboutParagraphs: [...agent.aboutParagraphs],
      policiesParagraphs: [...agent.policiesParagraphs],
      socialLinks: agent.socialLinks.map((l) => ({ ...l })),
      areaExpertise: getAgentAreaExpertise(agent.id).map((area) => ({
        id: area.id,
        label: area.label,
        detailAreaId: area.detailAreaId ?? area.id,
        communities: area.communities,
      })),
    }
    return [item]
  })
}

// ----------------------------------------------------------------------------
// page.agents — /agents list page texts + shared profile copy
// ----------------------------------------------------------------------------

export function getAgentsPageDefaults() {
  return {
    seo: {
      title: `${AGENTS_PAGE_TITLE} | A Seven Properties`,
      description:
        "Browse top real estate agents in Dubai. Connect via WhatsApp, view profiles, and find advisors who speak your language.",
    },
    searchHero: { imageUrl: PROPERTY_LISTING_SEARCH_HERO_IMAGE },
    title: AGENTS_PAGE_TITLE,
    seoSections: AGENTS_PAGE_SEO_SECTIONS.map((s) => ({ ...s })),
    newsletter: { ...homeDeveloperCtaContent },
    profile: { ...AGENT_PROFILE_COPY },
  }
}

export type AgentsPageContent = ReturnType<typeof getAgentsPageDefaults>

const SOCIAL_PLATFORM_HINT = {
  type: "select" as const,
  label: "Platform",
  options: ["facebook", "linkedin", "instagram", "youtube", "x"].map((p) => ({
    value: p,
    label: p === "x" ? "X (Twitter)" : p.charAt(0).toUpperCase() + p.slice(1),
  })),
}

const STAT_ICON_HINT = {
  type: "select" as const,
  label: "Icon",
  options: [
    { value: "compass", label: "Percent / compass" },
    { value: "key", label: "Key" },
    { value: "thumbs", label: "Thumbs up" },
    { value: "diamond", label: "Diamond" },
  ],
}

export const agentContentDefinitions = [
  {
    key: "dataset.agents",
    kind: "list",
    label: "Agents",
    group: "Directories",
    description: "Agent profiles shown on /agents and /agents/[id]. Listings, off-plan and transactions tabs are not edited here.",
    defaults: getAgentItemsDefaults,
    idField: "id",
    titleField: "name",
    itemPath: (id: string) => agentProfilePath(id),
    hints: {
      id: { label: "URL id (slug)" },
      subtitle: { label: "Role / title" },
      roleBadge: { label: "Badge" },
      imageUrl: { label: "Photo", type: "image" },
      heroBackgroundUrl: { label: "Profile hero background", type: "image" },
      showRankMedal: { label: "Top-ranked medal" },
      showInDirectory: { label: "Show on the /agents list" },
      phoneHref: { label: "Phone link (tel:+971…)" },
      emailHref: { label: "Email link (mailto:…)" },
      whatsAppHref: { label: "WhatsApp link (https://wa.me/…)" },
      rating: { label: "Rating (0–5)" },
      expertiseAreas: { label: "Expertise areas (search filters)" },
      aboutParagraphs: { label: "About me" },
      policiesParagraphs: { label: "Policies" },
      "stats[].icon": STAT_ICON_HINT,
      "socialLinks[].platform": SOCIAL_PLATFORM_HINT,
      "areaExpertise[].detailAreaId": { label: "Area page slug (/areas/…)", type: "text" },
      "areaExpertise[].communities[].imageUrls": { label: "Images" },
    },
  } satisfies ListContentDefinition<AgentContentItem>,
  {
    key: "page.agents",
    kind: "single",
    label: "Agents list page",
    group: "Directories",
    previewPath: "/agents",
    defaults: getAgentsPageDefaults,
    sections: [
      { key: "searchHero", label: "Search hero" },
      { key: "listing", label: "Title, sort and agent grid" },
      { key: "seoSections", label: "SEO text blocks" },
      { key: "newsletter", label: "Newsletter banner" },
    ],
    hints: {
      seo: { label: "Search engine (SEO)" },
      title: { label: "Page heading" },
      "searchHero.imageUrl": { label: "Background image", type: "image" },
      newsletter: { label: "Newsletter banner (list and profile pages)" },
      profile: {
        label: "Agent profile texts",
        help: "Shared by every agent profile. {name} is replaced with the agent's name.",
      },
    },
  } satisfies SingleContentDefinition<AgentsPageContent>,
]
