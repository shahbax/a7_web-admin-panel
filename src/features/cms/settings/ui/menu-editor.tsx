"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react"

import type { MenuNavItem, MenuSettings } from "@/features/cms/settings/schemas"
import { saveMenuSettingsAction } from "@/features/cms/settings/services/settings-actions"
import { SettingsForm } from "@/features/cms/settings/ui/settings-form"
import { Button } from "@/shared/ui/button"

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr
  const next = [...arr]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item!)
  return next
}

const inputCls =
  "h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function MenuEditor({ menu }: { menu: MenuSettings }) {
  const [items, setItems] = useState<MenuNavItem[]>(menu.items)

  const update = (i: number, patch: Partial<MenuNavItem>) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? ({ ...it, ...patch } as MenuNavItem) : it)))

  const addLink = () =>
    setItems((prev) => [...prev, { type: "link", label: "New item", href: "/", visible: true, newTab: false }])

  return (
    <SettingsForm action={saveMenuSettingsAction}>
      <input type="hidden" name="json" value={JSON.stringify({ items })} />
      <p className="text-sm text-muted-foreground">
        Reorder, rename, re-link, hide or remove navigation items. Dropdown and mega-menu items
        keep their layout. The mobile menu uses the same data.
      </p>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-border bg-white p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-medium uppercase text-muted-foreground">
                {item.type}
              </span>
              <input
                className={`${inputCls} max-w-[180px]`}
                value={item.label}
                onChange={(e) => update(i, { label: e.target.value })}
                aria-label="Label"
                placeholder="Label"
              />
              <input
                className={`${inputCls} max-w-[240px]`}
                value={item.href}
                onChange={(e) => update(i, { href: e.target.value })}
                aria-label="Link"
                placeholder="/path or https://"
              />
              <div className="ml-auto flex items-center gap-1">
                <Button type="button" size="icon" variant="ghost" onClick={() => setItems(move(items, i, i - 1))} aria-label="Move up">
                  <ChevronUp className="size-4" />
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => setItems(move(items, i, i + 1))} aria-label="Move down">
                  <ChevronDown className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => update(i, { visible: !item.visible })}
                  aria-label={item.visible ? "Hide" : "Show"}
                >
                  {item.visible ? <Eye className="size-4" /> : <EyeOff className="size-4 text-muted-foreground" />}
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                  aria-label="Remove"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>

            {item.type === "menu" ? (
              <SubItems
                label="Dropdown links"
                rows={item.items}
                cols={["label", "href"]}
                onChange={(rows) => update(i, { items: rows as { label: string; href: string }[] })}
              />
            ) : null}
            {item.type === "mega" ? (
              <SubItems
                label="Mega-menu tiles"
                rows={item.tiles}
                cols={["title", "subtitle", "href"]}
                onChange={(rows) => update(i, { tiles: rows as { title: string; subtitle: string; href: string }[] })}
              />
            ) : null}
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={addLink}>
        <Plus className="size-4" /> Add link
      </Button>
    </SettingsForm>
  )
}

function SubItems({
  label,
  rows,
  cols,
  onChange,
}: {
  label: string
  rows: Record<string, string>[]
  cols: string[]
  onChange: (rows: Record<string, string>[]) => void
}) {
  const setCell = (i: number, key: string, value: string) =>
    onChange(rows.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)))
  const addRow = () => onChange([...rows, Object.fromEntries(cols.map((c) => [c, ""]))])
  const removeRow = (i: number) => onChange(rows.filter((_, idx) => idx !== i))

  return (
    <div className="mt-3 border-t border-dashed border-border pt-3">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            {cols.map((c) => (
              <input
                key={c}
                className={inputCls}
                value={row[c] ?? ""}
                placeholder={c}
                aria-label={c}
                onChange={(e) => setCell(i, c, e.target.value)}
              />
            ))}
            <Button type="button" size="icon" variant="ghost" className="text-destructive" onClick={() => removeRow(i)} aria-label="Remove row">
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={addRow}>
        <Plus className="size-4" /> Add
      </Button>
    </div>
  )
}
