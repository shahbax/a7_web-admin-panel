import { notFound } from "next/navigation"

import { AgentAreaExpertiseSection } from "@/features/agent/ui/agent-profile/agent-area-expertise-section"
import {
  loadAgentAreaExpertise,
  loadAgentProfile,
  loadAgentsPageContent,
} from "@/features/agent/services/agent-content"

type AgentProfileAreaExpertisePageProps = {
  params: Promise<{ id: string }>
}

export async function AgentProfileAreaExpertisePage({ params }: AgentProfileAreaExpertisePageProps) {
  const { id } = await params
  const [agent, areas, { content }] = await Promise.all([
    loadAgentProfile(id),
    loadAgentAreaExpertise(id),
    loadAgentsPageContent(),
  ])

  if (!agent) {
    notFound()
  }

  return <AgentAreaExpertiseSection agent={agent} areas={areas ?? []} copy={content.profile} />
}
