import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Demo content mirroring the site's original hard-coded content, so the admin
// shows real data out of the box. Idempotent: a collection that already has
// items is left untouched. Run with `npm run db:seed:content`.

const TESTIMONIALS = [
  { name: "Daniel Kardashian", role: "Los Angeles, CA", quote: "Monolith made the home-buying process so smooth. Their team was professional, attentive, and truly understood what we wanted.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
  { name: "Megan Fox", role: "Washington, NY", quote: "From start to finish, Monolith was there every step of the way, ensuring we found a home that suited our family's needs.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" },
  { name: "Jessica Mercedes", role: "CEO @ Scarscan", quote: "Thanks to Monolith, we found our dream home in no time. Their expertise and local knowledge are unmatched.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop" },
  { name: "Ronnie Volkman DVM", role: "Dubai Marina, UAE", quote: "Exceptional guidance on off-plan investments. Transparent advice, fast responses, and a team that genuinely cares.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop" },
  { name: "Laurie Lowe", role: "Jumeirah Golf Estates, Dubai", quote: "Our villa purchase closed ahead of schedule. The process felt premium from the first viewing to the final handover.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" },
]

const NEWS = [
  { title: "10 best practices to rent your property in Dubai", excerpt: "Learn how to protect your investment, stay compliant with Dubai rental regulations, and reduce vacancy risk with proven landlord strategies.", cover: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop", date: "05/05/2023", slug: "rent-dubai-practices" },
  { title: "Is the Al Furjan property market booming or slowing?", excerpt: "We break down transaction volumes, price trends, and buyer sentiment shaping one of Dubai's most watched suburban communities.", cover: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop", date: "05/05/2023", slug: "al-furjan-market" },
  { title: "Why professional snagging is essential for asset protection", excerpt: "Before handover, a structured snagging report can save owners costly rework and preserve long-term resale value.", cover: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop", date: "05/05/2023", slug: "professional-snagging" },
]

const FAQS = [
  { question: "Can I customize the template without coding experience?", answer: "Yes — content blocks map to your CMS or copy deck; components are composed in React.", group: "home" },
  { question: "Is this template optimized for mobile devices?", answer: "Layouts use responsive grids and breakpoints aligned with your design system.", group: "home" },
  { question: "Can I connect this template with external tools like email marketing platforms?", answer: "Subscribe forms can POST to your ESP or CRM via standard form actions or API routes.", group: "home" },
  { question: "Does the template include CMS features for property listings?", answer: "Listings are wired to your property feed; swap mocks for a live API when ready.", group: "home" },
  { question: "Can I add eCommerce functionality to this template?", answer: "Payment flows can be added with your provider of choice on top of the existing UI.", group: "home" },
]

const PARTNERS = [
  { name: "Emaar", logo: "/assets/developers/emaar.png" },
  { name: "Binghatti", logo: "/assets/developers/binghatti.png" },
  { name: "Dubai Properties", logo: "/assets/developers/dubai-properties.png" },
  { name: "DAMAC", logo: "/assets/developers/damac.png" },
  { name: "Meraas", logo: "/assets/developers/meraas.png" },
  { name: "Azizi", logo: "/assets/developers/azizi.png" },
]

const HERO_SLIDES = [
  { image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2400&auto=format&fit=crop" },
  { image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2400&auto=format&fit=crop" },
  { image: "/assets/aerial-sunset-2.jpg" },
]

async function seedCollection(
  collection: string,
  rows: { title: string; slug?: string; data: Record<string, unknown> }[],
) {
  const existing = await prisma.collectionItem.count({ where: { collection } })
  if (existing > 0) {
    console.log(`[seed-content] ${collection}: ${existing} items already — skipping`)
    return
  }
  let order = 1
  for (const row of rows) {
    await prisma.collectionItem.create({
      data: {
        collection,
        slug: row.slug ?? null,
        title: row.title,
        status: "PUBLISHED",
        data: row.data as object,
        order: order++,
      },
    })
  }
  console.log(`[seed-content] ${collection}: seeded ${rows.length} items`)
}

async function main() {
  await seedCollection(
    "testimonials",
    TESTIMONIALS.map((t) => ({ title: t.name, data: { ...t, rating: "5" } })),
  )
  await seedCollection(
    "news",
    NEWS.map((n) => ({ title: n.title, slug: n.slug, data: { title: n.title, excerpt: n.excerpt, cover: n.cover, date: n.date, author: "" } })),
  )
  await seedCollection(
    "faqs",
    FAQS.map((f) => ({ title: f.question, data: f })),
  )
  await seedCollection(
    "partnerLogos",
    PARTNERS.map((p) => ({ title: p.name, data: { ...p, href: "" } })),
  )
  await seedCollection(
    "heroSlides",
    HERO_SLIDES.map((h, i) => ({ title: `Slide ${i + 1}`, data: { image: h.image, heading: "", subheading: "", ctaLabel: "", ctaHref: "" } })),
  )
}

main()
  .catch((e) => {
    console.error("[seed-content] failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
