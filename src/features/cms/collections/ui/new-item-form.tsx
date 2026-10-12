"use client"

import { useActionState } from "react"

import {
  createItemAction,
  type CollectionActionState,
} from "@/features/cms/collections/services/collection-actions"
import { Button } from "@/shared/ui/button"

const initial: CollectionActionState = {}

export function NewItemForm({ collection, singular }: { collection: string; singular: string }) {
  const [state, action, pending] = useActionState(createItemAction, initial)
  return (
    <form action={action} className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-white p-4">
      <input type="hidden" name="collection" value={collection} />
      <label className="min-w-[220px] flex-1">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">New {singular.toLowerCase()} title</span>
        <input name="title" required className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" placeholder={`${singular} title`} />
      </label>
      <Button type="submit" disabled={pending}>{pending ? "Adding…" : `Add ${singular.toLowerCase()}`}</Button>
      {state.error ? <p className="w-full text-sm text-destructive">{state.error}</p> : null}
    </form>
  )
}
