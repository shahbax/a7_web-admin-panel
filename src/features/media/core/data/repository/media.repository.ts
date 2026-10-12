import type { MediaAsset as PrismaMediaAsset, Prisma } from "@prisma/client"

import { prisma } from "@/shared/lib/db/prisma"
import type {
  MediaAsset,
  MediaListFilters,
} from "@/features/media/core/domain/entity"
import type {
  CreateMediaInput,
  IMediaRepository,
} from "@/features/media/core/domain/i-repository"

function toMediaAsset(row: PrismaMediaAsset): MediaAsset {
  return {
    id: row.id,
    filename: row.filename,
    originalName: row.originalName,
    path: row.path,
    url: row.url,
    mimeType: row.mimeType,
    kind: row.kind,
    size: row.size,
    width: row.width,
    height: row.height,
    alt: row.alt,
    folder: row.folder,
    uploadedById: row.uploadedById,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

class MediaRepository implements IMediaRepository {
  async list(filters: MediaListFilters): Promise<MediaAsset[]> {
    const where: Prisma.MediaAssetWhereInput = {}
    if (filters.kind) where.kind = filters.kind
    if (filters.folder !== undefined && filters.folder !== "") {
      where.folder = filters.folder
    }
    if (filters.search) {
      where.OR = [
        { originalName: { contains: filters.search, mode: "insensitive" } },
        { alt: { contains: filters.search, mode: "insensitive" } },
        { folder: { contains: filters.search, mode: "insensitive" } },
      ]
    }
    const rows = await prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 500,
    })
    return rows.map(toMediaAsset)
  }

  async getById(id: string): Promise<MediaAsset | null> {
    const row = await prisma.mediaAsset.findUnique({ where: { id } })
    return row ? toMediaAsset(row) : null
  }

  async create(input: CreateMediaInput): Promise<MediaAsset> {
    const row = await prisma.mediaAsset.create({ data: input })
    return toMediaAsset(row)
  }

  async update(
    id: string,
    data: { alt?: string; folder?: string },
  ): Promise<MediaAsset> {
    const row = await prisma.mediaAsset.update({ where: { id }, data })
    return toMediaAsset(row)
  }

  async delete(id: string): Promise<MediaAsset | null> {
    const row = await prisma.mediaAsset.findUnique({ where: { id } })
    if (!row) return null
    await prisma.mediaAsset.delete({ where: { id } })
    return toMediaAsset(row)
  }

  async listFolders(): Promise<string[]> {
    const rows = await prisma.mediaAsset.findMany({
      distinct: ["folder"],
      select: { folder: true },
      orderBy: { folder: "asc" },
    })
    return rows.map((r) => r.folder).filter((f) => f !== "")
  }
}

export const mediaRepository: IMediaRepository = new MediaRepository()
