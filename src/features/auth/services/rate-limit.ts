import { prisma } from "@/shared/lib/db/prisma"

// Login throttling: a sliding window of failed attempts per email+ip.
const WINDOW_MINUTES = 15
const MAX_FAILED_ATTEMPTS = 8

export type RateLimitResult = {
  blocked: boolean
  retryAfterMinutes: number
}

/** Check whether this email/ip has exceeded the failed-login threshold. */
export async function checkLoginRateLimit(
  email: string,
  ip: string,
): Promise<RateLimitResult> {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000)
  const failed = await prisma.loginAttempt.count({
    where: {
      success: false,
      createdAt: { gte: since },
      OR: [{ email: email.toLowerCase() }, { ip }],
    },
  })
  return {
    blocked: failed >= MAX_FAILED_ATTEMPTS,
    retryAfterMinutes: WINDOW_MINUTES,
  }
}

export async function recordLoginAttempt(
  email: string,
  ip: string,
  success: boolean,
): Promise<void> {
  try {
    await prisma.loginAttempt.create({
      data: { email: email.toLowerCase(), ip, success },
    })
  } catch (error) {
    console.error("[rate-limit] failed to record login attempt", error)
  }
}

/** Clear failed attempts after a successful login (best-effort). */
export async function clearFailedAttempts(email: string): Promise<void> {
  try {
    await prisma.loginAttempt.deleteMany({
      where: { email: email.toLowerCase(), success: false },
    })
  } catch {
    // non-fatal
  }
}
