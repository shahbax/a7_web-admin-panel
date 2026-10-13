import { prisma } from "@/shared/lib/db/prisma"

export type AuditEntry = {
  userId?: string | null
  userEmail: string
  action: string
  entityType?: string
  entityId?: string
  summary?: string
  metadata?: Record<string, unknown>
  ip?: string
}

/**
 * Record an audit-log entry. Never throws into the caller — a logging failure
 * must not break the action being logged.
 */
export async function recordAudit(entry: AuditEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId ?? null,
        userEmail: entry.userEmail,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        summary: entry.summary ?? "",
        metadata: entry.metadata
          ? JSON.parse(JSON.stringify(entry.metadata))
          : undefined,
        ip: entry.ip,
      },
    })
  } catch (error) {
    console.error("[audit] failed to record entry", entry.action, error)
  }
}
