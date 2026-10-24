import type { Metadata } from "next"

import { AreasPage } from "@/features/area/ui/areas/areas-page"
import { loadAreaItems, loadAreasPageContent } from "@/features/area/services/area-content"

export async function generateAreasListMetadata(): Promise<Metadata> {
  const { content } = await loadAreasPageContent()
  return { title: content.seo.title, description: content.seo.description }
}

export async function AreasListPage() {
  const [{ content, layout }, areas] = await Promise.all([loadAreasPageContent(), loadAreaItems()])

  return (
    <main>
      <AreasPage content={content} layout={layout} areas={areas} />
    </main>
  )
}
