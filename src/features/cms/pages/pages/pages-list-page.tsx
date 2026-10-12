import type { Metadata } from "next"
import Link from "next/link"

import { requireUser } from "@/features/auth/services/guards"
import { listPages } from "@/features/cms/pages/services/page-service"
import { NewPageForm } from "@/features/cms/pages/ui/new-page-form"

export const pagesListMetadata: Metadata = {
  title: "Pages · A7 Group admin",
  robots: { index: false, follow: false },
}

export async function PagesListRoute() {
  await requireUser()
  const pages = await listPages()

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Pages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Build and manage CMS pages from on-brand blocks. New pages are served at their slug.
        </p>
      </header>

      <NewPageForm />

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-neutral-50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No pages yet. Create one above.
                </td>
              </tr>
            ) : (
              pages.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/pages/${p.id}`} className="font-medium text-foreground hover:underline">
                      {p.title}
                    </Link>
                    {p.isSystem ? <span className="ml-2 rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-muted-foreground">system</span> : null}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">/{p.slug}</td>
                  <td className="px-4 py-3">
                    <span className={p.status === "PUBLISHED" ? "rounded-full bg-[#E4F7E8] px-2 py-0.5 text-xs font-medium text-[#1B5E3B]" : "rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-muted-foreground"}>
                      {p.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(p.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
