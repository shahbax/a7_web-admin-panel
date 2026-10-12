"use client"

import { LogOut, Menu } from "lucide-react"

import type { AuthUser } from "@/features/auth/core/domain/entity"
import { logoutAction } from "@/features/auth/services/auth-actions"
import { Avatar, AvatarFallback } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

const ROLE_LABEL: Record<AuthUser["role"], string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  EDITOR: "Editor",
}

export type AdminHeaderProps = {
  user: AuthUser
  title?: string
  onOpenMobileSidebar?: () => void
}

export function AdminHeader({ user, title, onOpenMobileSidebar }: AdminHeaderProps) {
  return (
    <header
      data-slot="admin-header"
      className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-white px-3 sm:gap-4 sm:px-6"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </Button>
        {title ? (
          <h1 className="truncate text-sm font-semibold text-foreground sm:text-base">{title}</h1>
        ) : null}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Account menu"
            >
              <Avatar size="sm">
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-1">
              <span className="truncate text-sm font-medium">{user.name}</span>
              <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
              <Badge
                size="sm"
                shape="pill"
                className="mt-1 w-fit border-[#B8E6C0] bg-[#E4F7E8] px-2 py-0.5 text-[10px] font-semibold normal-case text-[#1B5E3B]"
              >
                {ROLE_LABEL[user.role]}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <form action={logoutAction}>
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full cursor-pointer">
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

AdminHeader.displayName = "AdminHeader"
