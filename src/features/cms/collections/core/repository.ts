import "server-only"

import type { CollectionItem as PrismaItem } from "@prisma/client"

import { prisma } from "@/shared/lib/db/prisma"

export type CollectionItemDTO = {
  id: string
  collection: string
  slug: string | null
  title: string
  status: "DRAFT" | "PUBLISHED"
  data: Record<string, unknown>
  order: number
  updatedAt: string
}

function toDTO(row: PrismaItem): CollectionItemDTO {
  return {
    id: row.id,
    collection: row.collection,
    slug: row.slug,
    title: row.title,
    status: row.status,
    data: (row.data as Record<string, unknown>) ?? {},
    order: row.order,
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function listItems(
  collection: string,
  opts: { search?: string; status?: "DRAFT" | "PUBLISHED" } = {},
): Promise<CollectionItemDTO[]> {
  const rows = await prisma.collectionItem.findMany({
    where: {
      collection,
      status: opts.status,
      title: opts.search ? { contains: opts.search, mode: "insensitive" } : undefined,
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  })
  return rows.map(toDTO)
}

export async function listPublishedItems(collection: string): Promise<CollectionItemDTO[]> {
  return listItems(collection, { status: "PUBLISHED" })
}

export async function getItem(id: string): Promise<CollectionItemDTO | null> {
  const row = await prisma.collectionItem.findUnique({ where: { id } })
  return row ? toDTO(row) : null
}

export async function createItem(input: {
  collection: string
  title: string
  slug?: string | null
  userId?: string
}): Promise<CollectionItemDTO> {
  const max = await prisma.collectionItem.aggregate({
    where: { collection: input.collection },
    _max: { order: true },
  })
  const row = await prisma.collectionItem.create({
    data: {
      collection: input.collection,
      title: input.title,
      slug: input.slug ?? null,
      data: {},
      order: (max._max.order ?? 0) + 1,
      createdById: input.userId ?? null,
    },
  })
  return toDTO(row)
}

export async function updateItem(
  id: string,
  data: { title?: string; slug?: string | null; data?: Record<string, unknown> },
): Promise<void> {
  await prisma.collectionItem.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      data: data.data as object | undefined,
    },
  })
}

export async function setItemStatus(id: string, status: "DRAFT" | "PUBLISHED"): Promise<void> {
  await prisma.collectionItem.update({ where: { id }, data: { status } })
}

export async function deleteItem(id: string): Promise<string | null> {
  const row = await prisma.collectionItem.findUnique({ where: { id } })
  if (!row) return null
  await prisma.collectionItem.delete({ where: { id } })
  return row.collection
}

export async function moveItem(id: string, direction: "up" | "down"): Promise<void> {
  const item = await prisma.collectionItem.findUnique({ where: { id } })
  if (!item) return
  const neighbor = await prisma.collectionItem.findFirst({
    where: {
      collection: item.collection,
      order: direction === "up" ? { lt: item.order } : { gt: item.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  })
  if (!neighbor) return
  await prisma.$transaction([
    prisma.collectionItem.update({ where: { id: item.id }, data: { order: neighbor.order } }),
    prisma.collectionItem.update({ where: { id: neighbor.id }, data: { order: item.order } }),
  ])
}

export async function countByCollection(): Promise<Record<string, number>> {
  const rows = await prisma.collectionItem.groupBy({
    by: ["collection"],
    _count: { _all: true },
  })
  const out: Record<string, number> = {}
  for (const r of rows) out[r.collection] = r._count._all
  return out
}
