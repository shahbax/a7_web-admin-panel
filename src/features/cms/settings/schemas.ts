import { z } from "zod"

import {
  defaultSiteHeaderCta,
  defaultSiteHeaderNav,
  type SiteHeaderNavItem,
} from "@/shared/content/navigation/site-header-nav"
import {
  HOME_FOOTER_EMAIL,
  HOME_FOOTER_MAIN_NAV,
  HOME_FOOTER_OFFICE,
  HOME_FOOTER_PROPERTY_COLUMNS,
  HOME_FOOTER_SOCIAL,
} from "@/features/home/content/home-footer"

// ---------------------------------------------------------------------------
// Site settings (company info + contact)
// ---------------------------------------------------------------------------
export const siteSettingsSchema = z.object({
  companyName: z.string().trim().min(1).max(120),
  phone: z.string().trim().max(40),
  whatsapp: z.string().trim().max(40),
  email: z.string().trim().max(160),
  officeAddress: z.string().trim().max(400),
  mapEmbedUrl: z.string().trim().max(1000),
  openingHours: z.string().trim().max(400),
})
export type SiteSettings = z.infer<typeof siteSettingsSchema>

export const siteSettingsDefault: SiteSettings = {
  companyName: "A7 Group Real Estate",
  phone: "+971 50 392 8461",
  whatsapp: "+971 50 392 8461",
  email: "info@a7group.com",
  officeAddress: HOME_FOOTER_OFFICE,
  mapEmbedUrl: "",
  openingHours: "Mon–Sat, 9:00 AM – 7:00 PM",
}

// ---------------------------------------------------------------------------
// SEO defaults
// ---------------------------------------------------------------------------
export const seoSettingsSchema = z.object({
  titleTemplate: z.string().trim().max(120),
  defaultTitle: z.string().trim().max(160),
  defaultDescription: z.string().trim().max(320),
  ogImageUrl: z.string().trim().max(1000),
  faviconUrl: z.string().trim().max(1000),
  ga4Id: z.string().trim().max(40),
  metaPixelId: z.string().trim().max(40),
  indexable: z.boolean(),
})
export type SeoSettings = z.infer<typeof seoSettingsSchema>

export const seoSettingsDefault: SeoSettings = {
  titleTemplate: "%s | A7 Group Real Estate",
  defaultTitle: "A7 Group Real Estate — Dubai Property Experts",
  defaultDescription:
    "Buy, sell and rent property in Dubai with A7 Group Real Estate. Off-plan projects, luxury villas, apartments and expert agents.",
  ogImageUrl: "",
  faviconUrl: "/favicon.ico",
  ga4Id: "",
  metaPixelId: "",
  indexable: true,
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------
export const headerSettingsSchema = z.object({
  ctaLabel: z.string().trim().max(60),
  ctaHref: z.string().trim().max(400),
  showSearch: z.boolean(),
  logoLightUrl: z.string().trim().max(1000),
  logoDarkUrl: z.string().trim().max(1000),
})
export type HeaderSettings = z.infer<typeof headerSettingsSchema>

export const headerSettingsDefault: HeaderSettings = {
  ctaLabel: defaultSiteHeaderCta.ctaLabel,
  ctaHref: defaultSiteHeaderCta.ctaHref,
  showSearch: true,
  logoLightUrl: "",
  logoDarkUrl: "",
}

// ---------------------------------------------------------------------------
// Menu (navigation tree). Mirrors SiteHeaderNavItem, plus visible/newTab so
// items can be toggled without deleting. Item "type" is preserved to keep the
// header's mega-menu visuals identical.
// ---------------------------------------------------------------------------
const megaTileSchema = z.object({
  title: z.string().trim().max(120),
  subtitle: z.string().trim().max(160).default(""),
  href: z.string().trim().max(400),
})
const menuChildSchema = z.object({
  label: z.string().trim().max(120),
  href: z.string().trim().max(400),
})
const navItemSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("link"),
    label: z.string().trim().max(120),
    href: z.string().trim().max(400),
    visible: z.boolean().default(true),
    newTab: z.boolean().default(false),
  }),
  z.object({
    type: z.literal("mega"),
    label: z.string().trim().max(120),
    href: z.string().trim().max(400),
    visible: z.boolean().default(true),
    newTab: z.boolean().default(false),
    tiles: z.array(megaTileSchema).max(24),
  }),
  z.object({
    type: z.literal("menu"),
    label: z.string().trim().max(120),
    href: z.string().trim().max(400),
    visible: z.boolean().default(true),
    newTab: z.boolean().default(false),
    items: z.array(menuChildSchema).max(24),
  }),
])
export const menuSettingsSchema = z.object({
  items: z.array(navItemSchema).max(24),
})
export type MenuSettings = z.infer<typeof menuSettingsSchema>
export type MenuNavItem = z.infer<typeof navItemSchema>

