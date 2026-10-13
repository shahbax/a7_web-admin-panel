import type { BlockDefinition } from "@/features/cms/blocks/types"

// Generic, on-brand blocks assembled from existing design tokens and
// primitives. Admins compose pages from these; style is limited to enums of
// on-brand variants (no free-form CSS/colours/fonts).

const bgOptions = [
  { label: "White", value: "white" },
  { label: "Cream", value: "cream" },
  { label: "Dark", value: "dark" },
]

const alignOptions = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
]

const buttonVariantOptions = [
  { label: "Primary", value: "primary" },
  { label: "Outline", value: "outline" },
  { label: "Link", value: "link" },
]

export const blockRegistry: BlockDefinition[] = [
  {
    type: "generic.sectionHeading",
    label: "Section heading",
    description: "Eyebrow, heading and description.",
    category: "generic",
    fields: [
      { name: "eyebrow", label: "Eyebrow", type: "text" },
      { name: "heading", label: "Heading", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "align", label: "Alignment", type: "select", options: alignOptions },
      { name: "background", label: "Background", type: "select", options: bgOptions },
    ],
    defaults: { eyebrow: "", heading: "Section heading", description: "", align: "left", background: "white" },
  },
  {
    type: "generic.richText",
    label: "Rich text",
    category: "generic",
    fields: [
      { name: "html", label: "Content", type: "richtext" },
      { name: "background", label: "Background", type: "select", options: bgOptions },
    ],
    defaults: { html: "<p>Write something…</p>", background: "white" },
  },
  {
    type: "generic.buttons",
    label: "Buttons row",
    category: "generic",
    fields: [
      { name: "align", label: "Alignment", type: "select", options: alignOptions },
      { name: "background", label: "Background", type: "select", options: bgOptions },
      {
        name: "buttons",
        label: "Buttons",
        type: "list",
        itemLabel: "Button",
        itemFields: [
          { name: "label", label: "Label", type: "text" },
          { name: "href", label: "Link", type: "url" },
          { name: "variant", label: "Style", type: "select", options: buttonVariantOptions },
        ],
      },
    ],
    defaults: {
      align: "left",
      background: "white",
      buttons: [{ label: "Learn more", href: "/", variant: "primary" }],
    },
  },
  {
    type: "generic.image",
    label: "Image",
    category: "generic",
    fields: [
      { name: "src", label: "Image", type: "image" },
      { name: "alt", label: "Alt text", type: "text" },
      { name: "caption", label: "Caption", type: "text" },
      { name: "background", label: "Background", type: "select", options: bgOptions },
    ],
    defaults: { src: "", alt: "", caption: "", background: "white" },
  },
  {
    type: "generic.imageText",
    label: "Image + text",
    category: "generic",
    fields: [
      { name: "image", label: "Image", type: "image" },
      { name: "alt", label: "Image alt", type: "text" },
      { name: "imagePosition", label: "Image position", type: "select", options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ] },
      { name: "eyebrow", label: "Eyebrow", type: "text" },
      { name: "heading", label: "Heading", type: "text" },
      { name: "body", label: "Body", type: "richtext" },
      { name: "buttonLabel", label: "Button label", type: "text" },
      { name: "buttonHref", label: "Button link", type: "url" },
      { name: "background", label: "Background", type: "select", options: bgOptions },
    ],
    defaults: {
      image: "", alt: "", imagePosition: "left", eyebrow: "", heading: "Heading",
      body: "<p>Body text.</p>", buttonLabel: "", buttonHref: "", background: "white",
    },
  },
  {
    type: "generic.featureGrid",
    label: "Feature / icon grid",
    category: "generic",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "columns", label: "Columns", type: "select", options: [
        { label: "2", value: "2" }, { label: "3", value: "3" }, { label: "4", value: "4" },
      ] },
      { name: "background", label: "Background", type: "select", options: bgOptions },
      {
        name: "items", label: "Features", type: "list", itemLabel: "Feature",
        itemFields: [
          { name: "icon", label: "Icon (lucide name)", type: "text", help: "e.g. home, key, building" },
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
        ],
      },
    ],
    defaults: {
      heading: "", columns: "3", background: "white",
      items: [
        { icon: "home", title: "Feature one", text: "Describe it." },
        { icon: "key", title: "Feature two", text: "Describe it." },
        { icon: "building", title: "Feature three", text: "Describe it." },
      ],
    },
  },
  {
    type: "generic.stats",
    label: "Stats row",
    category: "generic",
    fields: [
      { name: "background", label: "Background", type: "select", options: bgOptions },
      {
        name: "items", label: "Stats", type: "list", itemLabel: "Stat",
        itemFields: [
          { name: "value", label: "Value", type: "text" },
          { name: "label", label: "Label", type: "text" },
        ],
      },
    ],
    defaults: {
      background: "cream",
      items: [
        { value: "1,200+", label: "Properties sold" },
        { value: "15 yrs", label: "In the market" },
        { value: "98%", label: "Client satisfaction" },
      ],
    },
  },
  {
    type: "generic.cardGrid",
    label: "Card grid of links",
    category: "generic",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "background", label: "Background", type: "select", options: bgOptions },
      {
        name: "cards", label: "Cards", type: "list", itemLabel: "Card",
        itemFields: [
          { name: "image", label: "Image", type: "image" },
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
          { name: "href", label: "Link", type: "url" },
        ],
      },
    ],
    defaults: {
      heading: "", background: "white",
      cards: [
        { image: "", title: "Card one", text: "Description", href: "/" },
        { image: "", title: "Card two", text: "Description", href: "/" },
        { image: "", title: "Card three", text: "Description", href: "/" },
      ],
    },
  },
  {
    type: "generic.ctaBanner",
    label: "CTA banner",
    category: "generic",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "text", label: "Text", type: "textarea" },
      { name: "buttonLabel", label: "Button label", type: "text" },
      { name: "buttonHref", label: "Button link", type: "url" },
      { name: "background", label: "Background", type: "select", options: bgOptions },
    ],
    defaults: {
      heading: "Ready to make your move?",
      text: "Talk to an A7 property expert today.",
      buttonLabel: "Contact us", buttonHref: "/sell-property", background: "dark",
    },
  },
  {
    type: "generic.faq",
    label: "FAQ accordion",
    category: "generic",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "background", label: "Background", type: "select", options: bgOptions },
      {
        name: "items", label: "Questions", type: "list", itemLabel: "Q&A",
        itemFields: [
          { name: "question", label: "Question", type: "text" },
          { name: "answer", label: "Answer", type: "textarea" },
        ],
      },
    ],
    defaults: {
      heading: "Frequently asked questions", background: "white",
      items: [{ question: "A question?", answer: "An answer." }],
    },
  },
  {
    type: "generic.spacer",
    label: "Spacer / divider",
    category: "generic",
    fields: [
      { name: "size", label: "Size", type: "select", options: [
        { label: "Small", value: "sm" }, { label: "Medium", value: "md" }, { label: "Large", value: "lg" },
      ] },
      { name: "divider", label: "Show divider line", type: "boolean" },
    ],
    defaults: { size: "md", divider: false },
  },

  // --- Existing brand sections (render the real site components) ----------
  {
    type: "home.faq",
    label: "FAQ section (brand)",
    description: "The site's FAQ accordion.",
    category: "existing",
    fields: [
      { name: "title", label: "Title", type: "text" },
      {
        name: "items", label: "Questions", type: "list", itemLabel: "Q&A",
        itemFields: [
          { name: "question", label: "Question", type: "text" },
          { name: "answer", label: "Answer", type: "textarea" },
        ],
      },
    ],
    defaults: {
      title: "Frequently asked questions",
      items: [{ question: "A question?", answer: "An answer." }],
    },
  },
  {
    type: "home.testimonials",
    label: "Testimonials carousel (brand)",
    description: "The site's “Happy home owners” testimonial slider.",
    category: "existing",
    fields: [
      {
        name: "items", label: "Testimonials", type: "list", itemLabel: "Testimonial",
        itemFields: [
          { name: "name", label: "Name", type: "text" },
          { name: "role", label: "Role / location", type: "text" },
          { name: "quote", label: "Quote", type: "textarea" },
          { name: "avatar", label: "Avatar", type: "image" },
        ],
      },
    ],
    defaults: {
      items: [{ name: "Jane Doe", role: "Dubai, UAE", quote: "A wonderful experience.", avatar: "" }],
    },
  },
  {
    type: "home.partners",
    label: "Developer partners (brand)",
    description: "The site's trusted-developer logo carousel.",
    category: "existing",
    fields: [
      {
        name: "items", label: "Partners", type: "list", itemLabel: "Partner",
        itemFields: [
          { name: "name", label: "Name", type: "text" },
          { name: "logo", label: "Logo", type: "image" },
        ],
      },
    ],
    defaults: {
      items: [{ name: "Emaar", logo: "/assets/developers/emaar.png" }],
    },
  },
]

const byType = new Map(blockRegistry.map((b) => [b.type, b]))

export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return byType.get(type)
}

export function blockLabel(type: string): string {
  return byType.get(type)?.label ?? type
}
