import Link from "next/link"
import {
  FileText,
  Image as ImageIcon,
  Inbox,
  Layers,
  PanelsTopLeft,
  Settings as SettingsIcon,
  type LucideIcon,
} from "lucide-react"

import { requireUser } from "@/features/auth/services/guards"
import { canManageSettings } from "@/features/auth/core/domain/entity"
import { listContentDefinitions } from "@/features/cms/site-content/registry"
import { prisma } from "@/shared/lib/db/prisma"

type Card = { href: string; title: string; detail: string; body: string; icon: LucideIcon; tint: string }

async function counts() {
  try {
    const [media, leadsNew, pages, items, recent] = await Promise.all([
      prisma.mediaAsset.count(),
      prisma.lead.count({ where: { handled: false } }),
      prisma.page.count(),
      prisma.collectionItem.count(),
      prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    ])
    return { media, leadsNew, pages, items, recent }
  } catch {
    return { media: 0, leadsNew: 0, pages: 0, items: 0, recent: [] }
  }
}

export async function AdminOverviewRoute() {
  const user = await requireUser()
  const c = await counts()
  const contentCount = listContentDefinitions().length

  const cards: Card[] = [
    { href: "/admin/content", title: "Website content", detail: `${contentCount} pages & directories`, body: "Edit text, images, buttons and sections on every page.", icon: PanelsTopLeft, tint: "bg-[#FFF4E0] text-[#8A5A00]" },
    { href: "/admin/leads", title: "Leads", detail: c.leadsNew === 1 ? "1 new enquiry" : `${c.leadsNew} new enquiries`, body: "Enquiries from every form on the website.", icon: Inbox, tint: "bg-[#E8F0FF] text-[#1D4ED8]" },
    { href: "/admin/collections", title: "Collections", detail: `${c.items} items`, body: "Testimonials, news, FAQs, partner logos and hero images.", icon: Layers, tint: "bg-[#F3E8FF] text-[#7E22CE]" },
    { href: "/admin/media", title: "Media library", detail: `${c.media} files`, body: "Upload and organise images, video and PDFs.", icon: ImageIcon, tint: "bg-[#E4F7E8] text-[#1B5E3B]" },
    { href: "/admin/pages", title: "Custom pages", detail: `${c.pages} pages`, body: "Build new pages from on-brand blocks.", icon: FileText, tint: "bg-[#FDE8E8] text-[#B91C1C]" },
  ]
  if (canManageSettings(user.role)) {
    cards.push({ href: "/admin/settings", title: "Settings", detail: "Header, menu, footer, SEO", body: "Site-wide navigation, footer and search settings.", icon: SettingsIcon, tint: "bg-neutral-100 text-neutral-700" })
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage the A7 Group website from here.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="group rounded-xl border border-border bg-white p-5 transition-colors hover:border-foreground/20 hover:bg-neutral-50">
            <div className="flex items-center gap-3">
              <span className={`flex size-10 items-center justify-center rounded-lg ${card.tint}`}>
                <card.icon className="size-5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-foreground">{card.title}</h2>
                <p className="text-xs text-muted-foreground">{card.detail}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{card.body}</p>
          </Link>
        ))}
      </div>

      {c.recent.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Recent activity</h2>
          <ul className="divide-y divide-border rounded-xl border border-border bg-white text-sm">
            {c.recent.map((r) => (
              <li key={r.id} className="flex gap-3 px-4 py-2.5">
                <span className="shrink-0 text-muted-foreground">{r.createdAt.toLocaleString("en-GB", { timeZone: "Asia/Dubai" })}</span>
                <span className="truncate">{r.summary || r.action}</span>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">{r.userEmail}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="mt-10 text-xs text-muted-foreground">
        Signed in as {user.email} · role {user.role.toLowerCase()}
      </p>
    </div>
  )
}
