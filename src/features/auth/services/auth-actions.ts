"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AuthError } from "next-auth"
import { z } from "zod"

import { auth, signIn, signOut } from "@/auth"
import { prisma } from "@/shared/lib/db/prisma"
import { recordAudit } from "@/shared/lib/audit/audit-log"
import { checkLoginRateLimit } from "@/features/auth/services/rate-limit"

export type AuthActionState = {
  error?: string
}

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
})

async function getClientIp(): Promise<string> {
  const h = await headers()
  const forwarded = h.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]!.trim()
  return h.get("x-real-ip") ?? "unknown"
}

function safeReturnTo(from: string): string {
  // Only allow internal admin paths to prevent open-redirect.
  if (from.startsWith("/admin") && !from.startsWith("/admin/login")) return from
  return "/admin"
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." }
  }

  const email = parsed.data.email.trim().toLowerCase()
  const ip = await getClientIp()

  const limit = await checkLoginRateLimit(email, ip)
  if (limit.blocked) {
    return {
      error: `Too many failed attempts. Try again in ${limit.retryAfterMinutes} minutes.`,
    }
  }

  const from = safeReturnTo(String(formData.get("from") ?? "/admin"))

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      // Attempt recording/throttling is handled inside authorize(); here we
      // only surface a friendly message and audit the failure.
      await recordAudit({
        userEmail: email,
        action: "auth.login_failed",
        summary: "Failed login attempt",
        ip,
      })
      return { error: "Invalid email or password." }
    }
    throw error
  }

  const user = await prisma.user.findUnique({ where: { email } })
  await recordAudit({
    userId: user?.id,
    userEmail: email,
    action: "auth.login",
    summary: "Signed in",
    ip,
  })

  redirect(from)
}

export async function logoutAction(): Promise<void> {
  const session = await auth()
  if (session?.user?.email) {
    await recordAudit({
      userId: session.user.id,
      userEmail: session.user.email,
      action: "auth.logout",
      summary: "Signed out",
    })
  }
  await signOut({ redirectTo: "/admin/login" })
}