export const menuSettingsDefault: MenuSettings = {
  items: (defaultSiteHeaderNav as SiteHeaderNavItem[]).map((item) => ({
    ...item,
    visible: true,
    newTab: false,
  })) as MenuNavItem[],
}

/** Convert the stored menu into the SiteHeaderNavItem[] the header renders. */
export function toHeaderNav(menu: MenuSettings): SiteHeaderNavItem[] {
  return menu.items
    .filter((item) => item.visible !== false)
    .map((item) => {
      if (item.type === "mega") {
        return { type: "mega", label: item.label, href: item.href, tiles: item.tiles }
      }
      if (item.type === "menu") {
        return { type: "menu", label: item.label, href: item.href, items: item.items }
      }
      return { type: "link", label: item.label, href: item.href }
    })
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
const footerColumnSchema = z.object({
  title: z.string().trim().max(120),
  links: z
    .array(z.object({ label: z.string().trim().max(160), href: z.string().trim().max(400) }))
    .max(24),
})
const footerLinkSchema = z.object({
  label: z.string().trim().max(120),
  href: z.string().trim().max(400),
})
export const footerSettingsSchema = z.object({
  columns: z.array(footerColumnSchema).max(12),
  mainNav: z.array(footerLinkSchema).max(24),
  social: z.array(footerLinkSchema).max(24),
  email: z.string().trim().max(160),
  office: z.string().trim().max(400),
  newsletterText: z.string().trim().max(400),
  copyright: z.string().trim().max(240),
  showColumns: z.boolean(),
  showSocial: z.boolean(),
})
export type FooterSettings = z.infer<typeof footerSettingsSchema>

export const footerSettingsDefault: FooterSettings = {
  columns: HOME_FOOTER_PROPERTY_COLUMNS.map((c) => ({
    title: c.title,
    links: c.links.map((l) => ({ label: l.label, href: l.href })),
  })),
  mainNav: HOME_FOOTER_MAIN_NAV.map((l) => ({ label: l.label, href: l.href })),
  social: HOME_FOOTER_SOCIAL.map((l) => ({ label: l.label, href: l.href })),
  email: HOME_FOOTER_EMAIL,
  office: HOME_FOOTER_OFFICE,
  newsletterText: "",
  copyright: "© 2026 A7Properties™ All rights reserved.",
  showColumns: true,
  showSocial: true,
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------
export const SETTING_KEYS = ["site", "seo", "header", "menu", "footer"] as const
export type SettingKey = (typeof SETTING_KEYS)[number]

type SettingShape = {
  site: SiteSettings
  seo: SeoSettings
  header: HeaderSettings
  menu: MenuSettings
  footer: FooterSettings
}

export const settingSchemas = {
  site: siteSettingsSchema,
  seo: seoSettingsSchema,
  header: headerSettingsSchema,
  menu: menuSettingsSchema,
  footer: footerSettingsSchema,
} as const

export const settingDefaults: SettingShape = {
  site: siteSettingsDefault,
  seo: seoSettingsDefault,
  header: headerSettingsDefault,
  menu: menuSettingsDefault,
  footer: footerSettingsDefault,
}

export type SettingValue<K extends SettingKey> = SettingShape[K]

/** Public pages affected when a settings group changes (for revalidation). */
export const SETTING_REVALIDATE_TAG = "site-settings"
