import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { requireUser } from "@/features/auth/services/guards"
import { CONTENT_GROUP_ORDER, listContentDefinitions } from "@/features/cms/site-content/registry"
import { getContentForEdit, listContentStatuses, listContentVersions } from "@/features/cms/site-content/service"
import { ContentEditor } from "@/features/cms/site-content/ui/content-editor"

export const contentIndexMetadata: Metadata = {
  title: "Website content · A7 Group admin",
  robots: { index: false, follow: false },
}

export const contentEditorMetadata: Metadata = {
  title: "Edit content · A7 Group admin",
  robots: { index: false, follow: false },
}

export async function ContentIndexRoute() {
  await requireUser()
  const defs = listContentDefinitions()
  const statuses = await listContentStatuses()

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold text-foreground">Website content</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Edit the text, images, buttons and sections of every page on the website. Changes go live when you publish.
      </p>

      {CONTENT_GROUP_ORDER.map((group) => {
        const items = defs.filter((d) => d.group === group)
        if (items.length === 0) return null
        return (
          <section key={group} className="mt-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((d) => {
                const s = statuses[d.key]
                return (
                  <li key={d.key}>
                    <Link
                      href={`/admin/content/${encodeURIComponent(d.key)}`}
                      className="block h-full rounded-xl border border-border bg-white p-4 transition hover:border-primary hover:shadow-sm"
                    >
                      <span className="block font-medium text-foreground">{d.label}</span>
                      {d.previewPath ? <span className="block text-xs text-muted-foreground">{d.previewPath}</span> : null}
                      <span className="mt-2 inline-block rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        {s?.unpublished ? "Unpublished changes" : s?.customized ? "Edited" : "Original"}
                        {d.kind === "list" ? " · list" : ""}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

export async function ContentEditorRoute({ params }: { params: Promise<{ key: string }> }) {
  await requireUser()
  const { key } = await params
  const decoded = decodeURIComponent(key)
  const state = await getContentForEdit(decoded)
  if (!state) notFound()
  const versions = await listContentVersions(decoded)

  return (
    <div>
      <div className="border-b border-border bg-white px-6 py-2 text-sm text-muted-foreground">
        <Link href="/admin/content" className="hover:underline">Website content</Link> / {state.info.group}
      </div>
      <ContentEditor key={state.updatedAt ?? "new"} state={state} versions={versions} />
    </div>
  )
}
