import type { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"

import { BlockRenderer } from "@/features/cms/blocks/block-renderer"
import {
  getAllPublishedSlugs,
  getDraftPage,
  getPublishedPage,
} from "@/features/cms/pages/services/page-service"
import { getSettings } from "@/features/cms/settings/service"

export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map((slug) => ({ slug: slug.split("/") }))
}

async function resolve(slugParts: string[]) {
  const slug = slugParts.join("/")
  const { isEnabled } = await draftMode()
  return isEnabled ? getDraftPage(slug) : getPublishedPage(slug)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await resolve(slug)
  if (!page) return {}
  const { seo } = await getSettings()
  const title = page.seoTitle || page.title
  const description = page.seoDescription || seo.defaultDescription
  const image = page.ogImageUrl || seo.ogImageUrl || undefined
  return {
    title,
    description,
    openGraph: { title, description, images: image ? [image] : undefined },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  }
}

export default async function CmsCatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const page = await resolve(slug)
  if (!page) notFound()
  return (
    <main>
      <BlockRenderer blocks={page.blocks} />
    </main>
  )
}
