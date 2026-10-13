"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import type { AuthUser } from "@/features/auth/core/domain/entity"
import { visibleNavItems } from "@/features/admin/ui/admin-nav"
import { Badge } from "@/shared/ui/badge"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/shared/ui/drawer"
import { cn } from "@/shared/lib/cn"

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin"
  return pathname === href || pathname.startsWith(`${href}/`)
}

function SidebarBody({ user }: { user: AuthUser }) {
  const pathname = usePathname()
  const items = visibleNavItems(user.role)

  return (
    <>
      <div className="shrink-0 border-b border-sidebar-border px-4 py-4">
        <Link href="/admin" className="inline-flex items-center" aria-label="A7 Group admin">
          <Image
            src="/assets/logo/a7-group-logo.svg"
            alt="A7 Group"
            width={156}
            height={32}
            unoptimized
            priority
            className="h-8 w-auto"
          />
        </Link>
        <p className="mt-2 text-xs font-medium tracking-wide text-muted-foreground">
          Admin panel
        </p>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {items.map((item) => {
          const active = isActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0 opacity-70" aria-hidden />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.badge ? (
                <Badge
                  size="sm"
                  shape="pill"
                  className="border-[#B8E6C0] bg-[#E4F7E8] px-2 py-0.5 text-[10px] font-semibold normal-case text-[#1B5E3B]"
                >
                  {item.badge}
                </Badge>
              ) : null}
            </Link>
          )
        })}
      </nav>
    </>
  )
}

export type AdminSidebarProps = {
  user: AuthUser
  mobileOpen?: boolean
  onMobileOpenChange?: (open: boolean) => void
}

export function AdminSidebar({ user, mobileOpen = false, onMobileOpenChange }: AdminSidebarProps) {
  return (
    <>
      <aside
        data-slot="admin-sidebar"
        className="relative hidden h-full min-h-0 w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex"
      >
        <SidebarBody user={user} />
      </aside>

      <Drawer direction="left" open={mobileOpen} onOpenChange={(open) => onMobileOpenChange?.(open)}>
        <DrawerContent
          className="w-[85%] max-w-[280px] border-r border-sidebar-border bg-sidebar p-0 text-sidebar-foreground sm:max-w-[280px] lg:hidden"
          aria-describedby={undefined}
        >
          <DrawerTitle className="sr-only">Admin navigation</DrawerTitle>
          <DrawerDescription className="sr-only">Primary admin navigation menu</DrawerDescription>
          <div className="flex h-full min-h-0 flex-col">
            <SidebarBody user={user} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

AdminSidebar.displayName = "AdminSidebar"
