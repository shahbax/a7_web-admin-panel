import type { BlockField } from "@/features/cms/blocks/types"

export type CollectionDef = {
  key: string
  label: string // plural
  singular: string
  hasSlug: boolean // whether items have a public slug
  titleField: string // which field becomes the item title
  fields: BlockField[]
}

// Events, careers, services, developers, areas and projects are edited under
// "Website content" (features/cms/site-content), next to the pages that show them.
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
]

const byKey = new Map(collectionRegistry.map((c) => [c.key, c]))

export function getCollectionDef(key: string): CollectionDef | undefined {
  return byKey.get(key)
}
