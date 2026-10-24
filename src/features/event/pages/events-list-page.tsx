import type { Metadata } from "next"

import { EventsPage } from "@/features/event/ui/events"
import { loadEventBanners, loadEventsPageContent } from "@/features/event/services/event-content"

export async function generateEventsListMetadata(): Promise<Metadata> {
  const { content } = await loadEventsPageContent()
  return { title: content.seo.title, description: content.seo.description }
}

export async function EventsListPage() {
  const [{ content, layout }, events] = await Promise.all([loadEventsPageContent(), loadEventBanners()])
  return <EventsPage content={content} layout={layout} events={events} />
}
