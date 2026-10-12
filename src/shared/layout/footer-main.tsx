import Image from "next/image"
import Link from "next/link"

import {
  HOME_FOOTER_EMAIL,
  HOME_FOOTER_MAIN_NAV,
  HOME_FOOTER_OFFICE,
  HOME_FOOTER_PROPERTY_COLUMNS,
  HOME_FOOTER_SOCIAL,
  type FooterLinkColumn,
} from "@/features/home/content/home-footer"
import { cn } from "@/shared/lib/cn"

import { FooterLinkColumns } from "./footer-link-columns"

type FooterLink = { label: string; href: string }

export type FooterMainProps = {
  className?: string
  columns?: readonly FooterLinkColumn[]
  mainNav?: readonly FooterLink[]
  social?: readonly FooterLink[]
  email?: string
  office?: string
  copyright?: string
  showColumns?: boolean
  showSocial?: boolean
}

export function FooterMain({
  className,
  columns = HOME_FOOTER_PROPERTY_COLUMNS,
  mainNav = HOME_FOOTER_MAIN_NAV,
  social = HOME_FOOTER_SOCIAL,
  email = HOME_FOOTER_EMAIL,
  office = HOME_FOOTER_OFFICE,
  copyright = "© 2026 A7Properties™ All rights reserved.",
  showColumns = true,
  showSocial = true,
}: FooterMainProps) {
  return (
    <footer className={cn("bg-black text-white", className)}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        {showColumns ? <FooterLinkColumns columns={columns} /> : null}

        <div className="sm:mt-14 grid  gap-4 border-t border-white/10 pt-12 lg:grid-cols-[1.2fr_1fr] lg:gap-6 xl:gap-10">
       <div>
          <nav className="flex items-start flex-col flex-wrap gap-2">
            {mainNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="lg:text-lg text-sm inline-flex  uppercase tracking-[0.12em] text-white font-bold transition-colors hover:text-primary "
              >
                {item.label}
              </Link>
            ))}
          </nav>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/60">Follow us</p>
              <ul className="mt-3 space-y-2">
                {(showSocial ? social : []).map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="lg:text-base text-sm  text-white hover:text-primary ">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/60">Email</p>
              <p className="mt-3">
                <a
                  href={`mailto:${email}`}
                  className="lg:text-base text-sm  text-white transition-colors hover:text-primary"
                >
                  {email}
                </a>
              </p>
            </div>
             <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/60">Office</p>
              <p className="mt-3 lg:text-base text-sm  leading-relaxed text-white">{office}</p>
            </div>
             <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/60">Others</p>
              <a
                  href={`mailto:${email}`}
                  className="lg:text-base text-sm  text-white transition-colors hover:text-primary"
                >
                 Licenses
                </a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-10">
          <div className="w-full">
            <Image
              src="/assets/brand/logo.svg"
              alt="A Seven Properties"
              width={1200}
              height={120}
              unoptimized
              className="h-auto w-full brightness-0 invert"
              sizes="100vw"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 pt-6 text-xs text-white sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright}</p>
          <p>Design by A7 for Real Estate</p>
        </div>
      </div>
    </footer>
  )
}
