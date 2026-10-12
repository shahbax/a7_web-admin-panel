"use client"

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"

import type { BlockField, BlockProps } from "@/features/cms/blocks/types"
import { Button } from "@/shared/ui/button"

const inputCls =
  "w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: BlockField
  value: unknown
  onChange: (value: unknown) => void
}) {
  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={value === true}
          onChange={(e) => onChange(e.target.checked)}
          className="size-4"
        />
        {field.label}
      </label>
    )
  }

  if (field.type === "select") {
    return (
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">{field.label}</span>
        <select className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          {(field.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
    )
  }

  if (field.type === "textarea" || field.type === "richtext") {
    return (
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">
          {field.label}
          {field.type === "richtext" ? " (HTML)" : ""}
        </span>
        <textarea
          className={inputCls}
          rows={field.type === "richtext" ? 5 : 3}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {field.help ? <span className="mt-1 block text-[11px] text-muted-foreground">{field.help}</span> : null}
      </label>
    )
  }

  if (field.type === "list") {
    const rows = Array.isArray(value) ? (value as Record<string, unknown>[]) : []
    const itemFields = field.itemFields ?? []
    const blank = Object.fromEntries(itemFields.map((f) => [f.name, f.type === "boolean" ? false : ""]))
    const setRows = (next: Record<string, unknown>[]) => onChange(next)
    return (
      <div>
        <span className="mb-1 block text-xs font-medium text-muted-foreground">{field.label}</span>
        <div className="space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="rounded-lg border border-border bg-neutral-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {field.itemLabel ?? "Item"} {i + 1}
                </span>
                <div className="flex items-center gap-1">
                  <Button type="button" size="icon" variant="ghost" aria-label="Up" onClick={() => {
                    if (i === 0) return
                    const n = [...rows]; [n[i - 1], n[i]] = [n[i]!, n[i - 1]!]; setRows(n)
                  }}><ChevronUp className="size-4" /></Button>
                  <Button type="button" size="icon" variant="ghost" aria-label="Down" onClick={() => {
                    if (i === rows.length - 1) return
                    const n = [...rows]; [n[i + 1], n[i]] = [n[i]!, n[i + 1]!]; setRows(n)
                  }}><ChevronDown className="size-4" /></Button>
                  <Button type="button" size="icon" variant="ghost" className="text-destructive" aria-label="Remove"
                    onClick={() => setRows(rows.filter((_, idx) => idx !== i))}><Trash2 className="size-4" /></Button>
                </div>
              </div>
              <div className="space-y-2">
                {itemFields.map((itemField) => (
                  <FieldInput
                    key={itemField.name}
                    field={itemField}
                    value={row[itemField.name]}
                    onChange={(v) => setRows(rows.map((r, idx) => (idx === i ? { ...r, [itemField.name]: v } : r)))}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setRows([...rows, { ...blank }])}>
          <Plus className="size-4" /> Add {field.itemLabel ?? "item"}
        </Button>
      </div>
    )
  }

  // text / url / image
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">
        {field.label}
        {field.type === "image" ? " (URL or /uploads path)" : ""}
      </span>
      <input
        className={inputCls}
        value={String(value ?? "")}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {field.help ? <span className="mt-1 block text-[11px] text-muted-foreground">{field.help}</span> : null}
    </label>
  )
}

export function BlockForm({
  fields,
  props,
  onChange,
}: {
  fields: BlockField[]
  props: BlockProps
  onChange: (props: BlockProps) => void
}) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          value={props[field.name]}
          onChange={(v) => onChange({ ...props, [field.name]: v })}
        />
      ))}
    </div>
  )
}
