import type { Metadata } from "next"

import { ShortTermRentalsPage } from "@/features/services/ui/short-term-rentals"
import { loadShortTermRentalsContent } from "@/features/services/services/content"

export async function generateShortTermRentalsMetadata(): Promise<Metadata> {
  const { content } = await loadShortTermRentalsContent()
  return { title: content.seo.title, description: content.seo.description }
}

export async function ShortTermRentalsPageRoute() {
  const { content, layout } = await loadShortTermRentalsContent()
  return <ShortTermRentalsPage content={content} layout={layout} />
}
