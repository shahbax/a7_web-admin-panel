"use client"

import { useState } from "react"

import type { AuthUser } from "@/features/auth/core/domain/entity"
import { AdminHeader } from "@/features/admin/ui/admin-header"
import { AdminSidebar } from "@/features/admin/ui/admin-sidebar"

export type AdminShellProps = {
  user: AuthUser
  title?: string
  children: React.ReactNode
}

export function AdminShell({ user, title, children }: AdminShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-svh max-h-svh min-h-0 w-full overflow-hidden bg-[#f8f9fb]">
      <AdminSidebar
        user={user}
        mobileOpen={mobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader
          user={user}
          title={title}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-[#f8f9fb]">
          {children}
        </main>
      </div>
    </div>
  )
}

AdminShell.displayName = "AdminShell"
