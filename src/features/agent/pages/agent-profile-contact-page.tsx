import { notFound } from "next/navigation"

import { AgentContactSection } from "@/features/agent/ui/agent-profile/agent-contact-section"
import {
  loadAgentProfile,
  loadAgentsPageContent,
} from "@/features/agent/services/agent-content"

type AgentProfileContactPageProps = {
  params: Promise<{ id: string }>
}

export async function AgentProfileContactPage({ params }: AgentProfileContactPageProps) {
  const { id } = await params
  const [agent, { content }] = await Promise.all([loadAgentProfile(id), loadAgentsPageContent()])

  if (!agent) {
    notFound()
  }

  return <AgentContactSection agent={agent} copy={content.profile} />
}
