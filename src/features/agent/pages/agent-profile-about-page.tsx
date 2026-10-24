import { notFound } from "next/navigation"

import { AgentProfileAbout } from "@/features/agent/ui/agent-profile"
import {
  loadAgentProfile,
  loadAgentsPageContent,
} from "@/features/agent/services/agent-content"

type AgentProfileAboutPageProps = {
  params: Promise<{ id: string }>
}

export async function AgentProfileAboutPage({ params }: AgentProfileAboutPageProps) {
  const { id } = await params
  const [agent, { content }] = await Promise.all([loadAgentProfile(id), loadAgentsPageContent()])

  if (!agent) {
    notFound()
  }

  return <AgentProfileAbout agent={agent} copy={content.profile} />
}
