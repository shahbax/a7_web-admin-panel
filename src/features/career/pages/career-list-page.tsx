import type { Metadata } from "next"

import { CareerPage } from "@/features/career/ui/career"
import { loadCareerOpenings, loadCareerPageContent } from "@/features/career/services/career-content"

export async function generateCareerListMetadata(): Promise<Metadata> {
  const { content } = await loadCareerPageContent()
  return { title: content.seo.title, description: content.seo.description }
}

export async function CareerListPage() {
  const [{ content, layout }, openings] = await Promise.all([loadCareerPageContent(), loadCareerOpenings()])
  return <CareerPage content={content} layout={layout} openings={openings} />
}
