import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CareerJobDetailPage } from "@/features/career/ui/career"
import { loadCareerJob, loadCareerJobIds } from "@/features/career/services/career-content"
import { loadDeveloperCtaContent } from "@/features/home/services/shared-cta-content"

type CareerJobDetailPageProps = {
  params: Promise<{ id: string }>
}

export async function generateCareerJobDetailStaticParams() {
  return (await loadCareerJobIds()).map((id) => ({ id }))
}

export async function generateCareerJobDetailMetadata({
  params,
}: CareerJobDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const job = await loadCareerJob(id)

  if (!job) return { title: "Job not found | A Seven Properties" }

  return { title: job.seo.title, description: job.seo.description }
}

export async function CareerJobDetailPageRoute({ params }: CareerJobDetailPageProps) {
  const { id } = await params
  const job = await loadCareerJob(id)
  if (!job) notFound()

  return <CareerJobDetailPage job={job} newsletter={(await loadDeveloperCtaContent()).home} />
}
