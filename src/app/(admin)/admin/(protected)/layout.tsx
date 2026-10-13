import type { Metadata } from "next"

import { requireUser } from "@/features/auth/services/guards"
import { AdminShell } from "@/features/admin"

export const metadata: Metadata = {
  title: "Admin · A7 Group",
  robots: { index: false, follow: false },
}

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Server-side auth guard. The proxy only does a cheap cookie check; this is
  // the real gate, re-run on every request to a protected admin page.
  const user = await requireUser()

  return <AdminShell user={user}>{children}</AdminShell>
}
