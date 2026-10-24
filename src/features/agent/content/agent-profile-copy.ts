import type { AgentProfileCopy } from "@/features/agent/core/domain/entity/agent.entity"

export type { AgentProfileCopy }

/**
 * Shared copy for the agent profile tabs. `{name}` is replaced with the agent's name.
 */
export const AGENT_PROFILE_COPY: AgentProfileCopy = {
  aboutTitle: "About me",
  policiesTitle: "Policies",
  areaExpertiseTitle: "{name} Areas of Expertise",
  areaExpertiseDescription:
    "Discover the neighborhoods where {name} specialises and has extensive market knowledge.",
  contactTitle: "Get in Touch with {name}",
  contactDescription:
    "If you want to ask anything about the best properties in Dubai, feel free to contact me.",
  contactSuccessMessage: "Thank you — your message has been sent. {name} will be in touch shortly.",
}
