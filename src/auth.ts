import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { verify } from "@node-rs/argon2"
import { z } from "zod"

import { authConfig } from "@/auth.config"
import { prisma } from "@/shared/lib/db/prisma"
import {
  checkLoginRateLimit,
  clearFailedAttempts,
  recordLoginAttempt,
} from "@/features/auth/services/rate-limit"

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

function ipFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]!.trim()
  return request.headers.get("x-real-ip") ?? "unknown"
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // Enforcement lives here so it applies to every login path, including a
      // direct POST to the Auth.js callback endpoint (not just the admin form).
      async authorize(raw, request) {
        const parsed = credentialsSchema.safeParse(raw)
        if (!parsed.success) return null

        const email = parsed.data.email.trim().toLowerCase()
        const ip = ipFromRequest(request)

        const limit = await checkLoginRateLimit(email, ip)
        if (limit.blocked) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.isActive) {
          await recordLoginAttempt(email, ip, false)
          return null
        }

        const ok = await verify(user.passwordHash, parsed.data.password)
        if (!ok) {
          await recordLoginAttempt(email, ip, false)
          return null
        }

        await recordLoginAttempt(email, ip, true)
        await clearFailedAttempts(email)
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
})
