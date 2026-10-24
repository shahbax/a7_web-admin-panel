import type { Metadata } from "next"

import { DevelopersPage } from "@/features/developer/ui/developers"
import {
  loadDevelopers,
  loadDevelopersPageContent,
} from "@/features/developer/services/developer-content"

export async function generateDevelopersListMetadata(): Promise<Metadata> {
  const { content } = await loadDevelopersPageContent()
  return { title: content.seo.title, description: content.seo.description }
}

export async function DevelopersListPage() {
  const [{ content, layout }, developers] = await Promise.all([
    loadDevelopersPageContent(),
    loadDevelopers(),
  ])

  return (
    <main className="bg-white">
      <DevelopersPage content={content} layout={layout} developers={developers} />
    </main>
  )
}
