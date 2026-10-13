"use client"

import Image from "next/image"
import { useActionState, useState } from "react"
import { FileText, Film, Pencil, Trash2 } from "lucide-react"

import type { MediaAsset } from "@/features/media/core/domain/entity"
import {
  deleteMediaAction,
  updateMediaAction,
  type MediaActionState,
} from "@/features/media/services/media-actions"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"

const initial: MediaActionState = {}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MediaCard({ asset }: { asset: MediaAsset }) {
  const [editing, setEditing] = useState(false)
  const [updateState, updateAction, updating] = useActionState(updateMediaAction, initial)
  const [, deleteAction, deleting] = useActionState(deleteMediaAction, initial)

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-white">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-neutral-100">
        {asset.kind === "IMAGE" ? (
          <Image
            src={asset.url}
            alt={asset.alt || asset.originalName}
            fill
            sizes="(max-width: 640px) 50vw, 200px"
            className="object-cover"
            unoptimized={asset.mimeType === "image/svg+xml"}
          />
        ) : asset.kind === "VIDEO" ? (
          <Film className="size-10 text-muted-foreground" />
        ) : (
          <FileText className="size-10 text-muted-foreground" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3">
        <p className="truncate text-xs font-medium text-foreground" title={asset.originalName}>
          {asset.originalName}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {formatBytes(asset.size)}
          {asset.width && asset.height ? ` · ${asset.width}×${asset.height}` : ""}
          {asset.folder ? ` · ${asset.folder}` : ""}
        </p>

        {editing ? (
          <form action={updateAction} className="mt-2 space-y-2">
            <input type="hidden" name="id" value={asset.id} />
            <Input
              name="alt"
              defaultValue={asset.alt}
              placeholder="Alt text"
              inputSize="sm"
              radius="md"
              aria-label="Alt text"
            />
            <Input
              name="folder"
              defaultValue={asset.folder}
              placeholder="Folder"
              inputSize="sm"
              radius="md"
              aria-label="Folder"
            />
            {updateState.error ? (
              <p className="text-[11px] text-destructive">{updateState.error}</p>
            ) : null}
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={updating}>
                {updating ? "Saving…" : "Save"}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-2 flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setEditing(true)}
              aria-label={`Edit ${asset.originalName}`}
            >
              <Pencil className="size-3.5" /> Edit
            </Button>
            <form
              action={deleteAction}
              onSubmit={(e) => {
                if (!confirm(`Delete "${asset.originalName}"? This cannot be undone.`)) {
                  e.preventDefault()
                }
              }}
            >
              <input type="hidden" name="id" value={asset.id} />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                disabled={deleting}
                className="text-destructive hover:text-destructive"
                aria-label={`Delete ${asset.originalName}`}
              >
                <Trash2 className="size-3.5" /> {deleting ? "Deleting…" : "Delete"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
