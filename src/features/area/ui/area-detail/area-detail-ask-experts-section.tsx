"use client"

import type { FormEvent } from "react"

import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import type { AreaDetailContent } from "@/features/area/services/content"
import { getAreaDetailSectionId } from "@/features/area"
import { useLeadSubmit } from "@/features/leads/ui/use-lead-submit"
import { cn } from "@/shared/lib/cn"

type AreaDetailAskExpertsSectionProps = {
  area: AreaDetailContent
}

const fieldClassName =
  "border-border bg-white shadow-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30"

export function AreaDetailAskExpertsSection({ area }: AreaDetailAskExpertsSectionProps) {
  const sectionId = getAreaDetailSectionId("experts")
  const { pending, done, error, submit } = useLeadSubmit()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submit(event.currentTarget, { type: "area-expert", reference: area.id })
  }

  return (
    <section id={sectionId} className="scroll-mt-28" aria-labelledby={`${sectionId}-heading`}>
      <article className="rounded-2xl border border-border bg-white px-5 py-6 sm:px-7 sm:py-8 md:px-8 md:py-9">
        <h2
          id={`${sectionId}-heading`}
          className="font-heading text-2xl font-bold text-a7-black md:text-3xl lg:text-[2rem]"
        >
          Ask Local Experts
        </h2>

        {done ? (
          <p className="mt-5 rounded-xl border border-border bg-white px-4 py-6 text-center text-base font-medium text-a7-black md:mt-6">
            Thanks — your question has been sent. Our local experts will reach out soon.
          </p>
        ) : (
        <form className="mt-5 md:mt-6" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Input
              id={`${area.id}-expert-full-name`}
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
              id={`${area.id}-expert-email`}
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
              id={`${area.id}-expert-phone`}
              name="phone"
              type="tel"
              placeholder="Phone"
              autoComplete="tel"
              inputSize="lg"
              radius="md"
              className={fieldClassName}
              aria-label="Phone"
            />
          </div>

          <Textarea
            id={`${area.id}-expert-message`}
            name="message"
            placeholder="Summarize your question in few words"
            rows={6}
            className={cn("mt-3 min-h-[140px] resize-none text-base", fieldClassName)}
            aria-label="Your question"
          />

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

          <div className="mt-5 flex justify-end">
            <Button type="submit" variant="default" shape="pill" size="lg" className="min-w-[9.5rem] px-8" disabled={pending}>
              {pending ? "Sending…" : "Send Now"}
            </Button>
          </div>
        </form>
        )}
      </article>
    </section>
  )
}
