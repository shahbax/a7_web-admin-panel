import "server-only"

import { getContentItem, getContentItemIds } from "@/features/cms/site-content/service"
import { toPropertyDetail, type PropertyDetail } from "@/features/property"
import {
  getProjectTheme,
  projectThemeFromSeed,
  SITE_DEFAULT_THEME,
} from "@/theme/model/themes"
import type { ProjectTheme } from "@/theme/model/types"
import type {
  OffPlanProjectContentItem,
  ProjectContentItem,
  SecondaryProjectContentItem,
} from "@/features/project/content/cms-content"
import { getOffPlanProjectDetail } from "@/features/project/core/data/mocks/off-plan-project-details"
import { getProjectDetail } from "@/features/project/core/data/mocks/project-details"

export type { OffPlanProjectContentItem, ProjectContentItem, SecondaryProjectContentItem }

const OFF_PLAN_KEY = "dataset.offPlanProjects"
const PROJECTS_KEY = "dataset.projects"

const HEX_COLOR = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

function validHex(value: string | undefined): string | undefined {
  const v = value?.trim()
  return v && HEX_COLOR.test(v) ? v : undefined
}

/** Theme generated from the item's colour; falls back to the coded theme, then the site theme. */
export function projectThemeFromItem(item: ProjectContentItem): ProjectTheme {
  const brandColor = validHex(item.themeColor)
  if (!brandColor) return getProjectTheme(item.id) ?? SITE_DEFAULT_THEME
  const name = item.themeLogoAlt || item.title
  return projectThemeFromSeed(item.id, {
    name,
    logoSrc: item.themeLogoUrl || SITE_DEFAULT_THEME.logo.src,
    logoAlt: name,
    brandColor,
    secondary: validHex(item.themeSecondaryColor),
  })
}

/**
 * Listing-driven sections (properties for sale, similar projects) stay in code:
 * taken from the coded project when it exists, else the generic defaults.
 */
function codedOrDefault(item: ProjectContentItem, coded: PropertyDetail | null): PropertyDetail {
  return (
    coded ??
    toPropertyDetail({
      id: item.id,
      title: item.title,
      description: item.description,
      location: item.location,
      handover: item.handover,
      developer: item.developer,
      paymentPlan: item.paymentPlan,
      priceFrom: item.priceFrom,
      imageUrl: item.imageUrl,
    })
  )
}

function toDetail(item: ProjectContentItem, coded: PropertyDetail | null): PropertyDetail {
  const source = codedOrDefault(item, coded)
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    location: item.location,
    handover: item.handover,
    developer: item.developer,
    paymentPlan: item.paymentPlan,
    priceFrom: item.priceFrom,
    imageUrl: item.imageUrl,
    projectLogoUrl: source.projectLogoUrl,
    primaryColor: source.primaryColor,
    primaryColorHover: source.primaryColorHover,
    primaryColorSoft: source.primaryColorSoft,
    overviewSections: item.overviewSections,
    highlights: item.highlights,
    timeline: item.timeline,
    galleryImageUrls: item.galleryImageUrls.length ? item.galleryImageUrls : [item.imageUrl],
    floorPlans: {
      unitTypes: item.floorPlans.unitTypes,
      units: item.floorPlans.units.map((unit) => ({
        ...unit,
        subTypes: unit.subTypes.map((sub) => ({
          label: sub.label,
          description: sub.description || undefined,
          details: sub.details.length ? sub.details : undefined,
          imageUrl: sub.imageUrl || undefined,
        })),
      })),
    },
    paymentPlans: item.paymentPlans,
    experts: item.experts.map((e) => ({ ...e, whatsAppHref: e.whatsAppHref || undefined })),
    locationMap: item.locationMap,
    amenities: item.amenities,
    propertiesForSale: source.propertiesForSale,
    faq: source.faq,
    storySections: source.storySections,
    storyAsideImage: source.storyAsideImage,
    similarProjects: source.similarProjects,
  }
}

export type LoadedProject = { project: PropertyDetail; theme: ProjectTheme }

export async function loadOffPlanProject(id: string): Promise<LoadedProject | undefined> {
  const item = await getContentItem<OffPlanProjectContentItem>(OFF_PLAN_KEY, id)
  if (!item) return undefined
  const project = toDetail(item, getOffPlanProjectDetail(id))
  project.storySections = item.storySections
  project.storyAsideImage = item.storyAsideImage.src
    ? { src: item.storyAsideImage.src, alt: item.storyAsideImage.alt }
    : undefined
  return { project, theme: projectThemeFromItem(item) }
}

export async function loadSecondaryProject(id: string): Promise<LoadedProject | undefined> {
  const item = await getContentItem<SecondaryProjectContentItem>(PROJECTS_KEY, id)
  if (!item) return undefined
  const project = toDetail(item, getProjectDetail(id))
  project.faq = item.faq
  return { project, theme: projectThemeFromItem(item) }
}

export function loadOffPlanProjectIds(): Promise<string[]> {
  return getContentItemIds(OFF_PLAN_KEY)
}

export function loadSecondaryProjectIds(): Promise<string[]> {
  return getContentItemIds(PROJECTS_KEY)
}
