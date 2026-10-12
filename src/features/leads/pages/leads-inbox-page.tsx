import type { Metadata } from "next"
import Link from "next/link"

import { requireUser } from "@/features/auth/services/guards"
import { listLeads, LEAD_TYPE_LABELS } from "@/features/leads/core/repository"
import { LeadRow } from "@/features/leads/ui/lead-row"

export const leadsInboxMetadata: Metadata = {
  title: "Leads · A7 Group admin",
  robots: { index: false, follow: false },
}

export async function LeadsInboxRoute({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>
}) {
  await requireUser()
  const { type, status } = await searchParams
  const handled = status === "handled" ? true : status === "new" ? false : undefined
  const leads = await listLeads({ type: type || undefined, handled })

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">Form submissions from the website.</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- CSV download from an API route, not a page */}
        <a
          href="/api/admin/leads/export"
          className="rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-neutral-50"
        >
          Export CSV
        </a>
      </header>

      <form method="get" className="mb-4 flex flex-wrap gap-3">
        <select name="type" defaultValue={type ?? ""} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">All types</option>
          {Object.entries(LEAD_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select name="status" defaultValue={status ?? ""} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">All</option>
          <option value="new">New</option>
          <option value="handled">Handled</option>
        </select>
        <button type="submit" className="rounded-md border border-input px-3 text-sm">Filter</button>
        <Link href="/admin/leads" className="self-center text-sm text-muted-foreground hover:underline">Reset</Link>
      </form>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-neutral-50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No leads yet.</td></tr>
            ) : (
              leads.map((lead) => <LeadRow key={lead.id} lead={lead} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
