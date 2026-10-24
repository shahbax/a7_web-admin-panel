import type { Metadata } from "next"

import { ServicesPage } from "@/features/services/ui/services"
import { loadServicesContent } from "@/features/services/services/content"

export async function generateServicesMetadata(): Promise<Metadata> {
  const { content } = await loadServicesContent()
  return { title: content.seo.title, description: content.seo.description }
}

export async function ServicesPageRoute() {
  const { content, layout } = await loadServicesContent()
  return <ServicesPage content={content} layout={layout} />
}
