"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { ImageIcon, Upload, X } from "lucide-react"

import {
  listPickerMediaAction,
  quickUploadImageAction,
  type PickerMedia,
} from "@/features/media/services/media-actions"
import { Button } from "@/shared/ui/button"

export function MediaPicker({
  open,
  onClose,
  onSelect,
}: {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
}) {
  const [items, setItems] = useState<PickerMedia[]>([])
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")
  const [pending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => {
      startTransition(async () => setItems(await listPickerMediaAction(search)))
    }, 250)
    return () => clearTimeout(t)
  }, [open, search])

  if (!open) return null

  const upload = (file: File) =>
    startTransition(async () => {
      setError("")
      const fd = new FormData()
      fd.set("file", file)
      const res = await quickUploadImageAction(fd)
      if (res.error || !res.url) return setError(res.error ?? "Upload failed.")
      onSelect(res.url)
      onClose()
    })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl">
        <div className="flex items-center gap-2 border-b border-border p-4">
          <ImageIcon className="size-4" />
          <h2 className="text-sm font-semibold">Choose an image</h2>
          <input
            className="ml-auto w-48 rounded-md border border-input px-2 py-1.5 text-sm"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
          <Button type="button" size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={pending}>
            <Upload className="size-4" /> Upload
          </Button>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded p-1 hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>
        {error ? <p className="px-4 pt-3 text-sm text-destructive">{error}</p> : null}
        <div className="grid flex-1 grid-cols-3 gap-3 overflow-y-auto p-4 sm:grid-cols-4">
          {items.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                onSelect(m.url)
                onClose()
              }}
              className="group overflow-hidden rounded-lg border border-border text-left hover:ring-2 hover:ring-primary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt={m.alt} className="aspect-video w-full object-cover" />
              <span className="block truncate px-2 py-1 text-xs text-muted-foreground">{m.name}</span>
            </button>
          ))}
          {!pending && items.length === 0 ? (
            <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
              No images yet. Use Upload to add one.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
