import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { EventDetailPage } from "@/features/event/ui/events"
import { loadEventDetail, loadEventIds } from "@/features/event/services/event-content"
import { loadDeveloperCtaContent } from "@/features/home/services/shared-cta-content"

type EventDetailPageProps = {
  params: Promise<{ id: string }>
}

export async function generateEventDetailStaticParams() {
  return (await loadEventIds()).map((id) => ({ id }))
}

export async function generateEventDetailMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const event = await loadEventDetail(id)

  if (!event) return { title: "Event not found | A Seven Properties" }

  return { title: event.seo.title, description: event.seo.description }
}

export async function EventDetailPageRoute({ params }: EventDetailPageProps) {
  const { id } = await params
  const event = await loadEventDetail(id)
  if (!event) notFound()

  return <EventDetailPage event={event} newsletter={(await loadDeveloperCtaContent()).home} />
}
