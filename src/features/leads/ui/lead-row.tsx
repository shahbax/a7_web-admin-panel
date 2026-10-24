"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { type LeadDTO, LEAD_TYPE_LABELS } from "@/features/leads/core/constants"
import {
  deleteLeadAction,
  markLeadHandledAction,
} from "@/features/leads/services/lead-actions"
import { Button } from "@/shared/ui/button"

export function LeadRow({ lead }: { lead: LeadDTO }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const run = (fn: () => Promise<unknown>) =>
    startTransition(async () => {
      await fn()
      router.refresh()
    })

  const toggleHandled = () => {
    const fd = new FormData()
    fd.set("id", lead.id)
    fd.set("handled", String(!lead.handled))
    run(() => markLeadHandledAction({}, fd))
  }
  const remove = () => {
    if (!confirm("Delete this lead?")) return
    const fd = new FormData()
    fd.set("id", lead.id)
    run(() => deleteLeadAction({}, fd))
  }

  const { files: rawFiles, ...rest } = (lead.payload ?? {}) as { files?: unknown } & Record<string, unknown>
  const files = Array.isArray(rawFiles)
    ? (rawFiles as { name?: unknown; stored?: unknown }[]).filter(
        (f): f is { name: string; stored: string } => typeof f.name === "string" && typeof f.stored === "string",
      )
    : []
  const extra = Object.keys(rest).length > 0 ? rest : null

  return (
    <>
      <tr className="hover:bg-neutral-50">
        <td className="px-4 py-3">
          <button type="button" onClick={() => setOpen((v) => !v)} className="text-left font-medium text-foreground hover:underline">
            {lead.name || lead.email || lead.phone || "(no name)"}
          </button>
          <div className="text-xs text-muted-foreground">{LEAD_TYPE_LABELS[lead.type] ?? lead.type}</div>
        </td>
        <td className="px-4 py-3 text-muted-foreground">{lead.email || lead.phone || "—"}</td>
        <td className="px-4 py-3">
          <span className={lead.handled ? "rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-muted-foreground" : "rounded-full bg-[#FFF3CD] px-2 py-0.5 text-xs font-medium text-[#8a6d00]"}>
            {lead.handled ? "Handled" : "New"}
          </span>
        </td>
        <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleString()}</td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-2">
            <Button type="button" size="sm" variant="outline" onClick={toggleHandled} disabled={pending}>
              {lead.handled ? "Mark new" : "Mark handled"}
            </Button>
            <Button type="button" size="sm" variant="ghost" className="text-destructive" onClick={remove} disabled={pending}>
              Delete
            </Button>
          </div>
        </td>
      </tr>
      {open ? (
        <tr className="bg-neutral-50/60">
          <td colSpan={5} className="px-4 py-3">
            <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              {lead.phone ? <div><dt className="inline text-muted-foreground">Phone: </dt><dd className="inline">{lead.phone}</dd></div> : null}
              {lead.reference ? <div><dt className="inline text-muted-foreground">Reference: </dt><dd className="inline">{lead.reference}</dd></div> : null}
              {lead.sourceUrl ? <div className="sm:col-span-2"><dt className="inline text-muted-foreground">Page: </dt><dd className="inline break-all">{lead.sourceUrl}</dd></div> : null}
              {lead.message ? <div className="sm:col-span-2"><dt className="text-muted-foreground">Message:</dt><dd className="mt-1 whitespace-pre-wrap">{lead.message}</dd></div> : null}
              {files.length > 0 ? (
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Attachments:</dt>
                  <dd className="mt-1 flex flex-wrap gap-2">
                    {files.map((f) => (
                      <a key={f.stored} href={`/api/admin/leads/file/${f.stored}?filename=${encodeURIComponent(f.name)}`} className="rounded border border-border bg-white px-2 py-1 text-xs hover:underline">
                        {f.name}
                      </a>
                    ))}
                  </dd>
                </div>
              ) : null}
              {extra ? <div className="sm:col-span-2"><dt className="text-muted-foreground">Extra:</dt><dd className="mt-1"><pre className="overflow-x-auto rounded bg-neutral-100 p-2 text-xs">{JSON.stringify(extra, null, 2)}</pre></dd></div> : null}
            </dl>
          </td>
        </tr>
      ) : null}
    </>
  )
}
