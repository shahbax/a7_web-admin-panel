import { PrismaClient } from "@prisma/client"
import { hash } from "@node-rs/argon2"

const prisma = new PrismaClient()

async function main() {
  const email = process.env.OWNER_EMAIL?.trim().toLowerCase()
  const password = process.env.OWNER_PASSWORD
  const name = process.env.OWNER_NAME?.trim() || "A7 Owner"

  if (!email || !password) {
    console.error(
      "[seed] OWNER_EMAIL and OWNER_PASSWORD must be set. Skipping owner seed.",
    )
    return
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`[seed] Owner ${email} already exists (role=${existing.role}).`)
    return
  }

  const passwordHash = await hash(password)
  const owner = await prisma.user.create({
    data: { email, name, passwordHash, role: "OWNER", isActive: true },
  })
  console.log(`[seed] Created owner ${owner.email} (id=${owner.id}).`)
}

main()
  .catch((error) => {
    console.error("[seed] failed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
