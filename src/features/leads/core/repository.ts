import "server-only"

import type { Lead as PrismaLead } from "@prisma/client"

import { prisma } from "@/shared/lib/db/prisma"
import { type LeadDTO, LEAD_TYPE_LABELS } from "@/features/leads/core/constants"

export { type LeadDTO, LEAD_TYPE_LABELS }

function toDTO(row: PrismaLead): LeadDTO {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    sourceUrl: row.sourceUrl,
    reference: row.reference,
    payload: (row.payload as Record<string, unknown> | null) ?? null,
    handled: row.handled,
    createdAt: row.createdAt.toISOString(),
  }
}

export async function createLead(input: {
  type: string
  name?: string | null
  email?: string | null
  phone?: string | null
  message?: string | null
  sourceUrl?: string | null
  reference?: string | null
  payload?: Record<string, unknown> | null
  ip?: string | null
}): Promise<LeadDTO> {
  const row = await prisma.lead.create({
    data: {
      type: input.type,
      name: input.name ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      message: input.message ?? null,
      sourceUrl: input.sourceUrl ?? null,
      reference: input.reference ?? null,
      payload: (input.payload as object) ?? undefined,
      ip: input.ip ?? null,
    },
  })
  return toDTO(row)
}

export async function recentLeadCountByIp(ip: string, minutes: number): Promise<number> {
  const since = new Date(Date.now() - minutes * 60_000)
  return prisma.lead.count({ where: { ip, createdAt: { gte: since } } })
}

export async function listLeads(opts: {
  type?: string
  handled?: boolean
} = {}): Promise<LeadDTO[]> {
  const rows = await prisma.lead.findMany({
    where: { type: opts.type, handled: opts.handled },
    orderBy: { createdAt: "desc" },
    take: 1000,
  })
  return rows.map(toDTO)
}

export async function getLead(id: string): Promise<LeadDTO | null> {
  const row = await prisma.lead.findUnique({ where: { id } })
  return row ? toDTO(row) : null
}

export async function setLeadHandled(id: string, handled: boolean): Promise<void> {
  await prisma.lead.update({ where: { id }, data: { handled } })
}

export async function deleteLead(id: string): Promise<void> {
  await prisma.lead.delete({ where: { id } })
}

export async function unhandledCount(): Promise<number> {
  return prisma.lead.count({ where: { handled: false } })
}
