import type {
  AgentProfileCopy,
  AgentProfileDetail,
} from "@/features/agent/core/domain/entity/agent.entity"

import { AgentProfilePanel } from "./agent-profile-panel"

type AgentProfileAboutProps = {
  agent: AgentProfileDetail
  copy: Pick<AgentProfileCopy, "aboutTitle" | "policiesTitle">
}

export function AgentProfileAbout({ agent, copy }: AgentProfileAboutProps) {
  return (
    <AgentProfilePanel title={copy.aboutTitle} socialLinks={agent.socialLinks}>
      <div className="space-y-4 text-sm leading-relaxed text-a7-text-gray md:text-base">
        {agent.aboutParagraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <section>
        <h3 className="font-heading text-2xl font-bold text-a7-black md:text-3xl">{copy.policiesTitle}</h3>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-a7-text-gray md:text-base">
          {agent.policiesParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>
    </AgentProfilePanel>
  )
}
