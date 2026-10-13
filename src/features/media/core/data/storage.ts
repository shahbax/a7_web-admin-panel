import { randomUUID } from "node:crypto"
import { mkdir, writeFile, unlink } from "node:fs/promises"
import path from "node:path"

import sharp from "sharp"

import type { MediaKind } from "@/features/media/core/domain/entity"
import { MAX_UPLOAD_BYTES, UPLOADS_ROOT } from "@/shared/lib/uploads/config"

export { MAX_UPLOAD_BYTES, UPLOADS_ROOT }

const ALLOWED_MIME: Record<string, MediaKind> = {
  "image/jpeg": "IMAGE",
  "image/png": "IMAGE",
  "image/webp": "IMAGE",
  "image/gif": "IMAGE",
  "image/avif": "IMAGE",
  "image/svg+xml": "IMAGE",
  "video/mp4": "VIDEO",
  "video/webm": "VIDEO",
  "application/pdf": "PDF",
}

export function kindForMime(mime: string): MediaKind | null {
  return ALLOWED_MIME[mime] ?? null
}

export function sanitizeBaseName(name: string): string {
  const base = path.basename(name)
  const ext = path.extname(base)
  const stem = base
    .slice(0, base.length - ext.length)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60)
  const safeExt = ext.toLowerCase().replace(/[^a-z0-9.]/g, "")
  return `${stem || "file"}${safeExt}`
}

export type StoredFile = {
  filename: string
  relativePath: string // e.g. "2026/10/uuid-name.jpg"
  url: string // e.g. "/uploads/2026/10/uuid-name.jpg"
  width: number | null
  height: number | null
  size: number
}

/**
 * Persist an uploaded file to the uploads directory, organised by year/month.
 * Returns metadata for the MediaAsset row. Images get their dimensions read via
 * sharp (SVGs are stored as-is without dimension probing).
 */
export async function storeUpload(
  file: File,
  kind: MediaKind,
): Promise<StoredFile> {
  const buffer = Buffer.from(await file.arrayBuffer())

  const now = new Date()
  const year = String(now.getUTCFullYear())
  const month = String(now.getUTCMonth() + 1).padStart(2, "0")
  const dir = path.join(UPLOADS_ROOT, year, month)
  await mkdir(dir, { recursive: true })

  const filename = `${randomUUID()}-${sanitizeBaseName(file.name)}`
  const absPath = path.join(dir, filename)
  await writeFile(absPath, buffer)

  let width: number | null = null
  let height: number | null = null
  if (kind === "IMAGE" && file.type !== "image/svg+xml") {
    try {
      const meta = await sharp(buffer).metadata()
      width = meta.width ?? null
      height = meta.height ?? null
    } catch {
      // dimension probing is best-effort
    }
  }

  const relativePath = path.posix.join(year, month, filename)
  return {
    filename,
    relativePath,
    url: `/uploads/${relativePath}`,
    width,
    height,
    size: buffer.byteLength,
  }
}

/** Delete a stored file from disk. Best-effort — a missing file is not an error. */
export async function removeUpload(relativePath: string): Promise<void> {
  // Resolve inside UPLOADS_ROOT and refuse to escape it.
  const absPath = path.resolve(UPLOADS_ROOT, relativePath)
  if (!absPath.startsWith(UPLOADS_ROOT + path.sep)) return
  try {
    await unlink(absPath)
  } catch {
    // already gone
  }
}
