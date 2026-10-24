import "server-only"

import {
  getContentItem,
  getContentItemIds,
  getContentList,
  getPageContent,
} from "@/features/cms/site-content/service"
import {
  toEventBanner,
  type EventItem,
  type EventsPageContent,
} from "@/features/event/content/cms-content"

export type { EventItem, EventsPageContent }

export function loadEventsPageContent() {
  return getPageContent<EventsPageContent>("page.events")
}

export async function loadEventBanners() {
  return (await getContentList<EventItem>("dataset.events")).map(toEventBanner)
}

export function loadEventDetail(id: string) {
  return getContentItem<EventItem>("dataset.events", id)
}

export function loadEventIds() {
  return getContentItemIds("dataset.events")
}
