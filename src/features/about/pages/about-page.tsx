import type { Metadata } from "next"

import { AboutPage } from "@/features/about/ui/about"
import { loadAboutContent } from "@/features/about/services/about-content"

export async function generateAboutMetadata(): Promise<Metadata> {
  const { content } = await loadAboutContent()
  return { title: content.seo.title, description: content.seo.description }
}

export async function AboutPageRoute() {
  const { content, layout } = await loadAboutContent()
  return <AboutPage content={content} layout={layout} />
}
