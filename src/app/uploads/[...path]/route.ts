import { createReadStream } from "node:fs"
import { stat } from "node:fs/promises"
import path from "node:path"
import type { ReadableStream as NodeWebReadableStream } from "node:stream/web"
import { Readable } from "node:stream"

import type { NextRequest } from "next/server"

import { UPLOADS_ROOT } from "@/shared/lib/uploads/config"

export const runtime = "nodejs"

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params
  const relative = segments.join("/")
  const absPath = path.resolve(UPLOADS_ROOT, relative)

  // Refuse any path that escapes the uploads root.
  if (absPath !== UPLOADS_ROOT && !absPath.startsWith(UPLOADS_ROOT + path.sep)) {
    return new Response("Not found", { status: 404 })
  }

  let fileStat
  try {
    fileStat = await stat(absPath)
  } catch {
    return new Response("Not found", { status: 404 })
  }
  if (!fileStat.isFile()) {
    return new Response("Not found", { status: 404 })
  }

  const ext = path.extname(absPath).toLowerCase()
  const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream"
  const nodeStream = createReadStream(absPath)
  const body = Readable.toWeb(nodeStream) as unknown as NodeWebReadableStream<Uint8Array>

  return new Response(body as unknown as BodyInit, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(fileStat.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
