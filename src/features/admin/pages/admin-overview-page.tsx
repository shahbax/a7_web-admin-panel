import Link from "next/link"
import { Image as ImageIcon } from "lucide-react"

import { requireUser } from "@/features/auth/services/guards"
import { mediaRepository } from "@/features/media/core/data/repository/media.repository"

export async function AdminOverviewRoute() {
  const user = await requireUser()
  const mediaCount = (await mediaRepository.list({})).length

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the A7 Group website content from here. More tools arrive with each phase.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/media"
          className="group rounded-xl border border-border bg-white p-5 transition-colors hover:border-foreground/20 hover:bg-neutral-50"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-[#E4F7E8] text-[#1B5E3B]">
              <ImageIcon className="size-5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Media library</h2>
              <p className="text-xs text-muted-foreground">{mediaCount} files</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Upload and organise images, video and PDFs with alt text.
          </p>
        </Link>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        Signed in as {user.email} · role {user.role.toLowerCase()}
      </p>
    </div>
  )
}
