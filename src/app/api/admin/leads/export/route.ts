import { getCurrentUser } from "@/features/auth/services/guards"
import { listLeads } from "@/features/leads/services/queries"

function csvCell(value: unknown): string {
  const s = value == null ? "" : String(value)
  return `"${s.replace(/"/g, '""')}"`
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const leads = await listLeads()
  const header = ["id", "type", "name", "email", "phone", "message", "reference", "sourceUrl", "handled", "createdAt"]
  const rows = leads.map((l) =>
    [l.id, l.type, l.name, l.email, l.phone, l.message, l.reference, l.sourceUrl, l.handled, l.createdAt]
      .map(csvCell)
      .join(","),
  )
  const csv = [header.join(","), ...rows].join("\n")

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="a7-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
