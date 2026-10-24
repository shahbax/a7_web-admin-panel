import type { Metadata } from "next"

import { PlotsPage } from "@/features/services/ui/plots"
import { loadPlotsContent } from "@/features/services/services/content"

export async function generatePlotsMetadata(): Promise<Metadata> {
  const { content } = await loadPlotsContent()
  return { title: content.seo.title, description: content.seo.description }
}

export async function PlotsPageRoute() {
  const { content, layout } = await loadPlotsContent()
  return <PlotsPage content={content} layout={layout} />
}
