import "server-only"

import {
  getContentItem,
  getContentItemIds,
  getContentList,
  getPageContent,
} from "@/features/cms/site-content/service"
import {
  toCareerOpening,
  type CareerJobItem,
  type CareerPageContent,
} from "@/features/career/content/cms-content"

export type { CareerJobItem, CareerPageContent }

export function loadCareerPageContent() {
  return getPageContent<CareerPageContent>("page.career")
}

export async function loadCareerOpenings() {
  return (await getContentList<CareerJobItem>("dataset.careers")).map(toCareerOpening)
}

export function loadCareerJob(id: string) {
  return getContentItem<CareerJobItem>("dataset.careers", id)
}

export function loadCareerJobIds() {
  return getContentItemIds("dataset.careers")
}
