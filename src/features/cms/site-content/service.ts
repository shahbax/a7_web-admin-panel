import "server-only"

import { cache } from "react"
import { draftMode } from "next/headers"
import { revalidatePath } from "next/cache"
import type { Prisma } from "@prisma/client"

import { prisma } from "@/shared/lib/db/prisma"
import { mergeContent, toEditable, type JsonValue } from "@/features/cms/site-content/core/merge"
import { resolveLayout } from "@/features/cms/site-content/core/sections"
import type {
  ContentDefinitionInfo,
  SectionLayout,
  StoredContent,
} from "@/features/cms/site-content/core/types"
import { getContentDefinition, toDefinitionInfo } from "@/features/cms/site-content/registry"

const MAX_VERSIONS = 20

type DocRow = {
  key: string
  draft: unknown
  published: unknown
  publishedAt: Date | null
  updatedAt: Date
}

const loadDoc = cache(async (key: string): Promise<DocRow | null> => {
  try {
    return await prisma.contentDoc.findUnique({ where: { key } })
  } catch {
    // Database unreachable (e.g. CI build): fall back to code defaults.
    return null
  }
})

async function isDraftMode(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled
  } catch {
    // Outside a request (build-time generateStaticParams): published content.
    return false
  }
}

function asStored(value: unknown): StoredContent {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as StoredContent) : {}
}

function requireDefinition(key: string) {
  const def = getContentDefinition(key)
  if (!def) throw new Error(`Unknown content key "${key}"`)
  return def
}

async function storedFor(key: string): Promise<StoredContent> {
  const doc = await loadDoc(key)
  if (!doc) return {}
  return asStored((await isDraftMode()) ? doc.draft : doc.published)
}

/** The page's content: admin edits (published, or draft in preview) over code defaults. */
export async function getContent<T>(key: string): Promise<T> {
  const def = requireDefinition(key)
  const stored = await storedFor(key)
  return mergeContent(def.defaults() as T, stored.content)
}

/** Ordered, visible sections for a page. */
export async function getSectionLayout(key: string): Promise<SectionLayout> {
  const def = requireDefinition(key)
  const stored = await storedFor(key)
  return resolveLayout(def.kind === "single" ? (def.sections ?? []) : [], stored.layout)
}

export async function getPageContent<T>(key: string): Promise<{ content: T; layout: SectionLayout }> {
  const [content, layout] = await Promise.all([getContent<T>(key), getSectionLayout(key)])
  return { content, layout }
}

/** Items of a list dataset (areas, developers…). */
export async function getContentList<T>(key: string): Promise<T[]> {
  const items = await getContent<T[]>(key)
  return Array.isArray(items) ? items : []
}

/** One item of a list dataset by its id field. */
export async function getContentItem<T>(key: string, id: string): Promise<T | undefined> {
  const def = requireDefinition(key)
  if (def.kind !== "list") return undefined
  const items = await getContentList<Record<string, unknown>>(key)
  return items.find((item) => String(item[def.idField]) === id) as T | undefined
}

/** Ids of a list dataset, for generateStaticParams. */
export async function getContentItemIds(key: string): Promise<string[]> {
  const def = requireDefinition(key)
  if (def.kind !== "list") return []
  const items = await getContentList<Record<string, unknown>>(key)
  return items.map((item) => String(item[def.idField])).filter(Boolean)
}

// ----------------------------------------------------------------------------
// Admin side
// ----------------------------------------------------------------------------

export type ContentEditState = {
  info: ContentDefinitionInfo
  /** Code defaults as editable JSON (templates for new list items). */
  defaults: JsonValue
  /** Current draft (falls back to published, then defaults). */
  value: JsonValue
  layout: SectionLayout
  hasUnpublishedChanges: boolean
  isCustomized: boolean
  publishedAt: string | null
  updatedAt: string | null
}

