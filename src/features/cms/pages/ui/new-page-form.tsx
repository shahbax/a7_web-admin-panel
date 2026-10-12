"use client"

import { useActionState } from "react"

import { createPageAction, type PageActionState } from "@/features/cms/pages/services/page-actions"
import { Button } from "@/shared/ui/button"

const initial: PageActionState = {}

export function NewPageForm() {
  const [state, action, pending] = useActionState(createPageAction, initial)
  return (
    <form action={action} className="rounded-xl border border-border bg-white p-5">
      <h2 className="text-sm font-semibold text-foreground">Add a new page</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Title</span>
          <input name="title" required className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" placeholder="e.g. Buy off-plan in Dubai" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Slug (optional)</span>
          <input name="slug" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" placeholder="auto from title" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Template</span>
          <select name="template" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="default">Default</option>
            <option value="service">Service</option>
            <option value="landing">Landing</option>
          </select>
        </label>
      </div>
      {state.error ? <p className="mt-3 text-sm text-destructive">{state.error}</p> : null}
      <div className="mt-4">
        <Button type="submit" disabled={pending}>{pending ? "Creating…" : "Create page"}</Button>
      </div>
    </form>
  )
}
