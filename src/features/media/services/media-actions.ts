"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { requireUser } from "@/features/auth/services/guards"
import { recordAudit } from "@/shared/lib/audit/audit-log"
import { mediaRepository } from "@/features/media/core/data/repository/media.repository"
import {
  MAX_UPLOAD_BYTES,
  kindForMime,
  removeUpload,
  storeUpload,
} from "@/features/media/core/data/storage"

export type MediaActionState = {
  error?: string
  ok?: boolean
}

const folderSchema = z
  .string()
  .trim()
  .max(120)
  .regex(/^[a-zA-Z0-9 _\-/]*$/, "Folders may use letters, numbers, spaces, - _ and /")
  .transform((v) => v.replace(/^\/+|\/+$/g, ""))

export async function uploadMediaAction(
  _prev: MediaActionState,
  formData: FormData,
): Promise<MediaActionState> {
  const user = await requireUser()

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." }
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: "File is too large (max 50 MB)." }
  }

  const kind = kindForMime(file.type)
  if (!kind) {
    return { error: `Unsupported file type: ${file.type || "unknown"}.` }
  }

  const alt = String(formData.get("alt") ?? "").trim()
  if (kind === "IMAGE" && alt.length === 0) {
    return { error: "Alt text is required for images (for accessibility)." }
  }

  const folderParsed = folderSchema.safeParse(formData.get("folder") ?? "")
  if (!folderParsed.success) {
    return { error: folderParsed.error.issues[0]?.message ?? "Invalid folder." }
  }

  let stored
  try {
    stored = await storeUpload(file, kind)
  } catch (error) {
    console.error("[media] upload failed", error)
    return { error: "Could not save the file. Try again." }
  }

  const asset = await mediaRepository.create({
    filename: stored.filename,
    originalName: file.name,
    path: stored.relativePath,
    url: stored.url,
    mimeType: file.type,
    kind,
    size: stored.size,
    width: stored.width,
    height: stored.height,
    alt,
    folder: folderParsed.data,
    uploadedById: user.id,
  })

  await recordAudit({
    userId: user.id,
    userEmail: user.email,
    action: "media.upload",
    entityType: "MediaAsset",
    entityId: asset.id,
    summary: `Uploaded ${asset.originalName}`,
  })

  revalidatePath("/admin/media")
  return { ok: true }
}

const updateSchema = z.object({
  id: z.string().min(1),
  alt: z.string().trim().max(300),
  folder: folderSchema,
})

export async function updateMediaAction(
  _prev: MediaActionState,
  formData: FormData,
): Promise<MediaActionState> {
  const user = await requireUser()
  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    alt: formData.get("alt") ?? "",
    folder: formData.get("folder") ?? "",
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  await mediaRepository.update(parsed.data.id, {
    alt: parsed.data.alt,
    folder: parsed.data.folder,
  })
  await recordAudit({
    userId: user.id,
    userEmail: user.email,
    action: "media.update",
    entityType: "MediaAsset",
    entityId: parsed.data.id,
    summary: "Updated media metadata",
  })

  revalidatePath("/admin/media")
  return { ok: true }
}

export async function deleteMediaAction(
  _prev: MediaActionState,
  formData: FormData,
): Promise<MediaActionState> {
  const user = await requireUser()
  const id = String(formData.get("id") ?? "")
  if (!id) return { error: "Missing media id." }

  const asset = await mediaRepository.delete(id)
  if (asset) {
    await removeUpload(asset.path)
    await recordAudit({
      userId: user.id,
      userEmail: user.email,
      action: "media.delete",
      entityType: "MediaAsset",
      entityId: id,
      summary: `Deleted ${asset.originalName}`,
    })
  }

  revalidatePath("/admin/media")
  return { ok: true }
}

export type PickerMedia = { id: string; url: string; alt: string; name: string }

/** Images for the content editor's media picker. */
export async function listPickerMediaAction(search: string): Promise<PickerMedia[]> {
  await requireUser()
  const items = await mediaRepository.list({ kind: "IMAGE", search: search.trim() || undefined })
  return items.slice(0, 120).map((m) => ({ id: m.id, url: m.url, alt: m.alt, name: m.originalName }))
}

/** Upload straight from the content editor; returns the new image URL. */
export async function quickUploadImageAction(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image." }
  if (kindForMime(file.type) !== "IMAGE") return { error: "Only images can be used here." }
  if (!formData.get("alt")) formData.set("alt", file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "))
  formData.set("folder", String(formData.get("folder") ?? "content"))
  const res = await uploadMediaAction({}, formData)
  if (res.error) return { error: res.error }
  const [latest] = await mediaRepository.list({ kind: "IMAGE", search: file.name })
  return latest ? { url: latest.url } : { error: "Uploaded, but could not find the file." }
}
