"use client"

import type { FormEvent } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Textarea } from "@/shared/ui/textarea"
import type { PropertyListingDetail } from "@/features/property"
import { useLeadSubmit } from "@/features/leads/ui/use-lead-submit"
import { cn } from "@/shared/lib/cn"

type PropertyInquirySectionProps = {
  property: PropertyListingDetail
  className?: string
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function PropertyInquirySection({ property, className }: PropertyInquirySectionProps) {
  const { pending, done, error, submit } = useLeadSubmit()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submit(event.currentTarget, {
      type: "inquiry",
      reference: property.id,
    })
  }

  return (
    <section
      className={cn("mx-auto container bg-white px-6 py-7.5 md:px-10", className)}
      aria-labelledby="property-inquiry-heading"
    >
      <h2 id="property-inquiry-heading" className="font-heading text-2xl font-bold text-a7-black md:text-3xl">
        Ask {property.agentName} a question
      </h2>

      {done ? (
        <div className="mt-6 rounded-xl bg-a7-panel-surface p-6 text-center text-base font-medium text-a7-black">
          Thank you — your question has been sent. {property.agentName} will be in touch shortly.
        </div>
      ) : (
        <form className="mt-6 rounded-xl bg-a7-panel-surface p-5 md:p-6" onSubmit={handleSubmit}>
          <Textarea
            name="message"
            placeholder="Message"
            className="min-h-[140px] resize-none border-0 bg-white text-base shadow-none focus-visible:ring-ring/30"
            aria-label="Your message"
          />
          <Input
            name="email"
            type="email"
            required
            placeholder="Your email"
            className="mt-3 border-0 bg-white text-base shadow-none focus-visible:ring-ring/30"
            aria-label="Your email"
          />
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar size="sm" shape="circle">
                {property.agentAvatarUrl ? (
                  <AvatarImage src={property.agentAvatarUrl} alt={property.agentName} />
                ) : null}
                <AvatarFallback>{getInitials(property.agentName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-a7-black">{property.agentName}</p>
                <p className="text-xs text-muted-foreground">Contact Agent</p>
              </div>
            </div>
            <Button type="submit" variant="default" shape="pill" size="sm" className="min-w-[160px] shrink-0" disabled={pending}>
              {pending ? "Sending…" : "Ask a Question"}
            </Button>
          </div>
        </form>
      )}
    </section>
  )
}
