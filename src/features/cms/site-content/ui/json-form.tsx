"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, ChevronUp, Copy, ImageIcon, Plus, Trash2 } from "lucide-react"

import { cloneTemplate, type JsonValue } from "@/features/cms/site-content/core/merge"
import type { ContentFieldHint, ContentFieldType } from "@/features/cms/site-content/core/types"
import { MediaPicker } from "@/features/cms/site-content/ui/media-picker"
import { humanize } from "@/features/cms/site-content/core/humanize"
import { Button } from "@/shared/ui/button"

const inputCls =
  "w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"

type Hints = Record<string, ContentFieldHint>

/** Fields hidden unless a hint says otherwise: technical values the layout depends on. */
const HIDDEN_KEYS = new Set(["headingId", "breadcrumbs", "kind", "variant", "icon", "iconKey", "iconName", "tone", "theme", "className", "__typename"])

const IMAGE_KEY = /(image|img|photo|avatar|logo|cover|thumbnail|thumb|background|banner|poster|picture|src)(url|src)?s?$/i
const LINK_KEY = /(href|url|link|website)$/i
const HTML_KEY = /(html)$/i

function hintFor(hints: Hints | undefined, path: string, name: string): ContentFieldHint | undefined {
  return hints?.[path] ?? hints?.[name]
}

