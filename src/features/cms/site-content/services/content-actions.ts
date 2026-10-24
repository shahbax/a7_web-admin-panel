"use server"

import { revalidatePath } from "next/cache"

import { requireUser } from "@/features/auth/services/guards"
import { recordAudit } from "@/shared/lib/audit/audit-log"
import { getContentDefinition } from "@/features/cms/site-content/registry"
import {
  discardContentDraft,
  publishContent,
  resetContentDraft,
  restoreContentVersion,
  saveContentDraft,
} from "@/features/cms/site-content/service"

export type ContentActionResult = { ok?: boolean; error?: string }

async function guard(key: string) {
  const user = await requireUser()
  const def = getContentDefinition(key)
  if (!def) throw new Error("Unknown content")
  return { user, def }
}

function adminPath(key: string) {
  return `/admin/content/${encodeURIComponent(key)}`
}

export async function saveContentDraftAction(
  key: string,
  content: unknown,
  layout?: unknown,
): Promise<ContentActionResult> {
  try {
    const { user } = await guard(key)
    await saveContentDraft(key, { content, layout }, user.id)
    revalidatePath(adminPath(key), "layout")
    return { ok: true }
  } catch (error) {
    console.error("[content] save failed", error)
    return { error: "Could not save. Try again." }
  }
}

export async function publishContentAction(
  key: string,
  content: unknown,
  layout?: unknown,
): Promise<ContentActionResult> {
  try {
    const { user, def } = await guard(key)
    await saveContentDraft(key, { content, layout }, user.id)
    await publishContent(key, user.id)
    await recordAudit({
      userId: user.id,
      userEmail: user.email,
      action: "content.publish",
      entityType: "ContentDoc",
      entityId: key,
      summary: `Published ${def.label}`,
    })
    revalidatePath(adminPath(key), "layout")
    return { ok: true }
  } catch (error) {
    console.error("[content] publish failed", error)
    return { error: "Could not publish. Try again." }
  }
}

export async function discardContentDraftAction(key: string): Promise<ContentActionResult> {
  await guard(key)
  await discardContentDraft(key)
  revalidatePath(adminPath(key), "layout")
  return { ok: true }
}

export async function resetContentAction(key: string): Promise<ContentActionResult> {
  const { user, def } = await guard(key)
  await resetContentDraft(key, user.id)
  await recordAudit({
    userId: user.id,
    userEmail: user.email,
    action: "content.reset",
    entityType: "ContentDoc",
    entityId: key,
    summary: `Reset ${def.label} draft to original content`,
  })
  revalidatePath(adminPath(key), "layout")
  return { ok: true }
}

export async function restoreContentVersionAction(
  key: string,
  versionId: string,
): Promise<ContentActionResult> {
  await guard(key)
  const ok = await restoreContentVersion(key, versionId)
  revalidatePath(adminPath(key), "layout")
  return ok ? { ok: true } : { error: "Version not found." }
}
