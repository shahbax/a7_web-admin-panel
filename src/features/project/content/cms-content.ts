import type { ListContentDefinition } from "@/features/cms/site-content/core/types"
import type { ContentFieldHint } from "@/features/cms/site-content/core/types"
import { offPlanProjectPath, marketingProjectPath } from "@/shared/lib/constants/routes"
import { PROJECT_THEME_SEEDS } from "@/theme/model/themes"
import type {
  ProjectFaqItem,
  ProjectHighlight,
  ProjectOverviewBlock,
  ProjectPaymentPlan,
  ProjectTimelineItem,
  PropertyDetail,
} from "@/features/property"
import { getMockPropertyDtos } from "@/features/property/core/data/mocks/properties"
import { getOffPlanProjectDetail } from "@/features/project/core/data/mocks/off-plan-project-details"
import { getProjectDetail } from "@/features/project/core/data/mocks/project-details"

/**
 * Editable project content. Optional fields of the code types are normalised to
 * "" / [] so admins can fill them in (the merge only accepts keys present in the
 * defaults); the loader turns empty values back into `undefined`.
 */

export type ProjectContentFloorPlanSubType = {
  label: string
  /** Empty = use the unit's description. */
  description: string
  /** Empty = use the unit's details. */
  details: string[]
  /** Empty = use the unit's image. */
  imageUrl: string
}

export type ProjectContentFloorPlanUnit = {
  id: string
  unitType: string
  label: string
  price: string
  description: string
  details: string[]
  imageUrl: string
  subTypes: ProjectContentFloorPlanSubType[]
}

export type ProjectContentExpert = {
  id: string
  name: string
  role: string
  imageUrl: string
  whatsAppHref: string
}

export type ProjectContentItem = {
  id: string
  title: string
  description: string
  location: string
  handover: string
  developer: string
  paymentPlan: string
  priceFrom: string
  imageUrl: string
  /** Brand colour (hex) — the whole page theme is generated from it. */
  themeColor: string
  /** Optional dark companion colour (hex). Empty = derived from the brand colour. */
  themeSecondaryColor: string
  themeLogoUrl: string
  themeLogoAlt: string
  galleryImageUrls: string[]
  overviewSections: ProjectOverviewBlock[]
  highlights: ProjectHighlight[]
  timeline: ProjectTimelineItem[]
  floorPlans: { unitTypes: string[]; units: ProjectContentFloorPlanUnit[] }
  paymentPlans: ProjectPaymentPlan[]
  experts: ProjectContentExpert[]
  locationMap: {
    mapEmbedUrl: string
    latitude: number
    longitude: number
    nearby: { label: string }[]
  }
  amenities: string[]
}

/** /off-plan/[id] item (renders a story block, no FAQ). */
export type OffPlanProjectContentItem = ProjectContentItem & {
  storySections: ProjectOverviewBlock[]
  /** Brochure / QR block next to the story. Empty image = hidden. */
  storyAsideImage: { src: string; alt: string }
}

/** /projects/[id] item (renders an FAQ, no story block). */
export type SecondaryProjectContentItem = ProjectContentItem & {
  faq: ProjectFaqItem[]
}

/** Projects with a page today: every off-plan project that has a theme. */
function projectIdsWithTheme(): string[] {
  return getMockPropertyDtos()
    .map((dto) => dto.id)
    .filter((id, i, all) => all.indexOf(id) === i && id in PROJECT_THEME_SEEDS)
}

function toBaseItem(id: string, detail: PropertyDetail): ProjectContentItem {
  const seed = PROJECT_THEME_SEEDS[id]
  return {
    id,
    title: detail.title,
    description: detail.description,
    location: detail.location,
    handover: detail.handover,
    developer: detail.developer,
    paymentPlan: detail.paymentPlan,
    priceFrom: detail.priceFrom,
    imageUrl: detail.imageUrl,
    themeColor: seed?.brandColor ?? "",
    themeSecondaryColor: seed?.secondary ?? "",
    themeLogoUrl: seed?.logoSrc ?? "",
    themeLogoAlt: seed?.logoAlt ?? detail.title,
    galleryImageUrls: [...detail.galleryImageUrls],
    overviewSections: detail.overviewSections.map((b) => ({ ...b })),
    highlights: detail.highlights.map((h) => ({ ...h })),
    timeline: detail.timeline.map((t) => ({ ...t })),
    floorPlans: {
      unitTypes: [...detail.floorPlans.unitTypes],
      units: detail.floorPlans.units.map((unit) => ({
        id: unit.id,
        unitType: unit.unitType,
        label: unit.label,
        price: unit.price,
        description: unit.description,
        details: [...unit.details],
        imageUrl: unit.imageUrl,
        subTypes: unit.subTypes.map((sub) => ({
          label: sub.label,
          description: sub.description ?? "",
          details: sub.details ? [...sub.details] : [],
          imageUrl: sub.imageUrl ?? "",
        })),
      })),
    },
    paymentPlans: detail.paymentPlans.map((p) => ({ ...p })),
    experts: detail.experts.map((e) => ({
      id: e.id,
      name: e.name,
      role: e.role,
      imageUrl: e.imageUrl,
      whatsAppHref: e.whatsAppHref ?? "",
    })),
    locationMap: {
      mapEmbedUrl: detail.locationMap.mapEmbedUrl,
      latitude: detail.locationMap.latitude ?? 0,
      longitude: detail.locationMap.longitude ?? 0,
      nearby: detail.locationMap.nearby.map((n) => ({ label: n.label })),
    },
    amenities: [...detail.amenities],
  }
}

