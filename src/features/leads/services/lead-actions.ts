"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"

import { requireUser } from "@/features/auth/services/guards"
import {
  createLead,
  deleteLead,
  recentLeadCountByIp,
  setLeadHandled,
} from "@/features/leads/core/repository"
import { notifyNewLead } from "@/features/leads/services/mailer"

export type LeadFormState = { error?: string; ok?: boolean }

const RATE_WINDOW_MIN = 10
const RATE_MAX = 10

const leadSchema = z.object({
  type: z.string().min(1).max(40),
  name: z.string().trim().max(160).optional(),
  email: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(60).optional(),
  message: z.string().trim().max(4000).optional(),
  reference: z.string().trim().max(200).optional(),
  sourceUrl: z.string().trim().max(500).optional(),
})

async function clientIp(): Promise<string> {
  const h = await headers()
  const fwd = h.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0]!.trim()
  return h.get("x-real-ip") ?? "unknown"
}

/** Public form submission. Honeypot + per-IP rate limit; always safe to call. */
export async function submitLeadAction(
  _prev: LeadFormState,
  form: FormData,
): Promise<LeadFormState> {
  // Honeypot — bots fill hidden "company" field.
  if (String(form.get("company") ?? "").trim() !== "") {
    return { ok: true } // silently accept, drop
  }

  const parsed = leadSchema.safeParse({
    type: form.get("type") ?? "contact",
    name: form.get("name") ?? undefined,
    email: form.get("email") ?? undefined,
    phone: form.get("phone") ?? undefined,
    message: form.get("message") ?? undefined,
    reference: form.get("reference") ?? undefined,
    sourceUrl: form.get("sourceUrl") ?? undefined,
  })
  if (!parsed.success) return { error: "Please check the form and try again." }

  const data = parsed.data
  if (!data.email && !data.phone) {
    return { error: "Please provide an email or phone number." }
  }

  const ip = await clientIp()
  if ((await recentLeadCountByIp(ip, RATE_WINDOW_MIN)) >= RATE_MAX) {
    return { error: "Too many submissions. Please try again later." }
  }

  // Collect any extra fields as payload.
  const known = new Set(["type", "name", "email", "phone", "message", "reference", "sourceUrl", "company"])
  const payload: Record<string, unknown> = {}
  for (const [key, value] of form.entries()) {
    if (!known.has(key)) payload[key] = typeof value === "string" ? value : "(file)"
  }

  const lead = await createLead({
    type: data.type,
    name: data.name ?? null,
    email: data.email ?? null,
    phone: data.phone ?? null,
    message: data.message ?? null,
    reference: data.reference ?? null,
    sourceUrl: data.sourceUrl ?? null,
    payload: Object.keys(payload).length ? payload : null,
    ip,
  })

  // TODO (integrations phase): also create a Bitrix24 lead (crm.lead.add).
  await notifyNewLead(lead)

  return { ok: true }
}

export async function markLeadHandledAction(
  _prev: LeadFormState,
  form: FormData,
): Promise<LeadFormState> {
  await requireUser()
  const id = String(form.get("id") ?? "")
  const handled = String(form.get("handled") ?? "true") === "true"
  if (!id) return { error: "Missing id." }
  await setLeadHandled(id, handled)
  revalidatePath("/admin/leads")
  return { ok: true }
}

export async function deleteLeadAction(
  _prev: LeadFormState,
  form: FormData,
): Promise<LeadFormState> {
  await requireUser()
  const id = String(form.get("id") ?? "")
  if (!id) return { error: "Missing id." }
  await deleteLead(id)
  revalidatePath("/admin/leads")
  return { ok: true }
}
