"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { SiteHeader } from "@/shared/layout/site-header"
import { useProjectTheme } from "@/shared/hooks/use-project-theme"
import {
  defaultSiteHeaderCta,
  defaultSiteHeaderNav,
  type SiteHeaderNavItem,
} from "@/shared/content/navigation/site-header-nav"
import { cn } from "@/shared/lib/cn"

export type HeaderMainProps = {
  nav?: SiteHeaderNavItem[]
  ctaLabel?: string
  ctaHref?: string
}

/** Marketing shell header — transparent and fixed on `/` and project pages, turns solid on scroll. */
export function HeaderMain({
  nav = defaultSiteHeaderNav,
  ctaLabel = defaultSiteHeaderCta.ctaLabel,
  ctaHref = defaultSiteHeaderCta.ctaHref,
}: HeaderMainProps = {}) {
  const pathname = usePathname()
  const { theme, isProjectTheme } = useProjectTheme()
  const isPropertyDetailPage = /^\/properties\/[^/]+$/.test(pathname)
  const isTransparentPage =
    pathname === "/" ||
    pathname.startsWith("/projects/") ||
    pathname.startsWith("/off-plan/") ||
    isPropertyDetailPage
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!isTransparentPage) return
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [isTransparentPage])

  const isTransparent = isTransparentPage && !scrolled

  return (
    <SiteHeader
      variant={isTransparent ? "transparent" : "solid"}
      nav={nav}
      ctaLabel={ctaLabel}
      ctaHref={ctaHref}
      logoSrc={isProjectTheme ? theme.logo.src : undefined}
      logoAlt={isProjectTheme ? theme.logo.alt : undefined}
      className={cn(isTransparentPage && "fixed inset-x-0 top-0 z-50")}
    />
  )
}
