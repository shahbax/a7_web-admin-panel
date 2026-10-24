import "server-only"

import {
  getContentItem,
  getContentItemIds,
  getContentList,
  getPageContent,
} from "@/features/cms/site-content/service"
import { agentProfilePath } from "@/shared/lib/constants/routes"
import type {
  AgentContentItem,
  AgentsPageContent,
} from "@/features/agent/content/cms-content"
import type {
  AgentProfileDetail,
  RealEstateAgentProfile,
} from "@/features/agent/core/domain/entity/agent.entity"
import type { AgentExpertiseArea } from "@/features/agent/content/agent-area-expertise"

export type { AgentContentItem, AgentsPageContent }

const AGENTS_KEY = "dataset.agents"
const AGENTS_PAGE_KEY = "page.agents"

function toAgentProfile(item: AgentContentItem): RealEstateAgentProfile {
  return {
    id: item.id,
    name: item.name,
    subtitle: item.subtitle,
    languages: item.languages,
    expertiseAreas: item.expertiseAreas,
    imageUrl: item.imageUrl,
    roleBadge: item.roleBadge || undefined,
    showRankMedal: item.showRankMedal,
    whatsAppHref: item.whatsAppHref,
    profileHref: agentProfilePath(item.id),
  }
}

function toAgentProfileDetail(item: AgentContentItem): AgentProfileDetail {
  return {
    ...toAgentProfile(item),
    rating: item.rating,
    activeProperties: item.activeProperties,
    responseTimeLabel: item.responseTimeLabel,
    phoneHref: item.phoneHref,
    emailHref: item.emailHref,
    heroBackgroundUrl: item.heroBackgroundUrl,
    stats: item.stats,
    aboutParagraphs: item.aboutParagraphs,
    policiesParagraphs: item.policiesParagraphs,
    socialLinks: item.socialLinks,
  }
}

/** Agents shown on the /agents directory. */
export async function loadDirectoryAgents(): Promise<RealEstateAgentProfile[]> {
  const items = await getContentList<AgentContentItem>(AGENTS_KEY)
  return items.filter((item) => item.showInDirectory).map(toAgentProfile)
}

export async function loadAgentProfile(id: string): Promise<AgentProfileDetail | undefined> {
  const item = await getContentItem<AgentContentItem>(AGENTS_KEY, id)
  return item ? toAgentProfileDetail(item) : undefined
}

export async function loadAgentAreaExpertise(id: string): Promise<AgentExpertiseArea[] | undefined> {
  const item = await getContentItem<AgentContentItem>(AGENTS_KEY, id)
  return item?.areaExpertise.map((area) => ({ ...area, detailAreaId: area.detailAreaId || area.id }))
}

export function loadAgentProfileIds(): Promise<string[]> {
  return getContentItemIds(AGENTS_KEY)
}

export function loadAgentsPageContent() {
  return getPageContent<AgentsPageContent>(AGENTS_PAGE_KEY)
}
