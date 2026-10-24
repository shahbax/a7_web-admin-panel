"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import type { FooterSettings } from "@/features/cms/settings/schemas"
import { saveFooterSettingsAction } from "@/features/cms/settings/services/settings-actions"
import { SettingsForm } from "@/features/cms/settings/ui/settings-form"
import { Button } from "@/shared/ui/button"

const inputCls =
  "h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

type LinkRow = { label: string; href: string }

export function FooterEditor({ footer }: { footer: FooterSettings }) {
  const [state, setState] = useState<FooterSettings>(footer)

  const set = <K extends keyof FooterSettings>(key: K, value: FooterSettings[K]) =>
    setState((prev) => ({ ...prev, [key]: value }))

  return (
    <SettingsForm action={saveFooterSettingsAction}>
      <input type="hidden" name="json" value={JSON.stringify(state)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Labeled label="Email">
          <input className={inputCls} value={state.email} onChange={(e) => set("email", e.target.value)} />
        </Labeled>
        <Labeled label="Office address">
          <input className={inputCls} value={state.office} onChange={(e) => set("office", e.target.value)} />
        </Labeled>
      </div>
      <Labeled label="Copyright line">
        <input className={inputCls} value={state.copyright} onChange={(e) => set("copyright", e.target.value)} />
      </Labeled>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={state.showColumns} onChange={(e) => set("showColumns", e.target.checked)} className="size-4" />
          Show link columns
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={state.showSocial} onChange={(e) => set("showSocial", e.target.checked)} className="size-4" />
          Show social links
        </label>
      </div>

      <LinkListEditor label="Main navigation" rows={state.mainNav} onChange={(r) => set("mainNav", r)} />
      <LinkListEditor label="Social links" rows={state.social} onChange={(r) => set("social", r)} />

      <div className="border-t border-border pt-4">
        <p className="mb-2 text-sm font-medium text-foreground">Link columns</p>
        <div className="space-y-4">
          {state.columns.map((col, ci) => (
            <div key={ci} className="rounded-lg border border-border bg-white p-3">
              <div className="flex items-center gap-2">
                <input
                  className={inputCls}
                  value={col.title}
                  placeholder="Column title"
                  aria-label="Column title"
                  onChange={(e) =>
                    set("columns", state.columns.map((c, i) => (i === ci ? { ...c, title: e.target.value } : c)))
                  }
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-destructive"
                  aria-label="Remove column"
                  onClick={() => set("columns", state.columns.filter((_, i) => i !== ci))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="mt-2 space-y-2 border-t border-dashed border-border pt-2">
                {col.links.map((link, li) => (
                  <div key={li} className="flex items-center gap-2">
                    <input
                      className={inputCls}
                      value={link.label}
                      placeholder="label"
                      aria-label="Link label"
                      onChange={(e) =>
                        set(
                          "columns",
                          state.columns.map((c, i) =>
                            i === ci
                              ? { ...c, links: c.links.map((l, j) => (j === li ? { ...l, label: e.target.value } : l)) }
                              : c,
                          ),
                        )
                      }
                    />
                    <input
                      className={inputCls}
                      value={link.href}
                      placeholder="href"
                      aria-label="Link href"
                      onChange={(e) =>
                        set(
                          "columns",
                          state.columns.map((c, i) =>
                            i === ci
                              ? { ...c, links: c.links.map((l, j) => (j === li ? { ...l, href: e.target.value } : l)) }
                              : c,
                          ),
                        )
                      }
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      aria-label="Remove link"
                      onClick={() =>
                        set(
                          "columns",
                          state.columns.map((c, i) =>
                            i === ci ? { ...c, links: c.links.filter((_, j) => j !== li) } : c,
                          ),
                        )
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    set(
                      "columns",
                      state.columns.map((c, i) => (i === ci ? { ...c, links: [...c.links, { label: "", href: "" }] } : c)),
                    )
                  }
                >
                  <Plus className="size-4" /> Add link
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => set("columns", [...state.columns, { title: "New column", links: [] }])}
        >
          <Plus className="size-4" /> Add column
        </Button>
      </div>
    </SettingsForm>
  )
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}

function LinkListEditor({
  label,
  rows,
  onChange,
}: {
  label: string
  rows: LinkRow[]
  onChange: (rows: LinkRow[]) => void
}) {
  return (
    <div className="border-t border-border pt-4">
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className={inputCls}
              value={row.label}
              placeholder="label"
              aria-label="label"
              onChange={(e) => onChange(rows.map((r, idx) => (idx === i ? { ...r, label: e.target.value } : r)))}
            />
            <input
              className={inputCls}
              value={row.href}
              placeholder="href"
              aria-label="href"
              onChange={(e) => onChange(rows.map((r, idx) => (idx === i ? { ...r, href: e.target.value } : r)))}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-destructive"
              aria-label="Remove"
              onClick={() => onChange(rows.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => onChange([...rows, { label: "", href: "" }])}>
        <Plus className="size-4" /> Add
      </Button>
    </div>
  )
}
