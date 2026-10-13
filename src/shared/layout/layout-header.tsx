"use client"

import { usePathname } from "next/navigation"

import { HeaderMain } from "@/shared/layout/header-main"
import type { SiteHeaderNavItem } from "@/shared/content/navigation/site-header-nav"

export type LayoutHeaderProps = {
  nav?: SiteHeaderNavItem[]
  ctaLabel?: string
  ctaHref?: string
}

/** Renders the main site header; omitted on focused flows (e.g. sell-property). */
export function LayoutHeader({ nav, ctaLabel, ctaHref }: LayoutHeaderProps) {
  const pathname = usePathname() || ""

  if (pathname.startsWith("/sell-property")) {
    return null
  }

  return <HeaderMain nav={nav} ctaLabel={ctaLabel} ctaHref={ctaHref} />
}
