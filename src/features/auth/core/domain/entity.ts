// Roles mirror the Prisma `Role` enum. Kept as a plain string union here so it
// can be imported by client components without pulling in @prisma/client.
export type Role = "OWNER" | "ADMIN" | "EDITOR"

export const ROLES: readonly Role[] = ["OWNER", "ADMIN", "EDITOR"] as const

// Higher number = more privilege. Used for "at least this role" checks.
const ROLE_RANK: Record<Role, number> = {
  EDITOR: 1,
  ADMIN: 2,
  OWNER: 3,
}

/** True when `role` has at least the privilege of `required`. */
export function roleAtLeast(role: Role, required: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[required]
}

/** Only owners manage users. */
export function canManageUsers(role: Role): boolean {
  return role === "OWNER"
}

/** Owners and admins manage settings; editors do not. */
export function canManageSettings(role: Role): boolean {
  return roleAtLeast(role, "ADMIN")
}

/** All roles can manage content. */
export function canManageContent(role: Role): boolean {
  return roleAtLeast(role, "EDITOR")
}

export type AuthUser = {
  id: string
  email: string
  name: string
  role: Role
}

export type AuthSession = {
  user: AuthUser | null
  isAuthenticated: boolean
}
