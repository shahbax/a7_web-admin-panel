import "server-only"

import {
  getContentItem,
  getContentItemIds,
  getContentList,
  getPageContent,
} from "@/features/cms/site-content/service"
import {
  toAreaDetail,
  type AreaItem,
  type AreasPageContent,
} from "@/features/area/content/cms-content"

export type { AreaItem, AreasPageContent }
export type AreaDetailItem = ReturnType<typeof toAreaDetail>

export function loadAreasPageContent() {
  return getPageContent<AreasPageContent>("page.areas")
}

export function loadAreaItems() {
  return getContentList<AreaItem>("dataset.areas")
}

export async function loadAreaDetail(id: string): Promise<AreaDetailItem | undefined> {
  const item = await getContentItem<AreaItem>("dataset.areas", id)
  return item ? toAreaDetail(item) : undefined
}

export function loadAreaIds() {
  return getContentItemIds("dataset.areas")
}
