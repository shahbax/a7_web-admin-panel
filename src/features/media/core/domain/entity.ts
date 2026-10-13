export type MediaKind = "IMAGE" | "VIDEO" | "PDF" | "OTHER"

export type MediaAsset = {
  id: string
  filename: string
  originalName: string
  path: string
  url: string
  mimeType: string
  kind: MediaKind
  size: number
  width: number | null
  height: number | null
  alt: string
  folder: string
  uploadedById: string | null
  createdAt: string
  updatedAt: string
}

export type MediaListFilters = {
  search?: string
  folder?: string
  kind?: MediaKind
}
