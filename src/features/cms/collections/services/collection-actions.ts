"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { requireUser } from "@/features/auth/services/guards"
import { recordAudit } from "@/shared/lib/audit/audit-log"
import { getCollectionDef } from "@/features/cms/collections/registry"
import { normalizeSlug } from "@/features/cms/pages/core/entity"
import {
  createItem,
  deleteItem,
  getItem,
  moveItem,
  setItemStatus,
  updateItem,
} from "@/features/cms/collections/core/repository"

export type CollectionActionState = { error?: string; ok?: boolean }

export async function createItemAction(
  _prev: CollectionActionState,
  form: FormData,
): Promise<CollectionActionState> {
  const user = await requireUser()
  const collection = String(form.get("collection") ?? "")
  const def = getCollectionDef(collection)
  if (!def) return { error: "Unknown collection." }
  const title = String(form.get("title") ?? "").trim()
  if (!title) return { error: `Enter a ${def.singular.toLowerCase()} title.` }
  const slug = def.hasSlug ? normalizeSlug(title) : null
  const item = await createItem({ collection, title, slug, userId: user.id })
  await recordAudit({
    userId: user.id,
    userEmail: user.email,
    action: "collection.create",
    entityType: "CollectionItem",
    entityId: item.id,
    summary: `Created ${def.singular} "${title}"`,
  })
  redirect(`/admin/collections/${collection}/${item.id}`)
}

export async function saveItemAction(
  _prev: CollectionActionState,
  form: FormData,
): Promise<CollectionActionState> {
  const user = await requireUser()
  const id = String(form.get("id") ?? "")
  const collection = String(form.get("collection") ?? "")
  const def = getCollectionDef(collection)
  if (!def || !id) return { error: "Invalid request." }

  let data: Record<string, unknown>
  try {
    data = JSON.parse(String(form.get("data") ?? "{}"))
  } catch {
    return { error: "Invalid field data." }
  }
  const titleValue = data[def.titleField]
  const title = typeof titleValue === "string" && titleValue.trim() ? titleValue.trim() : String(form.get("title") ?? "Untitled")
  const slug = def.hasSlug ? normalizeSlug(String(form.get("slug") ?? "") || title) : null

  await updateItem(id, { title, slug, data })
  await recordAudit({
    userId: user.id,
    userEmail: user.email,
    action: "collection.update",
    entityType: "CollectionItem",
    entityId: id,
    summary: `Updated ${def.singular}`,
  })
  revalidatePath("/", "layout")
  return { ok: true }
}

export async function setStatusAction(
  _prev: CollectionActionState,
  form: FormData,
): Promise<CollectionActionState> {
  await requireUser()
  const id = String(form.get("id") ?? "")
  const status = String(form.get("status") ?? "") as "DRAFT" | "PUBLISHED"
  if (!id || (status !== "DRAFT" && status !== "PUBLISHED")) return { error: "Invalid request." }
  await setItemStatus(id, status)
  revalidatePath("/", "layout")
  return { ok: true }
}

export async function deleteItemAction(
  _prev: CollectionActionState,
  form: FormData,
): Promise<CollectionActionState> {
  const user = await requireUser()
  const id = String(form.get("id") ?? "")
  const collection = await deleteItem(id)
  if (!collection) return { error: "Item not found." }
  await recordAudit({
    userId: user.id,
    userEmail: user.email,
    action: "collection.delete",
    entityType: "CollectionItem",
    entityId: id,
    summary: "Deleted collection item",
  })
  revalidatePath("/", "layout")
  return { ok: true }
}

export async function moveItemAction(
  _prev: CollectionActionState,
  form: FormData,
): Promise<CollectionActionState> {
  await requireUser()
  const id = String(form.get("id") ?? "")
  const direction = String(form.get("direction") ?? "up") as "up" | "down"
  await moveItem(id, direction === "down" ? "down" : "up")
  return { ok: true }
}

export async function getItemData(id: string) {
  await requireUser()
  return getItem(id)
}
