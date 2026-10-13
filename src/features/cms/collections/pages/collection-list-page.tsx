import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { requireUser } from "@/features/auth/services/guards"
import { getCollectionDef } from "@/features/cms/collections/registry"
import { listItems } from "@/features/cms/collections/core/repository"
import { NewItemForm } from "@/features/cms/collections/ui/new-item-form"
import { ItemRow } from "@/features/cms/collections/ui/item-row"

export const collectionListMetadata: Metadata = {
  title: "Collection · A7 Group admin",
  robots: { index: false, follow: false },
}

export async function CollectionListRoute({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>
  searchParams: Promise<{ q?: string }>
}) {
  await requireUser()
  const { collection } = await params
  const def = getCollectionDef(collection)
  if (!def) notFound()
  const { q } = await searchParams
  const items = await listItems(collection, { search: q?.trim() || undefined })

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <nav className="mb-2 text-sm text-muted-foreground">
        <Link href="/admin/collections" className="hover:underline">Collections</Link> / {def.label}
      </nav>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">{def.label}</h1>
      </header>

      <NewItemForm collection={def.key} singular={def.singular} />

      <form method="get" className="mt-4 flex gap-2">
        <input name="q" defaultValue={q ?? ""} placeholder="Search by title" className="h-9 w-64 rounded-md border border-input bg-background px-3 text-sm" />
        <button type="submit" className="rounded-md border border-input px-3 text-sm">Search</button>
      </form>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-neutral-50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No items yet.</td></tr>
            ) : (
              items.map((item) => <ItemRow key={item.id} item={item} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
