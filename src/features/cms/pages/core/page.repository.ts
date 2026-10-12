import "server-only"

import type { Page as PrismaPage } from "@prisma/client"

import { prisma } from "@/shared/lib/db/prisma"
import type { Block } from "@/features/cms/blocks/types"
import type {
  PageDetail,
  PageSummary,
  PublishedPage,
} from "@/features/cms/pages/core/entity"

const MAX_VERSIONS = 20

function blocks(value: unknown): Block[] {
  return Array.isArray(value) ? (value as Block[]) : []
}

function toSummary(p: PrismaPage): PageSummary {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    template: p.template,
    status: p.status,
    isSystem: p.isSystem,
    updatedAt: p.updatedAt.toISOString(),
    publishedAt: p.publishedAt?.toISOString() ?? null,
  }
}

function toDetail(p: PrismaPage): PageDetail {
  return {
    ...toSummary(p),
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    ogImageUrl: p.ogImageUrl,
    draft: blocks(p.draft),
    published: p.published == null ? null : blocks(p.published),
  }
}

export async function listPages(): Promise<PageSummary[]> {
  const rows = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } })
  return rows.map(toSummary)
}

export async function getPageById(id: string): Promise<PageDetail | null> {
  const row = await prisma.page.findUnique({ where: { id } })
  return row ? toDetail(row) : null
}

export async function getPageBySlug(slug: string): Promise<PageDetail | null> {
  const row = await prisma.page.findUnique({ where: { slug } })
  return row ? toDetail(row) : null
}

export async function getPublishedPage(slug: string): Promise<PublishedPage | null> {
  const row = await prisma.page.findUnique({ where: { slug } })
  if (!row || row.status !== "PUBLISHED" || row.published == null) return null
  return {
    title: row.title,
    slug: row.slug,
    blocks: blocks(row.published),
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    ogImageUrl: row.ogImageUrl,
  }
}

/** Draft page for preview (draft mode) — uses the working copy regardless of status. */
export async function getDraftPage(slug: string): Promise<PublishedPage | null> {
  const row = await prisma.page.findUnique({ where: { slug } })
  if (!row) return null
  return {
    title: row.title,
    slug: row.slug,
    blocks: blocks(row.draft),
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    ogImageUrl: row.ogImageUrl,
  }
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const rows = await prisma.page.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  })
  return rows.map((r) => r.slug)
}

export async function createPage(input: {
  slug: string
  title: string
  template: string
  userId?: string
}): Promise<PageDetail> {
  const row = await prisma.page.create({
    data: {
      slug: input.slug,
      title: input.title,
      template: input.template,
      status: "DRAFT",
      draft: [],
      createdById: input.userId ?? null,
    },
  })
  return toDetail(row)
}

export async function updatePageDraft(
  id: string,
  data: {
    title?: string
    template?: string
    seoTitle?: string | null
    seoDescription?: string | null
    ogImageUrl?: string | null
    blocks?: Block[]
  },
): Promise<void> {
  await prisma.page.update({
    where: { id },
    data: {
      title: data.title,
      template: data.template,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      ogImageUrl: data.ogImageUrl,
      draft: data.blocks ? (data.blocks as unknown as object) : undefined,
    },
  })
}

export async function publishPage(id: string, userId?: string): Promise<string | null> {
  const page = await prisma.page.findUnique({ where: { id } })
  if (!page) return null
  await prisma.$transaction(async (tx) => {
    await tx.page.update({
      where: { id },
      data: { published: page.draft as object, status: "PUBLISHED", publishedAt: new Date() },
    })
    await tx.version.create({
      data: { entityType: "page", entityId: id, data: page.draft as object, createdById: userId ?? null },
    })
    const old = await tx.version.findMany({
      where: { entityType: "page", entityId: id },
      orderBy: { createdAt: "desc" },
      skip: MAX_VERSIONS,
      select: { id: true },
    })
    if (old.length) await tx.version.deleteMany({ where: { id: { in: old.map((v) => v.id) } } })
  })
  return page.slug
}

export async function unpublishPage(id: string): Promise<string | null> {
  const page = await prisma.page.update({
    where: { id },
    data: { status: "DRAFT" },
  })
  return page.slug
}

export async function deletePage(id: string): Promise<string | null> {
  const page = await prisma.page.findUnique({ where: { id } })
  if (!page || page.isSystem) return null
  await prisma.page.delete({ where: { id } })
  return page.slug
}

export type PageVersionSummary = { id: string; createdAt: string }

export async function listPageVersions(id: string): Promise<PageVersionSummary[]> {
  const rows = await prisma.version.findMany({
    where: { entityType: "page", entityId: id },
    orderBy: { createdAt: "desc" },
    take: MAX_VERSIONS,
  })
  return rows.map((r) => ({ id: r.id, createdAt: r.createdAt.toISOString() }))
}

export async function restorePageVersion(id: string, versionId: string): Promise<boolean> {
  const version = await prisma.version.findUnique({ where: { id: versionId } })
  if (!version || version.entityType !== "page" || version.entityId !== id) return false
  await prisma.page.update({ where: { id }, data: { draft: version.data as object } })
  return true
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const row = await prisma.page.findUnique({ where: { slug }, select: { id: true } })
  return !!row && row.id !== excludeId
}
