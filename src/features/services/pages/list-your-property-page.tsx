import type { Metadata } from "next"

import { ListYourPropertyPage } from "@/features/services/ui/list-your-property"
import { loadListYourPropertyContent } from "@/features/services/services/content"

export async function generateListYourPropertyMetadata(): Promise<Metadata> {
  const { content } = await loadListYourPropertyContent()
  return { title: content.seo.title, description: content.seo.description }
}

export async function ListYourPropertyPageRoute() {
  const { content, layout } = await loadListYourPropertyContent()
  return <ListYourPropertyPage content={content} layout={layout} />
}
