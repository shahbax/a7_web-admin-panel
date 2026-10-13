import type { Metadata } from "next"

import { requireUser } from "@/features/auth/services/guards"
import { mediaRepository } from "@/features/media/core/data/repository/media.repository"
import { MediaLibrary } from "@/features/media/ui/media-library"

export const mediaLibraryMetadata: Metadata = {
  title: "Media library · A7 Group admin",
  robots: { index: false, follow: false },
}

export async function MediaLibraryRoute({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; folder?: string }>
}) {
  await requireUser()
  const { search, folder } = await searchParams
  const filters = {
    search: search?.trim() || undefined,
    folder: folder || undefined,
  }

  const [assets, folders] = await Promise.all([
    mediaRepository.list(filters),
    mediaRepository.listFolders(),
  ])

  return <MediaLibrary assets={assets} folders={folders} filters={filters} />
}
