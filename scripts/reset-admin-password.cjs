const { PrismaClient } = require("@prisma/client")
const { hash } = require("@node-rs/argon2")
const prisma = new PrismaClient()
;(async () => {
  const email = (process.env.RESET_EMAIL || "").trim().toLowerCase()
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) { console.error("No admin user with email " + email); process.exit(1) }
  await prisma.user.update({ where: { email }, data: { passwordHash: await hash(process.env.RESET_PASSWORD), isActive: true } })
  console.log("Password updated for " + email + ". Log in at https://a7grouprealestate.com/admin")
})().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
