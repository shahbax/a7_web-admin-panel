"use client"

import type { FormEvent } from "react"

import type {
  AgentProfileCopy,
  AgentProfileDetail,
} from "@/features/agent/core/domain/entity/agent.entity"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import { useLeadSubmit } from "@/features/leads/ui/use-lead-submit"
import { cn } from "@/shared/lib/cn"

type AgentContactSectionProps = {
  agent: AgentProfileDetail
  copy: Pick<AgentProfileCopy, "contactTitle" | "contactDescription" | "contactSuccessMessage">
  className?: string
}

const fieldClassName =
  "border-transparent bg-[#F3F3F3] shadow-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-[#F3F3F3]"

export function AgentContactSection({ agent, copy, className }: AgentContactSectionProps) {
  const { pending, done, error, submit } = useLeadSubmit()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submit(event.currentTarget, { type: "agent", reference: agent.name })
  }

  return (
    <section className={cn(className)} aria-labelledby="agent-contact-heading">
      <div className="rounded-2xl border border-border bg-white px-4 py-5 sm:px-6 sm:py-5 md:px-5">
        <header className="max-w-2xl">
          <h2
            id="agent-contact-heading"
            className="font-heading text-2xl font-bold text-a7-black md:text-3xl"
          >
            {copy.contactTitle.replaceAll("{name}", agent.name)}
          </h2>
          <p className="mt-2 text-sm text-a7-black md:text-base">
            {copy.contactDescription.replaceAll("{name}", agent.name)}
          </p>
        </header>

        {done ? (
          <p className="mt-6 rounded-xl bg-a7-panel-surface px-4 py-6 text-center text-base font-medium text-a7-black md:mt-8">
            {copy.contactSuccessMessage.replaceAll("{name}", agent.name)}
          </p>
        ) : (
        <form className="mt-6 md:mt-8" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            <Input
              id="agent-contact-full-name"
              name="fullName"
              type="text"
              placeholder="Full Name"
              autoComplete="name"
              inputSize="lg"
              radius="md"
              className={fieldClassName}
              aria-label="Full Name"
            />
            <Input
              id="agent-contact-email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              inputSize="lg"
              radius="md"
              className={fieldClassName}
              aria-label="Email"
            />
            <Input
              id="agent-contact-phone"
              name="phone"
              type="tel"
              placeholder="Phone"
              autoComplete="tel"
              inputSize="lg"
              radius="md"
              className={cn(fieldClassName, "sm:col-span-2 md:col-span-1")}
              aria-label="Phone"
            />
          </div>

          <Textarea
            id="agent-contact-message"
            name="message"
            placeholder="Message"
            rows={6}
            className={cn(
              "mt-3 min-h-[140px] resize-none text-base",
              fieldClassName
            )}
            aria-label="Message"
          />

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

          <div className="mt-5 flex justify-end">
            <Button type="submit" variant="default" shape="pill" size="lg" className="min-w-[9.5rem] px-8" disabled={pending}>
              {pending ? "Sending…" : "Send Now"}
            </Button>
          </div>
        </form>
        )}
      </div>
    </section>
  )
}
