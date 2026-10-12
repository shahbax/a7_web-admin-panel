import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { requireUser } from "@/features/auth/services/guards"
import { getCollectionDef } from "@/features/cms/collections/registry"
import { getItem } from "@/features/cms/collections/core/repository"
import { ItemEditor } from "@/features/cms/collections/ui/item-editor"

export const itemEditorMetadata: Metadata = {
  title: "Edit item · A7 Group admin",
  robots: { index: false, follow: false },
}

export async function ItemEditorRoute({
  params,
}: {
  params: Promise<{ collection: string; id: string }>
}) {
  await requireUser()
  const { collection, id } = await params
  const def = getCollectionDef(collection)
  if (!def) notFound()
  const item = await getItem(id)
  if (!item || item.collection !== collection) notFound()

  return (
    <div>
      <div className="border-b border-border bg-white px-6 py-2 text-sm text-muted-foreground">
        <Link href="/admin/collections" className="hover:underline">Collections</Link> /{" "}
        <Link href={`/admin/collections/${collection}`} className="hover:underline">{def.label}</Link>
      </div>
      <ItemEditor item={item} def={def} />
    </div>
  )
}
