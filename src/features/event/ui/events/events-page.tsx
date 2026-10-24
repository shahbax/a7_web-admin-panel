"use client"

import { motion } from "framer-motion"

import { HomeDeveloperCtaNewsletter } from "@/shared/ui/marketing/home-developer-cta-newsletter"
import { MarketingFaqSection } from "@/shared/ui/marketing"
import { renderSections } from "@/features/cms/site-content/core/sections"
import type { SectionLayout } from "@/features/cms/site-content/core/types"
import { cn } from "@/shared/lib/cn"

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]
const VIEWPORT = { once: true, amount: 0.08 as const }

import { EventBannerListSection } from "./event-banner-list-section"
import type { EventBannerCardItem } from "./event-banner-card"
import type { EventsPageContent } from "@/features/event/services/event-content"

function EventsTopAreasSection({
  title,
  sections,
}: {
  title: string
  sections: readonly { id: string; title: string; body: string }[]
}) {
  return (
    <section className="bg-white py-10 md:py-14" aria-labelledby="events-top-areas-heading">
      <div className="container mx-auto px-4">
        <motion.h2
          id="events-top-areas-heading"
          className="font-heading text-3xl font-semibold text-a7-black"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {title}
        </motion.h2>
        <div className="mt-5 space-y-5">
          {sections.map((section, index) => (
            <motion.article
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.7, ease: EASE, delay: 0.05 + index * 0.07 }}
            >
              <h3 className="font-heading text-xl font-semibold text-a7-black">{section.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-a7-text-gray md:text-base">{section.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export type EventsPageProps = {
  content: EventsPageContent
  layout: SectionLayout
  events: readonly EventBannerCardItem[]
  className?: string
}

export function EventsPage({ content, layout, events, className }: EventsPageProps) {
  return (
    <main className={cn("bg-white", className)}>
      {renderSections(layout, {
        list: <EventBannerListSection {...content.list} events={events} />,
        topAreas: <EventsTopAreasSection title={content.topAreas.title} sections={content.topAreas.sections} />,
        faq: <MarketingFaqSection {...content.faq} />,
        newsletter: <HomeDeveloperCtaNewsletter {...content.newsletter} />,
      })}
    </main>
  )
}
