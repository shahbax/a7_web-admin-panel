import type {
  MediaAsset,
  MediaListFilters,
} from "@/features/media/core/domain/entity"

export type CreateMediaInput = {
  filename: string
  originalName: string
  path: string
  url: string
  mimeType: string
  kind: MediaAsset["kind"]
  size: number
  width: number | null
  height: number | null
  alt: string
  folder: string
  uploadedById: string | null
}

export interface IMediaRepository {
  list(filters: MediaListFilters): Promise<MediaAsset[]>
  getById(id: string): Promise<MediaAsset | null>
  create(input: CreateMediaInput): Promise<MediaAsset>
  update(id: string, data: { alt?: string; folder?: string }): Promise<MediaAsset>
  delete(id: string): Promise<MediaAsset | null>
  listFolders(): Promise<string[]>
}
