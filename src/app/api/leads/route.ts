import type { NextRequest } from "next/server"

import { submitLeadAction } from "@/features/leads/services/lead-actions"

/**
 * Progressive-enhancement endpoint for any public form (or non-React client).
 * Accepts JSON or form-encoded bodies and reuses the same validated, rate-
 * limited submit path as the server action.
 */
export async function POST(request: NextRequest) {
  const form = new FormData()
  const contentType = request.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
    for (const [k, v] of Object.entries(body)) form.set(k, String(v ?? ""))
  } else {
    const incoming = await request.formData()
    // Files are only kept for career applications (CVs); see storeLeadFiles.
    for (const [k, v] of incoming.entries()) form.append(k, v)
  }

  const result = await submitLeadAction({}, form)
  return Response.json(result, { status: result.error ? 400 : 200 })
}
