import type { Metadata } from "next"

import { PropertySnaggingPage } from "@/features/services/ui/property-snagging"
import { loadPropertySnaggingContent } from "@/features/services/services/content"

export async function generatePropertySnaggingMetadata(): Promise<Metadata> {
  const { content } = await loadPropertySnaggingContent()
  return { title: content.seo.title, description: content.seo.description }
}

export async function PropertySnaggingPageRoute() {
  const { content, layout } = await loadPropertySnaggingContent()
  return <PropertySnaggingPage content={content} layout={layout} />
}
