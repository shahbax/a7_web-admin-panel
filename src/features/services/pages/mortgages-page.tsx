import type { Metadata } from "next"

import { MortgagesPage } from "@/features/services/ui/mortgages"
import { loadMortgagesContent } from "@/features/services/services/content"

export async function generateMortgagesMetadata(): Promise<Metadata> {
  const { content } = await loadMortgagesContent()
  return { title: content.seo.title, description: content.seo.description }
}

export async function MortgagesPageRoute() {
  const { content, layout } = await loadMortgagesContent()
  return <MortgagesPage content={content} layout={layout} />
}
