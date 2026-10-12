"use client"

import { useRef, useState, useTransition } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Monitor,
  Plus,
  Smartphone,
  Tablet,
  Trash2,
} from "lucide-react"

import { blockRegistry, getBlockDefinition } from "@/features/cms/blocks/registry"
import { newBlock, type Block, type BlockProps } from "@/features/cms/blocks/types"
import type { PageDetail } from "@/features/cms/pages/core/entity"
import {
  publishPageAction,
  restorePageVersionAction,
  savePageDraftAction,
  unpublishPageAction,
} from "@/features/cms/pages/services/page-actions"
import type { PageVersionSummary } from "@/features/cms/pages/core/page.repository"
import { BlockForm } from "@/features/cms/pages/ui/block-form"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/lib/cn"

type Meta = {
  title: string
  template: string
  seoTitle: string
  seoDescription: string
  ogImageUrl: string
}

const VIEWPORTS = {
  desktop: { label: "Desktop", width: "100%", icon: Monitor },
  tablet: { label: "Tablet", width: "768px", icon: Tablet },
  mobile: { label: "Mobile", width: "390px", icon: Smartphone },
} as const
type ViewportKey = keyof typeof VIEWPORTS

export function PageEditor({ page, versions = [] }: { page: PageDetail; versions?: PageVersionSummary[] }) {
  const [blocks, setBlocks] = useState<Block[]>(page.draft)
  const [meta, setMeta] = useState<Meta>({
    title: page.title,
    template: page.template,
    seoTitle: page.seoTitle ?? "",
    seoDescription: page.seoDescription ?? "",
    ogImageUrl: page.ogImageUrl ?? "",
  })
  const [selected, setSelected] = useState<string | null>(blocks[0]?.id ?? null)
  const [tab, setTab] = useState<"blocks" | "settings">("blocks")
  const [viewport, setViewport] = useState<ViewportKey>("desktop")
  const [status, setStatus] = useState<string>("")
  const [pending, startTransition] = useTransition()
  const [showLibrary, setShowLibrary] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const refreshPreview = () => {
    if (iframeRef.current) iframeRef.current.src = `/api/preview?slug=${encodeURIComponent(page.slug)}&t=${Date.now()}`
  }

  function buildForm(): FormData {
    const fd = new FormData()
    fd.set("id", page.id)
    fd.set("title", meta.title)
    fd.set("template", meta.template)
    fd.set("seoTitle", meta.seoTitle)
    fd.set("seoDescription", meta.seoDescription)
    fd.set("ogImageUrl", meta.ogImageUrl)
    fd.set("blocks", JSON.stringify(blocks))
    return fd
  }

  const save = () =>
    startTransition(async () => {
      const res = await savePageDraftAction({}, buildForm())
      setStatus(res.error ? res.error : "Draft saved")
      if (!res.error) refreshPreview()
    })

  const publish = () =>
    startTransition(async () => {
      const save1 = await savePageDraftAction({}, buildForm())
      if (save1.error) { setStatus(save1.error); return }
      const fd = new FormData()
      fd.set("id", page.id)
      const res = await publishPageAction({}, fd)
      setStatus(res.error ? res.error : "Published to the live site")
      if (!res.error) refreshPreview()
    })

  const unpublish = () =>
    startTransition(async () => {
      const fd = new FormData()
      fd.set("id", page.id)
      const res = await unpublishPageAction({}, fd)
      setStatus(res.error ? res.error : "Unpublished")
    })

  const addBlock = (type: string) => {
    const def = getBlockDefinition(type)
    if (!def) return
    const block = newBlock(def)
    setBlocks((prev) => [...prev, block])
    setSelected(block.id)
    setShowLibrary(false)
  }

  const updateProps = (id: string, props: BlockProps) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, props } : b)))

  const toggleVisible = (id: string) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b)))

  const duplicate = (id: string) =>
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id)
      if (idx < 0) return prev
      const copy = { ...structuredClone(prev[idx]!), id: Math.random().toString(36).slice(2, 10) }
      const next = [...prev]
      next.splice(idx + 1, 0, copy)
      return next
    })

  const remove = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id))

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    setBlocks((prev) => {
      const from = prev.findIndex((b) => b.id === active.id)
      const to = prev.findIndex((b) => b.id === over.id)
      return arrayMove(prev, from, to)
    })
  }

  const selectedBlock = blocks.find((b) => b.id === selected) ?? null
  const selectedDef = selectedBlock ? getBlockDefinition(selectedBlock.type) : null

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-white px-4 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{meta.title || "Untitled page"}</p>
          <p className="truncate text-xs text-muted-foreground">
            /{page.slug} · {page.status === "PUBLISHED" ? "Published" : "Draft"}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
          <a
            href={`/api/preview?slug=${encodeURIComponent(page.slug)}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-primary hover:underline"
          >
            Open preview
          </a>
          <Button type="button" variant="outline" size="sm" onClick={save} disabled={pending}>
            Save draft
          </Button>
          {page.status === "PUBLISHED" ? (
            <Button type="button" variant="ghost" size="sm" onClick={unpublish} disabled={pending}>
              Unpublish
            </Button>
          ) : null}
          <Button type="button" size="sm" onClick={publish} disabled={pending}>
            Publish
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Editor panel */}
        <div className="flex w-full min-w-0 flex-col overflow-y-auto border-r border-border bg-neutral-50 lg:w-[420px]">
          <div className="flex gap-1 border-b border-border bg-white px-3 py-2">
            <button type="button" onClick={() => setTab("blocks")} className={cn("rounded-md px-3 py-1.5 text-sm", tab === "blocks" ? "bg-neutral-100 font-medium" : "text-muted-foreground")}>Blocks</button>
            <button type="button" onClick={() => setTab("settings")} className={cn("rounded-md px-3 py-1.5 text-sm", tab === "settings" ? "bg-neutral-100 font-medium" : "text-muted-foreground")}>Page settings</button>
          </div>

          {tab === "blocks" ? (
            <div className="p-3">
              <div className="relative mb-3">
                <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => setShowLibrary((v) => !v)}>
                  <Plus className="size-4" /> Add block
                </Button>
                {showLibrary ? (
                  <div className="absolute z-10 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-border bg-white p-1 shadow-lg">
                    {blockRegistry.map((def) => (
                      <button
                        key={def.type}
                        type="button"
                        onClick={() => addBlock(def.type)}
                        className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-neutral-100"
                      >
                        <span className="font-medium">{def.label}</span>
                        {def.description ? <span className="block text-xs text-muted-foreground">{def.description}</span> : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {blocks.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border bg-white p-6 text-center text-sm text-muted-foreground">
                  No blocks yet. Add one to start building this page.
                </p>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                  <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                    <ul className="space-y-2">
                      {blocks.map((block) => (
                        <SortableRow
                          key={block.id}
                          block={block}
                          selected={selected === block.id}
                          onSelect={() => setSelected(selected === block.id ? null : block.id)}
                          onToggle={() => toggleVisible(block.id)}
                          onDuplicate={() => duplicate(block.id)}
                          onRemove={() => remove(block.id)}
                        >
                          {selected === block.id && selectedDef ? (
                            <div className="border-t border-border bg-white p-3">
                              <BlockForm
                                fields={selectedDef.fields}
                                props={block.props}
                                onChange={(props) => updateProps(block.id, props)}
                              />
                            </div>
                          ) : null}
                        </SortableRow>
                      ))}
                    </ul>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          ) : (
            <div className="space-y-4 p-4">
              <MetaField label="Page title" value={meta.title} onChange={(v) => setMeta({ ...meta, title: v })} />
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Template</span>
                <select className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm" value={meta.template} onChange={(e) => setMeta({ ...meta, template: e.target.value })}>
                  <option value="default">Default</option>
                  <option value="service">Service</option>
                  <option value="landing">Landing</option>
                </select>
              </label>
              <MetaField label="SEO title" value={meta.seoTitle} onChange={(v) => setMeta({ ...meta, seoTitle: v })} />
              <MetaField label="SEO description" value={meta.seoDescription} onChange={(v) => setMeta({ ...meta, seoDescription: v })} textarea />
              <MetaField label="OG image URL" value={meta.ogImageUrl} onChange={(v) => setMeta({ ...meta, ogImageUrl: v })} />

              <div className="border-t border-border pt-4">
                <p className="mb-2 text-sm font-semibold text-foreground">Version history</p>
                {versions.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Versions are saved each time you publish.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {versions.map((v, i) => (
                      <li key={v.id} className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-muted-foreground">
                          {i === 0 ? "Latest · " : ""}{new Date(v.createdAt).toLocaleString()}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={pending}
                          onClick={() =>
                            startTransition(async () => {
                              const fd = new FormData()
                              fd.set("id", page.id)
                              fd.set("versionId", v.id)
                              const res = await restorePageVersionAction({}, fd)
                              if (!res.error) window.location.reload()
                              else setStatus(res.error)
                            })
                          }
                        >
                          Restore
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live preview */}
        <div className="flex min-h-0 flex-1 flex-col bg-neutral-100">
          <div className="flex items-center justify-center gap-1 border-b border-border bg-white py-2">
            {(Object.keys(VIEWPORTS) as ViewportKey[]).map((key) => {
              const V = VIEWPORTS[key]
              const Icon = V.icon
              return (
                <button key={key} type="button" onClick={() => setViewport(key)} className={cn("flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm", viewport === key ? "bg-neutral-100 font-medium" : "text-muted-foreground")}>
                  <Icon className="size-4" /> {V.label}
                </button>
              )
            })}
          </div>
          <div className="flex min-h-0 flex-1 justify-center overflow-auto p-4">
            <iframe
              ref={iframeRef}
              src={`/api/preview?slug=${encodeURIComponent(page.slug)}`}
              title="Live preview"
              className="h-full rounded-lg border border-border bg-white shadow-sm"
              style={{ width: VIEWPORTS[viewport].width, maxWidth: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function MetaField({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm" rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  )
}

function SortableRow({
  block,
  selected,
  onSelect,
  onToggle,
  onDuplicate,
  onRemove,
  children,
}: {
  block: Block
  selected: boolean
  onSelect: () => void
  onToggle: () => void
  onDuplicate: () => void
  onRemove: () => void
  children?: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })
  const def = getBlockDefinition(block.type)
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("overflow-hidden rounded-lg border bg-white", selected ? "border-foreground/30" : "border-border", isDragging && "opacity-60")}
    >
      <div className="flex items-center gap-1 px-2 py-2">
        <button type="button" className="cursor-grab touch-none text-muted-foreground" {...attributes} {...listeners} aria-label="Drag to reorder">
          <GripVertical className="size-4" />
        </button>
        <button type="button" onClick={onSelect} className={cn("min-w-0 flex-1 truncate text-left text-sm", !block.visible && "text-muted-foreground line-through")}>
          {def?.label ?? block.type}
        </button>
        <button type="button" onClick={onToggle} className="p-1 text-muted-foreground hover:text-foreground" aria-label={block.visible ? "Hide" : "Show"}>
          {block.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </button>
        <button type="button" onClick={onDuplicate} className="p-1 text-muted-foreground hover:text-foreground" aria-label="Duplicate">
          <Copy className="size-4" />
        </button>
        <button type="button" onClick={onRemove} className="p-1 text-destructive" aria-label="Delete">
          <Trash2 className="size-4" />
        </button>
      </div>
      {children}
    </li>
  )
}
