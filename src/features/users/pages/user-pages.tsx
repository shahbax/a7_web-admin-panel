import type { Metadata } from "next"

import { requireUser, requireUserManagement } from "@/features/auth/services/guards"
import { prisma } from "@/shared/lib/db/prisma"
import { UsersManager } from "@/features/users/ui/users-manager"
import { AccountForm } from "@/features/users/ui/account-form"

export const usersMetadata: Metadata = {
  title: "Users · A7 Group admin",
  robots: { index: false, follow: false },
}

export const accountMetadata: Metadata = {
  title: "My account · A7 Group admin",
  robots: { index: false, follow: false },
}

export async function UsersRoute() {
  const actor = await requireUserManagement()
  const rows = await prisma.user.findMany({ orderBy: [{ role: "asc" }, { createdAt: "asc" }] })
  return (
    <UsersManager
      currentUserId={actor.id}
      users={rows.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
        lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
      }))}
    />
  )
}

export async function AccountRoute() {
  const user = await requireUser()
  return <AccountForm name={user.name} email={user.email} role={user.role} />
}
