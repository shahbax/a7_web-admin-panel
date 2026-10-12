"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import type { CollectionDef } from "@/features/cms/collections/registry"
import type { CollectionItemDTO } from "@/features/cms/collections/core/repository"
import {
  deleteItemAction,
  saveItemAction,
  setStatusAction,
} from "@/features/cms/collections/services/collection-actions"
import { BlockForm } from "@/features/cms/pages/ui/block-form"
import { Button } from "@/shared/ui/button"

export function ItemEditor({ item, def }: { item: CollectionItemDTO; def: CollectionDef }) {
  const router = useRouter()
  const [data, setData] = useState<Record<string, unknown>>(item.data)
  const [slug, setSlug] = useState(item.slug ?? "")
  const [status, setStatus] = useState(item.status)
  const [msg, setMsg] = useState("")
  const [pending, startTransition] = useTransition()

  const buildForm = () => {
    const fd = new FormData()
    fd.set("id", item.id)
    fd.set("collection", item.collection)
    fd.set("slug", slug)
    fd.set("data", JSON.stringify(data))
    return fd
  }

  const save = () =>
    startTransition(async () => {
      const res = await saveItemAction({}, buildForm())
      setMsg(res.error ?? "Saved draft")
    })

  const publish = () =>
    startTransition(async () => {
      const s = await saveItemAction({}, buildForm())
      if (s.error) return setMsg(s.error)
      const fd = new FormData()
      fd.set("id", item.id)
      fd.set("status", "PUBLISHED")
      const res = await setStatusAction({}, fd)
      if (!res.error) setStatus("PUBLISHED")
      setMsg(res.error ?? "Published")
    })

  const unpublish = () =>
    startTransition(async () => {
      const fd = new FormData()
      fd.set("id", item.id)
      fd.set("status", "DRAFT")
      const res = await setStatusAction({}, fd)
      if (!res.error) setStatus("DRAFT")
      setMsg(res.error ?? "Unpublished")
    })

  const remove = () => {
    if (!confirm("Delete this item? This cannot be undone.")) return
    startTransition(async () => {
      const fd = new FormData()
      fd.set("id", item.id)
      const res = await deleteItemAction({}, fd)
      if (res.error) return setMsg(res.error)
      router.push(`/admin/collections/${item.collection}`)
    })
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{def.singular}</h1>
          <p className="text-sm text-muted-foreground">
            {status === "PUBLISHED" ? "Published" : "Draft"}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {msg ? <span className="text-xs text-muted-foreground">{msg}</span> : null}
          <Button type="button" variant="outline" size="sm" onClick={save} disabled={pending}>Save draft</Button>
          {status === "PUBLISHED" ? (
            <Button type="button" variant="ghost" size="sm" onClick={unpublish} disabled={pending}>Unpublish</Button>
          ) : null}
          <Button type="button" size="sm" onClick={publish} disabled={pending}>Publish</Button>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-border bg-white p-5">
        {def.hasSlug ? (
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Slug</span>
            <input className="w-full rounded-md border border-input bg-background px-2.5 py-2 text-sm" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto from title" />
          </label>
        ) : null}
        <BlockForm fields={def.fields} props={data} onChange={setData} />
      </div>

      <div className="mt-6">
        <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={remove} disabled={pending}>
          Delete {def.singular.toLowerCase()}
        </Button>
      </div>
    </div>
  )
}
