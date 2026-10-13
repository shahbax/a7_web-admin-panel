"use client"

import { usePathname } from "next/navigation"

import { FooterMain, type FooterMainProps } from "@/shared/layout/footer-main"

export type LayoutFooterProps = Omit<FooterMainProps, "className">

/** Renders the main site footer; omitted on focused flows (e.g. sell-property). */
export function LayoutFooter(props: LayoutFooterProps) {
  const pathname = usePathname() || ""

  if (pathname.startsWith("/sell-property")) {
    return null
  }

  return <FooterMain {...props} />
}
