import { cache } from "react"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { prisma } from "@/shared/lib/db/prisma"
import {
  type AuthUser,
  type Role,
  canManageSettings,
  canManageUsers,
  roleAtLeast,
} from "@/features/auth/core/domain/entity"

const loadActiveUser = cache(async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  })
  return user?.isActive ? user : null
})

/**
 * Server-side session accessor. Returns the signed-in admin user, or null.
 * This is the source of truth for authorization — the proxy only does a cheap
 * cookie-presence check, so every admin page and server action calls one of
 * these guards.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await auth()
  if (!session?.user?.id || !session.user.email || !session.user.role) {
    return null
  }
  // The session is a signed token; re-read the account so deactivation, deletion
  // and role changes take effect immediately rather than when the token expires.
  const dbUser = await loadActiveUser(session.user.id)
  if (!dbUser) return null
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
  }
}

/** Require any authenticated admin user; redirect to login otherwise. */
export async function requireUser(returnTo?: string): Promise<AuthUser> {
  const user = await getCurrentUser()
  if (!user) {
    const to = returnTo ? `?from=${encodeURIComponent(returnTo)}` : ""
    redirect(`/admin/login${to}`)
  }
  return user
}

/** Require at least the given role; 403 to the admin home otherwise. */
export async function requireRole(required: Role): Promise<AuthUser> {
  const user = await requireUser()
  if (!roleAtLeast(user.role, required)) {
    redirect("/admin?error=forbidden")
  }
  return user
}

export async function requireSettingsAccess(): Promise<AuthUser> {
  const user = await requireUser()
  if (!canManageSettings(user.role)) redirect("/admin?error=forbidden")
  return user
}

export async function requireUserManagement(): Promise<AuthUser> {
  const user = await requireUser()
  if (!canManageUsers(user.role)) redirect("/admin?error=forbidden")
  return user
}
