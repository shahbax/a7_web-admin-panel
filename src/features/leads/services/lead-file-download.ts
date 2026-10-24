import "server-only"

import { getCurrentUser } from "@/features/auth/services/guards"
import { readLeadFile } from "@/features/leads/core/lead-files"

const TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpg: "image/jpeg",
  png: "image/png",
}

/** Admin-only download of a file attached to a lead (e.g. a CV). */
export async function downloadLeadFile(request: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!(await getCurrentUser())) return new Response("Not found", { status: 404 })
  const { name } = await params
  const file = await readLeadFile(name)
  if (!file) return new Response("Not found", { status: 404 })
  const ext = name.split(".").pop() ?? ""
  const download = new URL(request.url).searchParams.get("filename") ?? name
  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": TYPES[ext] ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${download.replace(/[^\w.\- ]+/g, "_")}"`,
      "Cache-Control": "private, no-store",
    },
  })
}
