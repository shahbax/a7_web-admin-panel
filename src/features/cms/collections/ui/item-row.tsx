"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import type { CollectionItemDTO } from "@/features/cms/collections/core/repository"
import {
  deleteItemAction,
  moveItemAction,
  setStatusAction,
} from "@/features/cms/collections/services/collection-actions"
import { Button } from "@/shared/ui/button"

export function ItemRow({ item }: { item: CollectionItemDTO }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const run = (fn: () => Promise<unknown>) =>
    startTransition(async () => {
      await fn()
      router.refresh()
    })

  const toggle = () => {
    const fd = new FormData()
    fd.set("id", item.id)
    fd.set("status", item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED")
    run(() => setStatusAction({}, fd))
  }
  const move = (direction: "up" | "down") => {
    const fd = new FormData()
    fd.set("id", item.id)
    fd.set("direction", direction)
    run(() => moveItemAction({}, fd))
  }
  const remove = () => {
    if (!confirm(`Delete "${item.title}"?`)) return
    const fd = new FormData()
    fd.set("id", item.id)
    run(() => deleteItemAction({}, fd))
  }

  return (
    <tr className="hover:bg-neutral-50">
      <td className="px-4 py-3">
        <Link href={`/admin/collections/${item.collection}/${item.id}`} className="font-medium text-foreground hover:underline">
          {item.title || "Untitled"}
        </Link>
      </td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={toggle}
          disabled={pending}
          className={item.status === "PUBLISHED" ? "rounded-full bg-[#E4F7E8] px-2 py-0.5 text-xs font-medium text-[#1B5E3B]" : "rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-muted-foreground"}
        >
          {item.status === "PUBLISHED" ? "Published" : "Draft"}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <Button type="button" size="icon" variant="ghost" onClick={() => move("up")} disabled={pending} aria-label="Move up"><ChevronUp className="size-4" /></Button>
          <Button type="button" size="icon" variant="ghost" onClick={() => move("down")} disabled={pending} aria-label="Move down"><ChevronDown className="size-4" /></Button>
          <Button type="button" size="sm" variant="ghost" className="text-destructive" onClick={remove} disabled={pending}>Delete</Button>
        </div>
      </td>
    </tr>
  )
}
