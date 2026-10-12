import "server-only"

import { cache } from "react"
import { revalidatePath } from "next/cache"

import { prisma } from "@/shared/lib/db/prisma"
import {
  SETTING_KEYS,
  type SettingKey,
  type SettingValue,
  settingDefaults,
  settingSchemas,
} from "@/features/cms/settings/schemas"

export type AllSettings = {
  site: SettingValue<"site">
  seo: SettingValue<"seo">
  header: SettingValue<"header">
  menu: SettingValue<"menu">
  footer: SettingValue<"footer">
}

const MAX_VERSIONS = 20

async function loadAll(): Promise<AllSettings> {
  const rows = await prisma.siteSetting.findMany()
  const byKey = new Map(rows.map((r) => [r.key, r.data]))
  const result = {} as AllSettings
  for (const key of SETTING_KEYS) {
    const stored = byKey.get(key)
    const parsed = stored ? settingSchemas[key].safeParse(stored) : null
    // @ts-expect-error indexed assignment across the union is safe here
    result[key] = parsed?.success ? parsed.data : settingDefaults[key]
  }
  return result
}

/**
 * Effective settings (DB override over code defaults), deduped per request.
 * Public pages are statically rendered and read this at build/revalidation
 * time; `saveSetting` calls revalidatePath to regenerate them on publish, so
 * pages stay static rather than becoming request-dynamic.
 */
export const getSettings = cache(loadAll)

export async function getSetting<K extends SettingKey>(
  key: K,
): Promise<SettingValue<K>> {
  const all = await getSettings()
  return all[key] as SettingValue<K>
}

/** Raw stored value (uncached) for the admin editor — returns default if unset. */
export async function getSettingForEdit<K extends SettingKey>(
  key: K,
): Promise<SettingValue<K>> {
  const row = await prisma.siteSetting.findUnique({ where: { key } })
  if (!row) return settingDefaults[key] as SettingValue<K>
  const parsed = settingSchemas[key].safeParse(row.data)
  return (parsed.success ? parsed.data : settingDefaults[key]) as SettingValue<K>
}

export async function saveSetting<K extends SettingKey>(
  key: K,
  data: SettingValue<K>,
  userId?: string,
): Promise<void> {
  const json = JSON.parse(JSON.stringify(data))
  await prisma.$transaction(async (tx) => {
    await tx.siteSetting.upsert({
      where: { key },
      create: { key, data: json, updatedById: userId ?? null },
      update: { data: json, updatedById: userId ?? null },
    })
    await tx.version.create({
      data: { entityType: "setting", entityId: key, data: json, createdById: userId ?? null },
    })
    // Prune to the most recent MAX_VERSIONS snapshots.
    const old = await tx.version.findMany({
      where: { entityType: "setting", entityId: key },
      orderBy: { createdAt: "desc" },
      skip: MAX_VERSIONS,
      select: { id: true },
    })
    if (old.length > 0) {
      await tx.version.deleteMany({ where: { id: { in: old.map((v) => v.id) } } })
    }
  })
  // Regenerate every public page (they share the root layout that reads these).
  revalidatePath("/", "layout")
}

export type SettingVersionSummary = {
  id: string
  createdAt: string
  createdById: string | null
}

export async function listSettingVersions(
  key: SettingKey,
): Promise<SettingVersionSummary[]> {
  const rows = await prisma.version.findMany({
    where: { entityType: "setting", entityId: key },
    orderBy: { createdAt: "desc" },
    take: MAX_VERSIONS,
  })
  return rows.map((r) => ({
    id: r.id,
    createdAt: r.createdAt.toISOString(),
    createdById: r.createdById,
  }))
}

export async function restoreSettingVersion(
  key: SettingKey,
  versionId: string,
  userId?: string,
): Promise<boolean> {
  const version = await prisma.version.findUnique({ where: { id: versionId } })
  if (!version || version.entityType !== "setting" || version.entityId !== key) {
    return false
  }
  const parsed = settingSchemas[key].safeParse(version.data)
  if (!parsed.success) return false
  await saveSetting(key, parsed.data as SettingValue<typeof key>, userId)
  return true
}
