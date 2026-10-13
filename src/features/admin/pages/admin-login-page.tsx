import type { Metadata } from "next"
import Image from "next/image"
import { redirect } from "next/navigation"

import { getCurrentUser } from "@/features/auth/services/guards"
import { AdminLoginForm } from "@/features/admin/ui/admin-login-form"

export const adminLoginMetadata: Metadata = {
  title: "Admin sign in · A7 Group",
  robots: { index: false, follow: false },
}

export async function AdminLoginRoute({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const user = await getCurrentUser()
  if (user) redirect("/admin")

  const { from } = await searchParams

  return (
    <main className="flex min-h-svh items-center justify-center bg-[#f8f9fb] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/assets/logo/a7-group-logo.svg"
            alt="A7 Group"
            width={160}
            height={34}
            unoptimized
            priority
            className="h-9 w-auto"
          />
          <h1 className="mt-6 text-xl font-semibold text-foreground">Admin panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage the A7 Group website.
          </p>
        </div>

        <AdminLoginForm redirectFrom={from} />
      </div>
    </main>
  )
}
