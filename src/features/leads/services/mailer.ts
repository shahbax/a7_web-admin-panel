import "server-only"

import nodemailer from "nodemailer"

import type { LeadDTO } from "@/features/leads/core/repository"
import { LEAD_TYPE_LABELS } from "@/features/leads/core/repository"

function getTransport() {
  const host = process.env.SMTP_HOST
  if (!host) return null
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  })
}

/**
 * Email a new-lead notification when SMTP is configured; otherwise log it.
 * Never throws into the submit flow — a lead is always saved regardless.
 */
export async function notifyNewLead(lead: LeadDTO): Promise<void> {
  const to = process.env.LEADS_NOTIFY_TO || process.env.SMTP_USER || process.env.OWNER_EMAIL
  const transport = getTransport()
  if (!transport || !to) {
    console.info(`[leads] new ${lead.type} lead ${lead.id} (email not configured)`)
    return
  }
  const label = LEAD_TYPE_LABELS[lead.type] ?? lead.type
  const lines = [
    `Type: ${label}`,
    lead.name ? `Name: ${lead.name}` : null,
    lead.email ? `Email: ${lead.email}` : null,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.reference ? `Reference: ${lead.reference}` : null,
    lead.sourceUrl ? `Page: ${lead.sourceUrl}` : null,
    lead.message ? `\nMessage:\n${lead.message}` : null,
  ].filter(Boolean)
  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || "A7 Group <info@a7group.com>",
      to,
      subject: `New ${label} lead — A7 Group website`,
      text: lines.join("\n"),
    })
  } catch (error) {
    console.error("[leads] email notification failed", error)
  }
}
