"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import { ChevronDown, ChevronUp, Copy, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react"

import { cloneTemplate, type JsonValue } from "@/features/cms/site-content/core/merge"
import type { ContentEditState, ContentVersionSummary } from "@/features/cms/site-content/service"
import type { SectionLayout } from "@/features/cms/site-content/core/types"
import {
  discardContentDraftAction,
  publishContentAction,
  resetContentAction,
  restoreContentVersionAction,
  saveContentDraftAction,
} from "@/features/cms/site-content/services/content-actions"
import { FieldEditor } from "@/features/cms/site-content/ui/json-form"
import { Button } from "@/shared/ui/button"

function SectionsPanel({
  state,
  layout,
  onChange,
}: {
  state: ContentEditState
  layout: SectionLayout
  onChange: (l: SectionLayout) => void
}) {
  const sections = state.info.sections ?? []
  if (sections.length === 0) return null
  const labelOf = (k: string) => sections.find((s) => s.key === k)?.label ?? k
  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= layout.order.length) return
    const order = [...layout.order]
    ;[order[i], order[j]] = [order[j], order[i]]
    onChange({ ...layout, order })
  }
  const toggle = (k: string) =>
    onChange({
      ...layout,
      hidden: layout.hidden.includes(k) ? layout.hidden.filter((x) => x !== k) : [...layout.hidden, k],
    })
  return (
    <section className="rounded-xl border border-border bg-white p-5">
      <h2 className="text-sm font-semibold">Page sections</h2>
      <p className="mb-3 text-xs text-muted-foreground">Show, hide or reorder the sections on this page.</p>
      <ol className="space-y-1.5">
        {layout.order.map((k, i) => {
          const hidden = layout.hidden.includes(k)
          return (
            <li key={k} className={`flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm ${hidden ? "bg-muted/40 text-muted-foreground line-through" : ""}`}>
              <span className="flex-1">{labelOf(k)}</span>
              <button type="button" aria-label="Move up" className="rounded p-1 hover:bg-muted" onClick={() => move(i, -1)}><ChevronUp className="size-4" /></button>
              <button type="button" aria-label="Move down" className="rounded p-1 hover:bg-muted" onClick={() => move(i, 1)}><ChevronDown className="size-4" /></button>
              <button type="button" aria-label={hidden ? "Show section" : "Hide section"} className="rounded p-1 hover:bg-muted" onClick={() => toggle(k)}>
                {hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function ListEditor({
  state,
  value,
  onChange,
}: {
  state: ContentEditState
  value: JsonValue[]
  onChange: (v: JsonValue[]) => void
}) {
  const [editing, setEditing] = useState<number | null>(null)
  const idField = state.info.idField ?? "id"
  const titleField = state.info.titleField ?? "title"
  const template = Array.isArray(state.defaults) ? state.defaults[0] : value[0]
  const field = (item: JsonValue, k: string) =>
    item && typeof item === "object" && !Array.isArray(item) ? String(item[k] ?? "") : ""

  if (editing !== null && value[editing] !== undefined) {
    return (
      <section className="rounded-xl border border-border bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(null)}>← All items</Button>
          <h2 className="text-sm font-semibold">{field(value[editing], titleField) || `Item ${editing + 1}`}</h2>
        </div>
        <FieldEditor
          name=""
          path=""
          value={value[editing]}
          template={template}
          hints={{ ...state.info.hints, [idField]: { label: "URL slug", help: "used in the page address — lowercase, no spaces", ...state.info.hints?.[idField] } }}
          onChange={(v) => onChange(value.map((x, i) => (i === editing ? v : x)))}
          bare
        />
      </section>
    )
  }

  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <section className="rounded-xl border border-border bg-white p-5">
      <div className="mb-3 flex items-center">
        <h2 className="text-sm font-semibold">Items ({value.length})</h2>
        <Button
          type="button"
          size="sm"
          className="ml-auto"
          onClick={() => {
            onChange([...value, cloneTemplate(template)])
            setEditing(value.length)
          }}
        >
          <Plus className="size-4" /> Add new
        </Button>
      </div>
      <ul className="divide-y divide-border rounded-md border border-border">
        {value.map((item, i) => (
          <li key={i} className="flex items-center gap-2 px-3 py-2 text-sm">
            <button type="button" className="flex-1 truncate text-left hover:underline" onClick={() => setEditing(i)}>
              {field(item, titleField) || `Item ${i + 1}`}
              <span className="ml-2 text-xs text-muted-foreground">/{field(item, idField)}</span>
            </button>
            <button type="button" aria-label="Edit" className="rounded p-1 hover:bg-muted" onClick={() => setEditing(i)}><Pencil className="size-4" /></button>
            <button type="button" aria-label="Move up" className="rounded p-1 hover:bg-muted" onClick={() => move(i, -1)}><ChevronUp className="size-4" /></button>
            <button type="button" aria-label="Move down" className="rounded p-1 hover:bg-muted" onClick={() => move(i, 1)}><ChevronDown className="size-4" /></button>
            <button type="button" aria-label="Duplicate" className="rounded p-1 hover:bg-muted" onClick={() => {
              const next = [...value]
              next.splice(i + 1, 0, cloneTemplate(item))
              onChange(next)
            }}><Copy className="size-4" /></button>
            <button type="button" aria-label="Delete" className="rounded p-1 text-destructive hover:bg-muted" onClick={() => {
              if (confirm("Delete this item? You can restore it from version history after publishing.")) onChange(value.filter((_, j) => j !== i))
            }}><Trash2 className="size-4" /></button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ContentEditor({
  state,
  versions,
}: {
  state: ContentEditState
  versions: ContentVersionSummary[]
}) {
  const router = useRouter()
  const [value, setValue] = useState<JsonValue>(state.value)
  const [layout, setLayout] = useState<SectionLayout>(state.layout)
  const [dirty, setDirty] = useState(false)
  const [msg, setMsg] = useState("")
  const [pending, startTransition] = useTransition()
  const previewPath = state.info.previewPath

  const change = (v: JsonValue) => {
    setValue(v)
    setDirty(true)
  }
  const changeLayout = (l: SectionLayout) => {
    setLayout(l)
    setDirty(true)
  }

  const run = (fn: () => Promise<{ ok?: boolean; error?: string }>, okMsg: string, refresh = false) =>
    startTransition(async () => {
      const res = await fn()
      setMsg(res.error ?? okMsg)
      if (!res.error) setDirty(false)
      if (refresh && !res.error) router.refresh()
    })

  const status = useMemo(() => {
    if (dirty) return "Unsaved changes"
    if (state.hasUnpublishedChanges) return "Draft has unpublished changes"
    return state.isCustomized ? "Published" : "Showing original content"
  }, [dirty, state.hasUnpublishedChanges, state.isCustomized])

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <div className="sticky top-0 z-10 -mx-4 mb-6 flex flex-wrap items-center gap-2 border-b border-border bg-[#f7f7f8]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold text-foreground">{state.info.label}</h1>
          <p className="text-xs text-muted-foreground">{status}</p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {msg ? <span className="text-xs text-muted-foreground">{msg}</span> : null}
          <Button type="button" variant="outline" size="sm" disabled={pending} onClick={() => run(() => saveContentDraftAction(state.info.key, value, layout), "Draft saved")}>
            Save draft
          </Button>
          {previewPath ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await saveContentDraftAction(state.info.key, value, layout)
                  setDirty(false)
                  window.open(`/api/preview?slug=${encodeURIComponent(previewPath.replace(/^\//, ""))}`, "_blank")
                })
              }
            >
              Preview draft
            </Button>
          ) : null}
          <Button type="button" size="sm" disabled={pending} onClick={() => run(() => publishContentAction(state.info.key, value, layout), "Published — live on the website", true)}>
            Publish
          </Button>
        </div>
      </div>

      {state.info.description ? <p className="mb-4 text-sm text-muted-foreground">{state.info.description}</p> : null}

      <div className="space-y-6">
        {state.info.kind === "single" ? (
          <>
            <SectionsPanel state={state} layout={layout} onChange={changeLayout} />
            <section className="rounded-xl border border-border bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold">Content</h2>
              <FieldEditor name="" path="" value={value} template={state.defaults} hints={state.info.hints} onChange={change} />
            </section>
          </>
        ) : (
          <ListEditor state={state} value={Array.isArray(value) ? value : []} onChange={change} />
        )}

        <section className="rounded-xl border border-border bg-white p-5">
          <h2 className="text-sm font-semibold">History & reset</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {state.hasUnpublishedChanges ? (
              <Button type="button" variant="outline" size="sm" disabled={pending} onClick={() => run(() => discardContentDraftAction(state.info.key), "Draft discarded", true)}>
                Discard unpublished changes
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => {
                if (confirm("Load the original website content into the draft? Publish afterwards to make it live.")) {
                  run(() => resetContentAction(state.info.key), "Original content loaded into draft", true)
                }
              }}
            >
              Reset to original content
            </Button>
          </div>
          {versions.length > 0 ? (
            <ul className="mt-4 divide-y divide-border text-sm">
              {versions.map((v) => (
                <li key={v.id} className="flex items-center py-2">
                  <span>Published {new Date(v.createdAt).toLocaleString()}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    disabled={pending}
                    onClick={() => run(() => restoreContentVersionAction(state.info.key, v.id), "Version loaded into draft — publish to make it live", true)}
                  >
                    Restore
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">No published versions yet.</p>
          )}
        </section>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Tip: use Preview draft to check your changes on the real page before publishing.
      </p>
    </div>
  )
}
