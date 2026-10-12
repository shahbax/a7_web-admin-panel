import {
  LayoutDashboard,
  Image as ImageIcon,
  type LucideIcon,
} from "lucide-react"

import type { Role } from "@/features/auth/core/domain/entity"
import { roleAtLeast } from "@/features/auth/core/domain/entity"

export type AdminNavItem = {
  label: string
  href: string
  icon: LucideIcon
  /** Minimum role required to see this item. Defaults to EDITOR. */
  minRole?: Role
  badge?: string
}

/**
 * Admin navigation. Items are added here as each phase ships its screens, so
 * the sidebar never shows dead links. Phase 1 ships Dashboard + Media library.
 */
export const adminNavItems: readonly AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Media library", href: "/admin/media", icon: ImageIcon },
]

export function visibleNavItems(role: Role): AdminNavItem[] {
  return adminNavItems.filter((item) =>
    roleAtLeast(role, item.minRole ?? "EDITOR"),
  )
}