export function getOffPlanProjectItemsDefaults(): OffPlanProjectContentItem[] {
  return projectIdsWithTheme().flatMap((id) => {
    const detail = getOffPlanProjectDetail(id)
    if (!detail) return []
    return [
      {
        ...toBaseItem(id, detail),
        storySections: detail.storySections.map((b) => ({ ...b })),
        storyAsideImage: {
          src: detail.storyAsideImage?.src ?? "",
          alt: detail.storyAsideImage?.alt ?? "",
        },
      },
    ]
  })
}

export function getSecondaryProjectItemsDefaults(): SecondaryProjectContentItem[] {
  return projectIdsWithTheme().flatMap((id) => {
    const detail = getProjectDetail(id)
    if (!detail) return []
    return [{ ...toBaseItem(id, detail), faq: detail.faq.map((f) => ({ ...f })) }]
  })
}

const PAYMENT_ICON_HINT: ContentFieldHint = {
  type: "select",
  label: "Icon",
  options: [
    { value: "installment", label: "Installment" },
    { value: "construction", label: "Under construction" },
    { value: "handover", label: "Handover" },
    { value: "downPayment", label: "Down payment" },
  ],
}

const TIMELINE_STATUS_HINT: ContentFieldHint = {
  type: "select",
  label: "Status",
  options: [
    { value: "completed", label: "Completed" },
    { value: "upcoming", label: "Upcoming" },
  ],
}

const PROJECT_HINTS: Record<string, ContentFieldHint> = {
  id: { label: "URL id (slug)" },
  imageUrl: { label: "Card image", type: "image" },
  priceFrom: { label: "Starting price" },
  themeColor: {
    label: "Theme colour",
    help: "Hex colour, e.g. #C9A227. Buttons, accents and the page palette are generated from it.",
  },
  themeSecondaryColor: {
    label: "Theme secondary colour",
    help: "Optional dark hex colour, e.g. #1A3A4A. Leave empty to derive it from the theme colour.",
  },
  themeLogoUrl: { label: "Header logo", type: "image" },
  themeLogoAlt: { label: "Header logo alt text" },
  galleryImageUrls: { label: "Gallery images" },
  overviewSections: { label: "Overview" },
  "timeline[].status": TIMELINE_STATUS_HINT,
  "paymentPlans[].icon": PAYMENT_ICON_HINT,
  "floorPlans.unitTypes": { label: "Unit type tabs" },
  "floorPlans.units[].unitType": { label: "Unit type (must match a tab)" },
  "floorPlans.units[].imageUrl": { label: "Floor plan image", type: "image" },
  "floorPlans.units[].subTypes[].imageUrl": {
    label: "Image (empty = unit image)",
    type: "image",
  },
  "floorPlans.units[].subTypes[].description": { label: "Description (empty = unit description)" },
  "floorPlans.units[].subTypes[].details": { label: "Details (empty = unit details)" },
  "experts[].imageUrl": { label: "Photo", type: "image" },
  "locationMap.mapEmbedUrl": { label: "Google Maps embed URL" },
  "locationMap.nearby": { label: "Nearby places" },
  storySections: { label: "Story blocks" },
  storyAsideImage: {
    label: "Brochure / QR block",
    help: "Shown next to the story when an image is set.",
  },
  "storyAsideImage.src": { label: "Image", type: "image" },
  faq: { label: "FAQ" },
}

export const projectContentDefinitions = [
  {
    key: "dataset.offPlanProjects",
    kind: "list",
    label: "Off-plan projects",
    group: "Projects",
    description:
      "Off-plan launch pages (/off-plan/[id]). Properties for sale and similar projects come from listings and are not edited here.",
    defaults: getOffPlanProjectItemsDefaults,
    idField: "id",
    titleField: "title",
    itemPath: (id: string) => offPlanProjectPath(id),
    hints: PROJECT_HINTS,
  } satisfies ListContentDefinition<OffPlanProjectContentItem>,
  {
    key: "dataset.projects",
    kind: "list",
    label: "Projects",
    group: "Projects",
    description:
      "Project pages (/projects/[id]). Properties for sale and similar projects come from listings and are not edited here.",
    defaults: getSecondaryProjectItemsDefaults,
    idField: "id",
    titleField: "title",
    itemPath: (id: string) => marketingProjectPath(id),
    hints: PROJECT_HINTS,
  } satisfies ListContentDefinition<SecondaryProjectContentItem>,
]
