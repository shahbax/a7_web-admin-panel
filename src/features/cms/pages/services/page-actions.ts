"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { requireUser } from "@/features/auth/services/guards"
import { recordAudit } from "@/shared/lib/audit/audit-log"
import { getBlockDefinition } from "@/features/cms/blocks/registry"
import type { Block } from "@/features/cms/blocks/types"
import {
  createPage,
  deletePage,
  isReservedSlugOrExists,
  publishPage,
  restorePageVersion,
  unpublishPage,
  updatePageDraft,
} from "@/features/cms/pages/services/page-service"

export type PageActionState = { error?: string; ok?: boolean }

const blockSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  props: z.record(z.string(), z.unknown()),
  visible: z.boolean(),
})
const blocksSchema = z.array(blockSchema).max(100)

function sanitizeBlocks(input: unknown): Block[] | null {
  const parsed = blocksSchema.safeParse(input)
  if (!parsed.success) return null
  // Drop blocks whose type is not registered.
  return parsed.data.filter((b) => getBlockDefinition(b.type)) as Block[]
}

export async function createPageAction(
  _prev: PageActionState,
  form: FormData,
): Promise<PageActionState> {
  const user = await requireUser()
  const title = String(form.get("title") ?? "").trim()
  const slugInput = String(form.get("slug") ?? "").trim()
  const template = String(form.get("template") ?? "default")
  if (!title) return { error: "Enter a page title." }

  const result = await createPageSafe({ title, slugInput, template, userId: user.id })
  if ("error" in result) return { error: result.error }

  await recordAudit({
    userId: user.id,
    userEmail: user.email,
    action: "page.create",
    entityType: "Page",
    entityId: result.id,
    summary: `Created page "${title}"`,
  })
  redirect(`/admin/pages/${result.id}`)
}

async function createPageSafe(input: {
  title: string
  slugInput: string
  template: string
  userId: string
}): Promise<{ id: string } | { error: string }> {
  const { normalizeSlug } = await import("@/features/cms/pages/core/entity")
  const slug = normalizeSlug(input.slugInput || input.title)
  if (!slug) return { error: "Could not derive a valid slug." }
  const conflict = await isReservedSlugOrExists(slug)
  if (conflict) return { error: `The slug "${slug}" is reserved or already in use.` }
  const page = await createPage({ slug, title: input.title, template: input.template, userId: input.userId })
  return { id: page.id }
}

export async function savePageDraftAction(
  _prev: PageActionState,
  form: FormData,
): Promise<PageActionState> {
  const user = await requireUser()
  const id = String(form.get("id") ?? "")
  if (!id) return { error: "Missing page id." }

  let blocksJson: unknown
  try {
    blocksJson = JSON.parse(String(form.get("blocks") ?? "[]"))
  } catch {
    return { error: "Invalid block data." }
  }
  const blocks = sanitizeBlocks(blocksJson)
  if (!blocks) return { error: "Block data failed validation." }

  await updatePageDraft(id, {
    title: String(form.get("title") ?? "").trim() || undefined,
    template: String(form.get("template") ?? "") || undefined,
    seoTitle: String(form.get("seoTitle") ?? "") || null,
    seoDescription: String(form.get("seoDescription") ?? "") || null,
    ogImageUrl: String(form.get("ogImageUrl") ?? "") || null,
    blocks,
  })
  await recordAudit({
    userId: user.id,
    userEmail: user.email,
    action: "page.save_draft",
    entityType: "Page",
    entityId: id,
    summary: "Saved draft",
  })
  return { ok: true }
}

export async function publishPageAction(
  _prev: PageActionState,
  form: FormData,
): Promise<PageActionState> {
  const user = await requireUser()
  const id = String(form.get("id") ?? "")
  const slug = await publishPage(id, user.id)
  if (!slug) return { error: "Could not publish page." }
  revalidatePath(`/${slug}`)
  await recordAudit({
    userId: user.id,
    userEmail: user.email,
    action: "page.publish",
    entityType: "Page",
    entityId: id,
    summary: `Published /${slug}`,
  })
  return { ok: true }
}

export async function unpublishPageAction(
  _prev: PageActionState,
  form: FormData,
): Promise<PageActionState> {
  const user = await requireUser()
  const id = String(form.get("id") ?? "")
  const slug = await unpublishPage(id)
  if (slug) revalidatePath(`/${slug}`)
  await recordAudit({
    userId: user.id,
    userEmail: user.email,
    action: "page.unpublish",
    entityType: "Page",
    entityId: id,
    summary: slug ? `Unpublished /${slug}` : "Unpublished page",
  })
  return { ok: true }
}

export async function deletePageAction(
  _prev: PageActionState,
  form: FormData,
): Promise<PageActionState> {
  const user = await requireUser()
  const id = String(form.get("id") ?? "")
  const slug = await deletePage(id)
  if (!slug) return { error: "This page cannot be deleted." }
  revalidatePath(`/${slug}`)
  await recordAudit({
    userId: user.id,
    userEmail: user.email,
    action: "page.delete",
    entityType: "Page",
    entityId: id,
    summary: `Deleted /${slug}`,
  })
  redirect("/admin/pages")
}

export async function restorePageVersionAction(
  _prev: PageActionState,
  form: FormData,
): Promise<PageActionState> {
  await requireUser()
  const id = String(form.get("id") ?? "")
  const versionId = String(form.get("versionId") ?? "")
  const ok = await restorePageVersion(id, versionId)
  if (!ok) return { error: "Could not restore that version." }
  return { ok: true }
}
