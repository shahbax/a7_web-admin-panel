import type { Metadata } from "next"

import { ConveyancingPage } from "@/features/services/ui/conveyancing"
import { loadConveyancingContent } from "@/features/services/services/content"

export async function generateConveyancingMetadata(): Promise<Metadata> {
  const { content } = await loadConveyancingContent()
  return { title: content.seo.title, description: content.seo.description }
}

export async function ConveyancingPageRoute() {
  const { content, layout } = await loadConveyancingContent()
  return <ConveyancingPage content={content} layout={layout} />
}
