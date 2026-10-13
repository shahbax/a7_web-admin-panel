import type { BlockField } from "@/features/cms/blocks/types"

export type CollectionDef = {
  key: string
  label: string // plural
  singular: string
  hasSlug: boolean // whether items have a public slug
  titleField: string // which field becomes the item title
  fields: BlockField[]
}

export const collectionRegistry: CollectionDef[] = [
  {
    key: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    hasSlug: false,
    titleField: "name",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "role", label: "Role / location", type: "text" },
      { name: "quote", label: "Quote", type: "textarea" },
      { name: "avatar", label: "Avatar", type: "image" },
      { name: "rating", label: "Rating", type: "select", options: [
        { label: "5", value: "5" }, { label: "4", value: "4" }, { label: "3", value: "3" },
      ] },
    ],
  },
  {
    key: "faqs",
    label: "FAQs",
    singular: "FAQ",
    hasSlug: false,
    titleField: "question",
    fields: [
      { name: "question", label: "Question", type: "text" },
      { name: "answer", label: "Answer", type: "textarea" },
      { name: "group", label: "Group", type: "text", help: "e.g. global, home, buying" },
    ],
  },
  {
    key: "news",
    label: "News / blog posts",
    singular: "Post",
    hasSlug: true,
    titleField: "title",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "cover", label: "Cover image", type: "image" },
      { name: "date", label: "Date", type: "text", placeholder: "2026-01-31" },
      { name: "author", label: "Author", type: "text" },
      { name: "body", label: "Body", type: "richtext" },
    ],
  },
  {
    key: "heroSlides",
    label: "Hero slides",
    singular: "Slide",
    hasSlug: false,
    titleField: "heading",
    fields: [
      { name: "image", label: "Background image", type: "image" },
      { name: "heading", label: "Heading", type: "text" },
      { name: "subheading", label: "Subheading", type: "text" },
      { name: "ctaLabel", label: "Button label", type: "text" },
      { name: "ctaHref", label: "Button link", type: "url" },
    ],
  },
  {
    key: "partnerLogos",
    label: "Developer partner logos",
    singular: "Partner",
    hasSlug: false,
    titleField: "name",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "logo", label: "Logo", type: "image" },
      { name: "href", label: "Link", type: "url" },
    ],
  },
  {
    key: "events",
    label: "Events",
    singular: "Event",
    hasSlug: true,
    titleField: "title",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "date", label: "Date", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "cover", label: "Cover image", type: "image" },
      { name: "body", label: "Details", type: "richtext" },
    ],
  },
  {
    key: "careers",
    label: "Careers / jobs",
    singular: "Job",
    hasSlug: true,
    titleField: "title",
    fields: [
      { name: "title", label: "Job title", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "type", label: "Employment type", type: "text", placeholder: "Full-time" },
      { name: "excerpt", label: "Summary", type: "textarea" },
      { name: "body", label: "Description", type: "richtext" },
    ],
  },
  {
    key: "services",
    label: "Services",
    singular: "Service",
    hasSlug: true,
    titleField: "title",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "icon", label: "Icon (lucide name)", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "body", label: "Body", type: "richtext" },
    ],
  },
  {
    key: "developers",
    label: "Developers",
    singular: "Developer",
    hasSlug: true,
    titleField: "name",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "logo", label: "Logo", type: "image" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "href", label: "Website", type: "url" },
    ],
  },
  {
    key: "areas",
    label: "Areas / communities",
    singular: "Area",
    hasSlug: true,
    titleField: "name",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "cover", label: "Cover image", type: "image" },
      { name: "body", label: "Description", type: "richtext" },
    ],
  },
  {
    key: "projects",
    label: "Off-plan projects",
    singular: "Project",
    hasSlug: true,
    titleField: "name",
    fields: [
      { name: "name", label: "Project name", type: "text" },
      { name: "developer", label: "Developer", type: "text" },
      { name: "area", label: "Area", type: "text" },
      { name: "handoverDate", label: "Handover date", type: "text" },
      { name: "priceFrom", label: "Price from", type: "text" },
      { name: "cover", label: "Cover image", type: "image" },
      { name: "themeColor", label: "Brand colour (hex)", type: "text", help: "Palette is generated from this colour." },
      { name: "description", label: "Overview", type: "richtext" },
    ],
  },
]

const byKey = new Map(collectionRegistry.map((c) => [c.key, c]))

export function getCollectionDef(key: string): CollectionDef | undefined {
  return byKey.get(key)
}
