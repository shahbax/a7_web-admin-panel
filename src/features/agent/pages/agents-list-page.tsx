import type { Metadata } from "next"

import { AgentsPage } from "@/features/agent/ui/agent-list/agents-page"
import { getAgentsPageContent } from "@/features/agent"
import {
  loadAgentsPageContent,
  loadDirectoryAgents,
} from "@/features/agent/services/agent-content"

export async function generateAgentsListMetadata(): Promise<Metadata> {
  const { content } = await loadAgentsPageContent()
  return { title: content.seo.title, description: content.seo.description }
}

export async function AgentsListPage() {
  const [agents, { content, layout }] = await Promise.all([
    loadDirectoryAgents(),
    loadAgentsPageContent(),
  ])

  return (
    <main>
      <AgentsPage
        agents={agents}
        breadcrumbs={getAgentsPageContent().breadcrumbs}
        title={content.title}
        searchHeroImageUrl={content.searchHero.imageUrl}
        seoSections={content.seoSections}
        developerCta={content.newsletter}
        layout={layout}
      />
    </main>
  )
}
