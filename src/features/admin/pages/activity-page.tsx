import type { Metadata } from "next"

import { requireRole } from "@/features/auth/services/guards"
import { prisma } from "@/shared/lib/db/prisma"

export const activityMetadata: Metadata = {
  title: "Activity log · A7 Group admin",
  robots: { index: false, follow: false },
}

export async function ActivityRoute() {
  await requireRole("ADMIN")
  const rows = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 300 })
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground">Activity log</h1>
      <p className="mt-1 text-sm text-muted-foreground">Who changed what, and when (latest 300 entries).</p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">When</th>
              <th className="px-4 py-2 font-medium">Who</th>
              <th className="px-4 py-2 font-medium">What</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">{r.createdAt.toLocaleString("en-GB", { timeZone: "Asia/Dubai" })}</td>
                <td className="px-4 py-2">{r.userEmail}</td>
                <td className="px-4 py-2">{r.summary || r.action}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">Nothing recorded yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
