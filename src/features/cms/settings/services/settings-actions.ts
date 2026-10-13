"use server"

import { z } from "zod"

import { requireSettingsAccess } from "@/features/auth/services/guards"
import { recordAudit } from "@/shared/lib/audit/audit-log"
import {
  footerSettingsSchema,
  headerSettingsSchema,
  menuSettingsSchema,
  seoSettingsSchema,
  siteSettingsSchema,
  type SettingKey,
} from "@/features/cms/settings/schemas"
import {
  restoreSettingVersion,
  saveSetting,
} from "@/features/cms/settings/service"

export type SettingsActionState = { error?: string; ok?: boolean }

async function audit(key: SettingKey, userId: string, email: string) {
  await recordAudit({
    userId,
    userEmail: email,
    action: "settings.update",
    entityType: "SiteSetting",
    entityId: key,
    summary: `Updated ${key} settings`,
  })
}

function boolFromForm(form: FormData, name: string): boolean {
  const v = form.get(name)
  return v === "on" || v === "true" || v === "1"
}

export async function saveSiteSettingsAction(
  _prev: SettingsActionState,
  form: FormData,
): Promise<SettingsActionState> {
  const user = await requireSettingsAccess()
  const parsed = siteSettingsSchema.safeParse({
    companyName: form.get("companyName") ?? "",
    phone: form.get("phone") ?? "",
    whatsapp: form.get("whatsapp") ?? "",
    email: form.get("email") ?? "",
    officeAddress: form.get("officeAddress") ?? "",
    mapEmbedUrl: form.get("mapEmbedUrl") ?? "",
    openingHours: form.get("openingHours") ?? "",
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  await saveSetting("site", parsed.data, user.id)
  await audit("site", user.id, user.email)
  return { ok: true }
}

export async function saveSeoSettingsAction(
  _prev: SettingsActionState,
  form: FormData,
): Promise<SettingsActionState> {
  const user = await requireSettingsAccess()
  const parsed = seoSettingsSchema.safeParse({
    titleTemplate: form.get("titleTemplate") ?? "",
    defaultTitle: form.get("defaultTitle") ?? "",
    defaultDescription: form.get("defaultDescription") ?? "",
    ogImageUrl: form.get("ogImageUrl") ?? "",
    faviconUrl: form.get("faviconUrl") ?? "",
    ga4Id: form.get("ga4Id") ?? "",
    metaPixelId: form.get("metaPixelId") ?? "",
    indexable: boolFromForm(form, "indexable"),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  await saveSetting("seo", parsed.data, user.id)
  await audit("seo", user.id, user.email)
  return { ok: true }
}

export async function saveHeaderSettingsAction(
  _prev: SettingsActionState,
  form: FormData,
): Promise<SettingsActionState> {
  const user = await requireSettingsAccess()
  const parsed = headerSettingsSchema.safeParse({
    ctaLabel: form.get("ctaLabel") ?? "",
    ctaHref: form.get("ctaHref") ?? "",
    showSearch: boolFromForm(form, "showSearch"),
    logoLightUrl: form.get("logoLightUrl") ?? "",
    logoDarkUrl: form.get("logoDarkUrl") ?? "",
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  await saveSetting("header", parsed.data, user.id)
  await audit("header", user.id, user.email)
  return { ok: true }
}

// Menu + footer are edited as structured JSON (hidden field) by their editors.
const jsonSchema = z.string().min(2)

export async function saveMenuSettingsAction(
  _prev: SettingsActionState,
  form: FormData,
): Promise<SettingsActionState> {
  const user = await requireSettingsAccess()
  const raw = jsonSchema.safeParse(form.get("json"))
  if (!raw.success) return { error: "Missing menu data." }
  let data: unknown
  try {
    data = JSON.parse(raw.data)
  } catch {
    return { error: "Menu data is not valid JSON." }
  }
  const parsed = menuSettingsSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid menu." }
  await saveSetting("menu", parsed.data, user.id)
  await audit("menu", user.id, user.email)
  return { ok: true }
}

export async function saveFooterSettingsAction(
  _prev: SettingsActionState,
  form: FormData,
): Promise<SettingsActionState> {
  const user = await requireSettingsAccess()
  const raw = jsonSchema.safeParse(form.get("json"))
  if (!raw.success) return { error: "Missing footer data." }
  let data: unknown
  try {
    data = JSON.parse(raw.data)
  } catch {
    return { error: "Footer data is not valid JSON." }
  }
  const parsed = footerSettingsSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid footer." }
  await saveSetting("footer", parsed.data, user.id)
  await audit("footer", user.id, user.email)
  return { ok: true }
}

export async function restoreSettingVersionAction(
  _prev: SettingsActionState,
  form: FormData,
): Promise<SettingsActionState> {
  const user = await requireSettingsAccess()
  const key = String(form.get("key") ?? "") as SettingKey
  const versionId = String(form.get("versionId") ?? "")
  const ok = await restoreSettingVersion(key, versionId, user.id)
  if (!ok) return { error: "Could not restore that version." }
  await recordAudit({
    userId: user.id,
    userEmail: user.email,
    action: "settings.restore",
    entityType: "SiteSetting",
    entityId: key,
    summary: `Restored ${key} settings from version`,
  })
  return { ok: true }
}
