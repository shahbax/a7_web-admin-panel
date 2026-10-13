import type { NextAuthConfig } from "next-auth"

import type { Role } from "@/features/auth/core/domain/entity"

/**
 * Edge-safe Auth.js configuration (no Node-only imports such as argon2 or
 * Prisma). Shared callbacks live here; the Credentials provider that needs the
 * database is added in `src/auth.ts`, which runs on the Node runtime.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
  },
  providers: [], // populated in src/auth.ts
} satisfies NextAuthConfig
