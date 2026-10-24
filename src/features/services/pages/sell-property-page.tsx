import type { Metadata } from "next"

import { SellPropertyForm, SellPropertyHeroPanel } from "@/features/services/ui/sell-property"
import { loadSellPropertyContent } from "@/features/services/services/content"
import { MarketingSplitLayout } from "@/shared/ui/marketing"

export async function generateSellPropertyMetadata(): Promise<Metadata> {
  const { content } = await loadSellPropertyContent()
  const metadata: Metadata = {}
  if (content.seo.title.trim()) metadata.title = content.seo.title
  if (content.seo.description.trim()) metadata.description = content.seo.description
  return metadata
}

/** Same markup as QuickPagesLayout, with the side panel fed from CMS content. */
export async function SellPropertyPage() {
  const { content } = await loadSellPropertyContent()
  return (
    <MarketingSplitLayout sidePanel={<SellPropertyHeroPanel content={content.heroPanel} />}>
      <SellPropertyForm content={content.form} />
    </MarketingSplitLayout>
  )
}
