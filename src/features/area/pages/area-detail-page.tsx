import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AreaDetailPage } from "@/features/area/ui/area-detail/area-detail-page"
import { loadAreaDetail, loadAreaIds } from "@/features/area/services/area-content"
import { loadDeveloperCtaContent } from "@/features/home/services/shared-cta-content"

type AreaDetailPageProps = {
  params: Promise<{ id: string }>
}

export async function generateAreaDetailStaticParams() {
  return (await loadAreaIds()).map((id) => ({ id }))
}

export async function generateAreaDetailMetadata({ params }: AreaDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const area = await loadAreaDetail(id)

  if (!area) {
    return { title: "Area not found | A Seven Properties" }
  }

  return { title: area.seo.title, description: area.seo.description }
}

export async function AreaDetailRoutePage({ params }: AreaDetailPageProps) {
  const { id } = await params
  const area = await loadAreaDetail(id)

  if (!area) {
    notFound()
  }

  return (
    <main className="bg-white">
      <AreaDetailPage area={area} newsletter={(await loadDeveloperCtaContent()).home} />
    </main>
  )
}
