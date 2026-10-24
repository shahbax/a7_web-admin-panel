import {
  LayoutDashboard,
  Image as ImageIcon,
  FileText,
  Layers,
  Inbox,
  PanelsTopLeft,
  Users,
  History,
  UserCog,
  Settings as SettingsIcon,
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
 * the sidebar never shows dead links.
 */
export const adminNavItems: readonly AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Website content", href: "/admin/content", icon: PanelsTopLeft },
  { label: "Custom pages", href: "/admin/pages", icon: FileText },
  { label: "Collections", href: "/admin/collections", icon: Layers },
  { label: "Media library", href: "/admin/media", icon: ImageIcon },
  { label: "Leads", href: "/admin/leads", icon: Inbox },
  { label: "Settings", href: "/admin/settings", icon: SettingsIcon, minRole: "ADMIN" },
  { label: "Users", href: "/admin/users", icon: Users, minRole: "OWNER" },
  { label: "Activity log", href: "/admin/activity", icon: History, minRole: "ADMIN" },
  { label: "My account", href: "/admin/account", icon: UserCog },
]

export function visibleNavItems(role: Role): AdminNavItem[] {
  return adminNavItems.filter((item) =>
    roleAtLeast(role, item.minRole ?? "EDITOR"),
  )
}
