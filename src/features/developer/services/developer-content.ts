import "server-only"

import {
  getContentItem,
  getContentItemIds,
  getContentList,
  getPageContent,
} from "@/features/cms/site-content/service"
import {
  toDeveloperDetail,
  type DeveloperItem,
  type DevelopersPageContent,
} from "@/features/developer/content/cms-content"

export type { DeveloperItem, DevelopersPageContent }

export function loadDevelopersPageContent() {
  return getPageContent<DevelopersPageContent>("page.developers")
}

export async function loadDevelopers() {
  return (await getContentList<DeveloperItem>("dataset.developers")).map(toDeveloperDetail)
}

export async function loadDeveloperDetail(id: string) {
  const item = await getContentItem<DeveloperItem>("dataset.developers", id)
  return item ? toDeveloperDetail(item) : undefined
}

export function loadDeveloperIds() {
  return getContentItemIds("dataset.developers")
}
