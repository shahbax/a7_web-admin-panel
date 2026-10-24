import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DeveloperDetailPage } from "@/features/developer/ui/developers/developer-detail-page"
import { loadDeveloperDetail, loadDeveloperIds } from "@/features/developer/services/developer-content"
import { loadDeveloperCtaContent } from "@/features/home/services/shared-cta-content"

type DeveloperDetailPageProps = {
  params: Promise<{ id: string }>
}

export async function generateDeveloperDetailStaticParams() {
  return (await loadDeveloperIds()).map((id) => ({ id }))
}

export async function generateDeveloperDetailMetadata({
  params,
}: DeveloperDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const developer = await loadDeveloperDetail(id)

  if (!developer) {
    return { title: "Developer not found | A Seven Properties" }
  }

  return { title: developer.seo.title, description: developer.seo.description }
}

export async function DeveloperDetailPageRoute({ params }: DeveloperDetailPageProps) {
  const { id } = await params
  const developer = await loadDeveloperDetail(id)

  if (!developer) {
    notFound()
  }

  return (
    <main className="bg-white">
      <DeveloperDetailPage developer={developer} newsletter={(await loadDeveloperCtaContent()).home} />
    </main>
  )
}
