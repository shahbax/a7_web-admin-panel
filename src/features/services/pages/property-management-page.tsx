import type { Metadata } from "next"

import { PropertyManagementPage } from "@/features/services/ui/property-management"
import { loadPropertyManagementContent } from "@/features/services/services/content"

export async function generatePropertyManagementMetadata(): Promise<Metadata> {
  const { content } = await loadPropertyManagementContent()
  return { title: content.seo.title, description: content.seo.description }
}

export async function PropertyManagementPageRoute() {
  const { content, layout } = await loadPropertyManagementContent()
  return <PropertyManagementPage content={content} layout={layout} />
}