function looksLikeImageUrl(v: string) {
  return /^(https?:\/\/|\/)/.test(v) && (/\.(png|jpe?g|webp|gif|svg|avif)(\?|$)/i.test(v) || /unsplash|pravatar|\/uploads\//i.test(v))
}

function inferType(name: string, value: JsonValue, hint?: ContentFieldHint): ContentFieldType {
  if (hint?.type) return hint.type
  if (HIDDEN_KEYS.has(name) || /.+Id$/.test(name)) return "hidden"
  if (typeof value === "boolean") return "boolean"
  if (typeof value === "number") return "number"
  if (typeof value === "string") {
    if (HTML_KEY.test(name)) return "html"
    if (IMAGE_KEY.test(name) || looksLikeImageUrl(value)) return "image"
    if (LINK_KEY.test(name)) return "link"
    if (value.length > 90 || value.includes("\n")) return "textarea"
  }
  return "text"
}

function itemTitle(item: JsonValue, index: number): string {
  if (item && typeof item === "object" && !Array.isArray(item)) {
    for (const k of ["title", "name", "label", "heading", "question", "value", "id", "slug"]) {
      const v = item[k]
      if (typeof v === "string" && v.trim()) return v.length > 70 ? `${v.slice(0, 70)}…` : v
    }
  }
  if (typeof item === "string") return item.length > 70 ? `${item.slice(0, 70)}…` : item || `Item ${index + 1}`
  return `Item ${index + 1}`
}

function Label({ text, help }: { text: string; help?: string }) {
  return (
    <span className="mb-1 block text-xs font-medium text-muted-foreground">
      {text}
      {help ? <span className="ml-1 font-normal text-muted-foreground/80">— {help}</span> : null}
    </span>
  )
}

function ImageField({ label, help, value, onChange }: { label: string; help?: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Label text={label} help={help} />
      <div className="flex items-start gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-16 w-24 shrink-0 rounded-md border border-border object-cover" />
        ) : (
          <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
            <ImageIcon className="size-5" />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL" />
          <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
            Choose from library
          </Button>
        </div>
      </div>
      <MediaPicker open={open} onClose={() => setOpen(false)} onSelect={onChange} />
    </div>
  )
}

function PrimitiveField({
  name,
  path,
  value,
  hint,
  onChange,
}: {
  name: string
  path: string
  value: JsonValue
  hint?: ContentFieldHint
  onChange: (v: JsonValue) => void
}) {
  const type = inferType(name, value, hint)
  const label = hint?.label ?? humanize(name)
  if (type === "hidden") return null
  if (type === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="size-4" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
        {label}
      </label>
    )
  }
  if (type === "number") {
    return (
      <label className="block">
        <Label text={label} help={hint?.help} />
        <input type="number" className={inputCls} value={typeof value === "number" ? value : 0} onChange={(e) => onChange(Number(e.target.value))} />
      </label>
    )
  }
  const str = typeof value === "string" ? value : value === null ? "" : String(value)
  if (type === "image") return <ImageField label={label} help={hint?.help} value={str} onChange={onChange} />
  if (type === "select") {
    return (
      <label className="block">
        <Label text={label} help={hint?.help} />
        <select className={inputCls} value={str} onChange={(e) => onChange(e.target.value)}>
          {(hint?.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
    )
  }
  if (type === "textarea" || type === "html") {
    return (
      <label className="block">
        <Label text={type === "html" ? `${label} (HTML)` : label} help={hint?.help} />
        <textarea className={inputCls} rows={type === "html" ? 6 : 3} value={str} onChange={(e) => onChange(e.target.value)} />
      </label>
    )
  }
  return (
    <label className="block" data-path={path}>
      <Label text={label} help={hint?.help ?? (type === "link" ? "page path like /about or a full https:// URL" : undefined)} />
      <input className={inputCls} value={str} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

function ArrayField({
  name,
  path,
  value,
  template,
  hints,
  depth,
  onChange,
}: {
  name: string
  path: string
  value: JsonValue[]
  template: JsonValue[] | undefined
  hints?: Hints
  depth: number
  onChange: (v: JsonValue[]) => void
}) {
  const [open, setOpen] = useState<number | null>(null)
  const hint = hintFor(hints, path, name)
  const label = hint?.label ?? humanize(name)
  const proto = template?.[0] ?? value[0]
  const primitive = proto === undefined || proto === null || typeof proto !== "object"

  const update = (i: number, v: JsonValue) => onChange(value.map((x, j) => (j === i ? v : x)))
  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
    setOpen(open === i ? j : open)
  }
  const remove = (i: number) => {
    if (!confirm("Remove this item?")) return
    onChange(value.filter((_, j) => j !== i))
    setOpen(null)
  }
  const duplicate = (i: number) => {
    const next = [...value]
    next.splice(i + 1, 0, cloneTemplate(value[i]))
    onChange(next)
  }
  const add = () => {
    onChange([...value, cloneTemplate(proto)])
    setOpen(value.length)
  }

  return (
    <fieldset className="rounded-lg border border-border p-3">
      <legend className="px-1 text-xs font-semibold text-foreground">
        {label} <span className="font-normal text-muted-foreground">({value.length})</span>
      </legend>
      {hint?.help ? <p className="mb-2 text-xs text-muted-foreground">{hint.help}</p> : null}
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="rounded-md border border-border bg-muted/20">
            <div className="flex items-center gap-1 px-2 py-1.5">
              {primitive ? (
                <input
                  className={`${inputCls} py-1.5`}
                  value={typeof item === "string" ? item : String(item ?? "")}
                  onChange={(e) => update(i, typeof proto === "number" ? Number(e.target.value) : e.target.value)}
                />
              ) : (
                <button type="button" className="flex flex-1 items-center gap-1 text-left text-sm" onClick={() => setOpen(open === i ? null : i)}>
                  {open === i ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                  <span className="truncate">{itemTitle(item, i)}</span>
                </button>
              )}
              <button type="button" aria-label="Move up" className="rounded p-1 hover:bg-muted" onClick={() => move(i, -1)}><ChevronUp className="size-4" /></button>
              <button type="button" aria-label="Move down" className="rounded p-1 hover:bg-muted" onClick={() => move(i, 1)}><ChevronDown className="size-4" /></button>
              {!primitive ? (
                <button type="button" aria-label="Duplicate" className="rounded p-1 hover:bg-muted" onClick={() => duplicate(i)}><Copy className="size-4" /></button>
              ) : null}
              <button type="button" aria-label="Remove" className="rounded p-1 text-destructive hover:bg-muted" onClick={() => remove(i)}><Trash2 className="size-4" /></button>
            </div>
            {!primitive && open === i ? (
              <div className="border-t border-border bg-white p-3">
                <FieldEditor
                  name={name}
                  path={`${path}[]`}
                  value={item}
                  template={proto}
                  hints={hints}
                  depth={depth + 1}
                  onChange={(v) => update(i, v)}
                  bare
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={add}>
        <Plus className="size-4" /> Add {primitive ? "line" : "item"}
      </Button>
    </fieldset>
  )
}

export function FieldEditor({
  name,
  path,
  value,
  template,
  hints,
  depth = 0,
  bare = false,
  onChange,
}: {
  name: string
  path: string
  value: JsonValue
  template?: JsonValue
  hints?: Hints
  depth?: number
  bare?: boolean
  onChange: (v: JsonValue) => void
}) {
  const hint = hintFor(hints, path, name)
  if (Array.isArray(value)) {
    return (
      <ArrayField
        name={name}
        path={path}
        value={value}
        template={Array.isArray(template) ? template : undefined}
        hints={hints}
        depth={depth}
        onChange={onChange}
      />
    )
  }
  if (value && typeof value === "object") {
    if (hint?.type === "hidden" || (!bare && HIDDEN_KEYS.has(name))) return null
    const tpl = template && typeof template === "object" && !Array.isArray(template) ? template : undefined
    const children = Object.entries(value).map(([k, v]) => (
      <FieldEditor
        key={k}
        name={k}
        path={path ? `${path}.${k}` : k}
        value={v}
        template={tpl?.[k]}
        hints={hints}
        depth={depth + 1}
        onChange={(nv) => onChange({ ...value, [k]: nv })}
      />
    ))
    if (bare || depth === 0) return <div className="space-y-4">{children}</div>
    return (
      <fieldset className="space-y-4 rounded-lg border border-border p-3">
        <legend className="px-1 text-xs font-semibold text-foreground">{hint?.label ?? humanize(name)}</legend>
        {children}
      </fieldset>
    )
  }
  return <PrimitiveField name={name} path={path} value={value} hint={hint} onChange={onChange} />
}
