import "server-only"

import { randomUUID } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import { UPLOADS_ROOT } from "@/shared/lib/uploads/config"

/** Private folder for files attached to leads (CVs). Never served publicly. */
export const LEAD_FILES_ROOT = path.join(path.dirname(UPLOADS_ROOT), "lead-files")

const MAX_FILE_BYTES = 10 * 1024 * 1024
const MAX_FILES = 3
const ALLOWED: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "image/jpeg": ".jpg",
  "image/png": ".png",
}

export type StoredLeadFile = { name: string; stored: string; size: number }

const STORED_NAME = /^[0-9a-f-]{36}\.(pdf|docx?|jpg|png)$/

export async function storeLeadFiles(files: File[]): Promise<{ files: StoredLeadFile[]; error?: string }> {
  const picked = files.filter((f) => f.size > 0).slice(0, MAX_FILES)
  for (const f of picked) {
    if (!ALLOWED[f.type]) return { files: [], error: "Please upload PDF, Word or image files only." }
    if (f.size > MAX_FILE_BYTES) return { files: [], error: "Each file must be 10 MB or smaller." }
  }
  await mkdir(LEAD_FILES_ROOT, { recursive: true })
  const stored: StoredLeadFile[] = []
  for (const f of picked) {
    const name = `${randomUUID()}${ALLOWED[f.type]}`
    await writeFile(path.join(LEAD_FILES_ROOT, name), Buffer.from(await f.arrayBuffer()))
    stored.push({ name: f.name.slice(0, 200), stored: name, size: f.size })
  }
  return { files: stored }
}

export async function readLeadFile(stored: string): Promise<Buffer | null> {
  if (!STORED_NAME.test(stored)) return null
  try {
    return await readFile(path.join(LEAD_FILES_ROOT, stored))
  } catch {
    return null
  }
}
