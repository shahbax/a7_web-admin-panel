import type {
  ContentDefinition,
  ListContentDefinition,
  SingleContentDefinition,
} from "@/features/cms/site-content/core/types"
import { MARKETING_ICON_HINT } from "@/features/cms/site-content/core/hints"
import { homeDeveloperCtaContent } from "@/features/developer/content/developer-cta-content"
import {
  EVENT_BANNERS,
  EVENTS_BREADCRUMBS,
  EVENTS_PAGE_DESCRIPTION,
  EVENTS_PAGE_INTRO,
  EVENTS_PAGE_TITLE,
  EVENTS_TOP_AREAS_SECTIONS,
  EVENTS_TOP_AREAS_TITLE,
  eventsFaqSectionProps,
  getEventDetailById,
  type EventBannerCardItem,
  type EventDetail,
} from "@/features/event/content/events-page-content"
import { eventDetailPath, eventsPath } from "@/shared/lib/constants/routes"

// ----------------------------------------------------------------------------
// Dataset: one item per event (list banner + detail page)
// ----------------------------------------------------------------------------

/** One event. The list banner uses heroTitle/heroSubtitle/heroDate/heroLocation/heroImageUrl. */
export type EventItem = EventDetail & {
  seo: { title: string; description: string }
}

export function getEventItemsDefaults(): EventItem[] {
  return EVENT_BANNERS.map((banner) => {
    const detail = getEventDetailById(banner.id)
    if (!detail) throw new Error(`Missing event detail for "${banner.id}"`)
    return {
      ...detail,
      seo: {
        title: `${detail.heroTitle} | A Seven Properties`,
        description: detail.aboutDescriptionParagraphs[0] ?? "",
      },
    }
  })
}

/** Banner card for the /events list, derived from an event item. */
export function toEventBanner(event: EventItem): EventBannerCardItem {
  return {
    id: event.id,
    title: event.heroTitle,
    subtitle: event.heroSubtitle,
    date: event.heroDate,
    location: event.heroLocation,
    imageUrl: event.heroImageUrl,
    href: eventDetailPath(event.id),
  }
}

// ----------------------------------------------------------------------------
// Single: the /events list page's own texts
// ----------------------------------------------------------------------------

export function getEventsPageDefaults() {
  return {
    seo: { title: `${EVENTS_PAGE_TITLE} | A Seven Properties`, description: EVENTS_PAGE_DESCRIPTION },
    list: {
      breadcrumbs: EVENTS_BREADCRUMBS,
      title: EVENTS_PAGE_TITLE,
      intro: EVENTS_PAGE_INTRO,
      headingId: "events-page-heading",
    },
    topAreas: {
      title: EVENTS_TOP_AREAS_TITLE,
      sections: EVENTS_TOP_AREAS_SECTIONS.map((section) => ({ ...section })),
    },
    faq: eventsFaqSectionProps,
    newsletter: homeDeveloperCtaContent,
  }
}

export type EventsPageContent = ReturnType<typeof getEventsPageDefaults>

export const eventContentDefinitions: ContentDefinition[] = [
  {
    key: "dataset.events",
    kind: "list",
    label: "Events",
    group: "Directories",
    description: "Event banners on /events and each event's detail page.",
    previewPath: eventsPath(),
    defaults: getEventItemsDefaults,
    idField: "id",
    titleField: "heroTitle",
    itemPath: (id: string) => eventDetailPath(id),
    hints: {
      heroTitle: { label: "Title", help: "list banner and detail hero" },
      heroSubtitle: { label: "Subtitle" },
      heroDate: { label: "Date" },
      heroLocation: { label: "Location" },
      heroImageUrl: { label: "Banner / hero image", type: "image" },
      mapEmbedUrl: { label: "Google Maps embed URL", type: "link" },
      "categories[].icon": MARKETING_ICON_HINT,
      "contactSectionProps.formIdPrefix": { type: "hidden" },
      contactSectionProps: { label: "Contact section" },
      clientsTestimonials: { label: "Testimonials" },
      seo: { label: "Search engine (SEO)" },
    },
  } satisfies ListContentDefinition<EventItem>,
  {
    key: "page.events",
    kind: "single",
    label: "Events page",
    group: "Directories",
    previewPath: eventsPath(),
    defaults: getEventsPageDefaults,
    sections: [
      { key: "list", label: "Heading and event banners" },
      { key: "topAreas", label: "Top performing areas" },
      { key: "faq", label: "FAQ" },
      { key: "newsletter", label: "Newsletter" },
    ],
    hints: {
      seo: { label: "Search engine (SEO)" },
      list: { label: "Heading" },
      "faq.idPrefix": { type: "hidden" },
    },
  } satisfies SingleContentDefinition<EventsPageContent>,
]