export async function getContentForEdit(key: string): Promise<ContentEditState | null> {
  const def = getContentDefinition(key)
  if (!def) return null
  const doc = await prisma.contentDoc.findUnique({ where: { key } })
  const draft = asStored(doc?.draft)
  const defaults = def.defaults()
  return {
    info: toDefinitionInfo(def),
    defaults: toEditable(defaults) ?? null,
    value: toEditable(mergeContent(defaults, draft.content)) ?? null,
    layout: resolveLayout(def.kind === "single" ? (def.sections ?? []) : [], draft.layout),
    hasUnpublishedChanges: !!doc && JSON.stringify(doc.draft) !== JSON.stringify(doc.published ?? {}),
    isCustomized: !!doc?.published && Object.keys(asStored(doc.published)).length > 0,
    publishedAt: doc?.publishedAt?.toISOString() ?? null,
    updatedAt: doc?.updatedAt.toISOString() ?? null,
  }
}

/** Normalises and stores a draft. Values that don't fit the page's shape are dropped. */
export async function saveContentDraft(
  key: string,
  input: { content: unknown; layout?: unknown },
  userId?: string,
): Promise<void> {
  const def = requireDefinition(key)
  const defaults = def.defaults()
  const content = toEditable(mergeContent(defaults, input.content)) ?? null
  const draft: StoredContent = { content }
  if (def.kind === "single" && def.sections?.length) {
    draft.layout = resolveLayout(def.sections, input.layout)
  }
  const json = draft as unknown as Prisma.InputJsonValue
  await prisma.contentDoc.upsert({
    where: { key },
    create: { key, draft: json, updatedById: userId ?? null },
    update: { draft: json, updatedById: userId ?? null },
  })
}

export async function publishContent(key: string, userId?: string): Promise<void> {
  requireDefinition(key)
  const doc = await prisma.contentDoc.findUnique({ where: { key } })
  if (!doc) return
  const data = doc.draft as Prisma.InputJsonValue
  await prisma.$transaction(async (tx) => {
    await tx.contentDoc.update({
      where: { key },
      data: { published: data, publishedAt: new Date(), updatedById: userId ?? null },
    })
    await tx.version.create({
      data: { entityType: "content", entityId: key, data, createdById: userId ?? null },
    })
    const old = await tx.version.findMany({
      where: { entityType: "content", entityId: key },
      orderBy: { createdAt: "desc" },
      skip: MAX_VERSIONS,
      select: { id: true },
    })
    if (old.length > 0) await tx.version.deleteMany({ where: { id: { in: old.map((v) => v.id) } } })
  })
  revalidatePath("/", "layout")
}

export async function discardContentDraft(key: string): Promise<void> {
  const doc = await prisma.contentDoc.findUnique({ where: { key } })
  if (!doc) return
  await prisma.contentDoc.update({
    where: { key },
    data: { draft: (doc.published ?? {}) as Prisma.InputJsonValue },
  })
}

/** Puts the original (code) content into the draft; publish to make it live. */
export async function resetContentDraft(key: string, userId?: string): Promise<void> {
  requireDefinition(key)
  await prisma.contentDoc.upsert({
    where: { key },
    create: { key, draft: {}, updatedById: userId ?? null },
    update: { draft: {}, updatedById: userId ?? null },
  })
}

export type ContentVersionSummary = { id: string; createdAt: string }

export async function listContentVersions(key: string): Promise<ContentVersionSummary[]> {
  const rows = await prisma.version.findMany({
    where: { entityType: "content", entityId: key },
    orderBy: { createdAt: "desc" },
    take: MAX_VERSIONS,
    select: { id: true, createdAt: true },
  })
  return rows.map((r) => ({ id: r.id, createdAt: r.createdAt.toISOString() }))
}

/** Loads a published version into the draft. */
export async function restoreContentVersion(key: string, versionId: string): Promise<boolean> {
  const version = await prisma.version.findUnique({ where: { id: versionId } })
  if (!version || version.entityType !== "content" || version.entityId !== key) return false
  await prisma.contentDoc.update({
    where: { key },
    data: { draft: version.data as Prisma.InputJsonValue },
  })
  return true
}

export async function listContentStatuses(): Promise<
  Record<string, { customized: boolean; unpublished: boolean; updatedAt: string }>
> {
  const rows = await prisma.contentDoc.findMany({
    select: { key: true, draft: true, published: true, updatedAt: true },
  })
  return Object.fromEntries(
    rows.map((r) => [
      r.key,
      {
        customized: !!r.published && Object.keys(asStored(r.published)).length > 0,
        unpublished: JSON.stringify(r.draft) !== JSON.stringify(r.published ?? {}),
        updatedAt: r.updatedAt.toISOString(),
      },
    ]),
  )
}
