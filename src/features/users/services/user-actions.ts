"use server"

import { revalidatePath } from "next/cache"
import { hash, verify } from "@node-rs/argon2"
import { z } from "zod"

import { prisma } from "@/shared/lib/db/prisma"
import { recordAudit } from "@/shared/lib/audit/audit-log"
import { requireUser, requireUserManagement } from "@/features/auth/services/guards"

export type UserActionResult = { ok?: boolean; error?: string }

const password = z.string().min(12, "Password must be at least 12 characters.").max(200)
const role = z.enum(["OWNER", "ADMIN", "EDITOR"])

const createSchema = z.object({
  name: z.string().trim().min(1, "Enter a name.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email."),
  role,
  password,
})

function firstError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid input."
}

async function activeOwnerCount(excludeId?: string) {
  return prisma.user.count({ where: { role: "OWNER", isActive: true, id: excludeId ? { not: excludeId } : undefined } })
}

export async function createUserAction(input: z.input<typeof createSchema>): Promise<UserActionResult> {
  const actor = await requireUserManagement()
  const parsed = createSchema.safeParse(input)
  if (!parsed.success) return { error: firstError(parsed.error) }
  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (exists) return { error: "A user with this email already exists." }
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      passwordHash: await hash(parsed.data.password),
    },
  })
  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "user.create",
    entityType: "User",
    entityId: user.id,
    summary: `Added ${user.email} as ${user.role.toLowerCase()}`,
  })
  revalidatePath("/admin/users")
  return { ok: true }
}

const updateSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(120),
  role,
  isActive: z.boolean(),
})

export async function updateUserAction(input: z.input<typeof updateSchema>): Promise<UserActionResult> {
  const actor = await requireUserManagement()
  const parsed = updateSchema.safeParse(input)
  if (!parsed.success) return { error: firstError(parsed.error) }
  const { id, name, isActive } = parsed.data
  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) return { error: "User not found." }
  const losesOwner = target.role === "OWNER" && (parsed.data.role !== "OWNER" || !isActive)
  if (losesOwner && (await activeOwnerCount(id)) === 0) {
    return { error: "There must always be at least one active owner." }
  }
  if (id === actor.id && !isActive) return { error: "You can't deactivate your own account." }
  await prisma.user.update({ where: { id }, data: { name, role: parsed.data.role, isActive } })
  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "user.update",
    entityType: "User",
    entityId: id,
    summary: `Updated ${target.email}: ${parsed.data.role.toLowerCase()}, ${isActive ? "active" : "deactivated"}`,
  })
  revalidatePath("/admin/users")
  return { ok: true }
}

export async function setUserPasswordAction(id: string, newPassword: string): Promise<UserActionResult> {
  const actor = await requireUserManagement()
  const parsed = password.safeParse(newPassword)
  if (!parsed.success) return { error: firstError(parsed.error) }
  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) return { error: "User not found." }
  await prisma.user.update({ where: { id }, data: { passwordHash: await hash(parsed.data) } })
  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "user.password",
    entityType: "User",
    entityId: id,
    summary: `Set a new password for ${target.email}`,
  })
  return { ok: true }
}

export async function deleteUserAction(id: string): Promise<UserActionResult> {
  const actor = await requireUserManagement()
  if (id === actor.id) return { error: "You can't delete your own account." }
  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) return { error: "User not found." }
  if (target.role === "OWNER" && (await activeOwnerCount(id)) === 0) {
    return { error: "There must always be at least one active owner." }
  }
  await prisma.user.delete({ where: { id } })
  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "user.delete",
    entityType: "User",
    entityId: id,
    summary: `Removed ${target.email}`,
  })
  revalidatePath("/admin/users")
  return { ok: true }
}

/** Any signed-in user changes their own password. */
export async function changeOwnPasswordAction(current: string, next: string): Promise<UserActionResult> {
  const actor = await requireUser()
  const parsed = password.safeParse(next)
  if (!parsed.success) return { error: firstError(parsed.error) }
  const user = await prisma.user.findUnique({ where: { id: actor.id } })
  if (!user || !(await verify(user.passwordHash, current))) {
    return { error: "Your current password is incorrect." }
  }
  await prisma.user.update({ where: { id: actor.id }, data: { passwordHash: await hash(parsed.data) } })
  await recordAudit({
    userId: actor.id,
    userEmail: actor.email,
    action: "user.password.self",
    entityType: "User",
    entityId: actor.id,
    summary: "Changed own password",
  })
  return { ok: true }
}
