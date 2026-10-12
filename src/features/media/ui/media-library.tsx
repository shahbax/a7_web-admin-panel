import { Search } from "lucide-react"

import type {
  MediaAsset,
  MediaListFilters,
} from "@/features/media/core/domain/entity"
import { MediaCard } from "@/features/media/ui/media-card"
import { MediaUploader } from "@/features/media/ui/media-uploader"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"

export type MediaLibraryProps = {
  assets: MediaAsset[]
  folders: string[]
  filters: MediaListFilters
}

export function MediaLibrary({ assets, folders, filters }: MediaLibraryProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Media library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload and manage images, video and PDFs used across the website.
        </p>
      </header>

      <MediaUploader folders={folders} />

      <form method="get" className="mt-8 flex flex-wrap items-end gap-3">
        <div className="min-w-[220px] flex-1">
          <label htmlFor="search" className="mb-1 block text-xs font-medium text-muted-foreground">
            Search
          </label>
          <Input
            id="search"
            name="search"
            defaultValue={filters.search ?? ""}
            placeholder="Search name, alt text or folder"
            inputSize="md"
            radius="md"
            icon={<Search className="size-4" />}
          />
        </div>
        <div className="min-w-[160px]">
          <label htmlFor="folder" className="mb-1 block text-xs font-medium text-muted-foreground">
            Folder
          </label>
          <select
            id="folder"
            name="folder"
            defaultValue={filters.folder ?? ""}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All folders</option>
            {folders.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      <div className="mt-6">
        {assets.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-white p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No media yet. Upload your first file above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {assets.map((asset) => (
              <MediaCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
