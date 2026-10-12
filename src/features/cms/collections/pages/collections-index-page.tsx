import type { Metadata } from "next"
import Link from "next/link"

import { requireUser } from "@/features/auth/services/guards"
import { collectionRegistry } from "@/features/cms/collections/registry"
import { countByCollection } from "@/features/cms/collections/core/repository"

export const collectionsIndexMetadata: Metadata = {
  title: "Collections · A7 Group admin",
  robots: { index: false, follow: false },
}

export async function CollectionsIndexRoute() {
  await requireUser()
  const counts = await countByCollection()

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Collections</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage reusable content: testimonials, FAQs, news, events, careers, services,
          developers, areas, projects, hero slides and partner logos.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collectionRegistry.map((c) => (
          <Link
            key={c.key}
            href={`/admin/collections/${c.key}`}
            className="rounded-xl border border-border bg-white p-5 transition-colors hover:border-foreground/20 hover:bg-neutral-50"
          >
            <h2 className="text-sm font-semibold text-foreground">{c.label}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{counts[c.key] ?? 0} items</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
