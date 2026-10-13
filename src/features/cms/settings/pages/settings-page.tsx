import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { requireSettingsAccess } from "@/features/auth/services/guards"
import { cn } from "@/shared/lib/cn"
import {
  SETTING_KEYS,
  type SettingKey,
} from "@/features/cms/settings/schemas"
import {
  getSettingForEdit,
  listSettingVersions,
} from "@/features/cms/settings/service"
import {
  CheckboxField,
  SettingsForm,
  TextArea,
  TextField,
} from "@/features/cms/settings/ui/settings-form"
import { MenuEditor } from "@/features/cms/settings/ui/menu-editor"
import { FooterEditor } from "@/features/cms/settings/ui/footer-editor"
import { VersionHistory } from "@/features/cms/settings/ui/version-history"
import {
  saveHeaderSettingsAction,
  saveSeoSettingsAction,
  saveSiteSettingsAction,
} from "@/features/cms/settings/services/settings-actions"

export const settingsMetadata: Metadata = {
  title: "Settings · A7 Group admin",
  robots: { index: false, follow: false },
}

const TABS: { key: SettingKey; label: string }[] = [
  { key: "site", label: "Site" },
  { key: "seo", label: "SEO" },
  { key: "header", label: "Header" },
  { key: "menu", label: "Menu" },
  { key: "footer", label: "Footer" },
]

export async function SettingsRoute({
  params,
}: {
  params: Promise<{ section?: string[] }>
}) {
  await requireSettingsAccess()
  const { section } = await params
  const key = (section?.[0] ?? "site") as SettingKey
  if (!SETTING_KEYS.includes(key)) notFound()

  const versions = await listSettingVersions(key)

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Changes publish to the live site immediately. The last 20 versions are kept for restore.
        </p>
      </header>

      <nav className="mb-6 flex flex-wrap gap-1 border-b border-border">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/admin/settings/${tab.key}`}
            className={cn(
              "rounded-t-md px-4 py-2 text-sm font-medium transition-colors",
              key === tab.key
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className="rounded-xl border border-border bg-white p-5">
        {await renderEditor(key)}
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Version history</h2>
        <VersionHistory settingKey={key} versions={versions} />
      </section>
    </div>
  )
}

async function renderEditor(key: SettingKey) {
  if (key === "site") {
    const site = await getSettingForEdit("site")
    return (
      <SettingsForm action={saveSiteSettingsAction}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Company name" name="companyName" defaultValue={site.companyName} />
          <TextField label="Phone" name="phone" defaultValue={site.phone} />
          <TextField label="WhatsApp" name="whatsapp" defaultValue={site.whatsapp} />
          <TextField label="Email" name="email" defaultValue={site.email} />
        </div>
        <TextArea label="Office address" name="officeAddress" defaultValue={site.officeAddress} rows={2} />
        <TextField label="Map embed URL" name="mapEmbedUrl" defaultValue={site.mapEmbedUrl} placeholder="Google Maps embed URL" />
        <TextField label="Opening hours" name="openingHours" defaultValue={site.openingHours} />
      </SettingsForm>
    )
  }
  if (key === "seo") {
    const seo = await getSettingForEdit("seo")
    return (
      <SettingsForm action={saveSeoSettingsAction}>
        <TextField label="Title template" name="titleTemplate" defaultValue={seo.titleTemplate} help="Use %s for the page title, e.g. “%s | A7 Group”." />
        <TextField label="Default title" name="defaultTitle" defaultValue={seo.defaultTitle} />
        <TextArea label="Default description" name="defaultDescription" defaultValue={seo.defaultDescription} rows={2} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Default OG image URL" name="ogImageUrl" defaultValue={seo.ogImageUrl} />
          <TextField label="Favicon URL" name="faviconUrl" defaultValue={seo.faviconUrl} />
          <TextField label="Google Analytics (GA4) ID" name="ga4Id" defaultValue={seo.ga4Id} placeholder="G-XXXXXXX" />
          <TextField label="Meta Pixel ID" name="metaPixelId" defaultValue={seo.metaPixelId} />
        </div>
        <CheckboxField label="Allow search engines to index the site" name="indexable" defaultChecked={seo.indexable} help="Turn off for staging." />
      </SettingsForm>
    )
  }
  if (key === "header") {
    const header = await getSettingForEdit("header")
    return (
      <SettingsForm action={saveHeaderSettingsAction}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="CTA button label" name="ctaLabel" defaultValue={header.ctaLabel} />
          <TextField label="CTA button link" name="ctaHref" defaultValue={header.ctaHref} />
          <TextField label="Logo (light) URL" name="logoLightUrl" defaultValue={header.logoLightUrl} help="Optional override; leave blank for the default logo." />
          <TextField label="Logo (dark) URL" name="logoDarkUrl" defaultValue={header.logoDarkUrl} help="Optional override." />
        </div>
        <CheckboxField label="Show the search bar where applicable" name="showSearch" defaultChecked={header.showSearch} />
      </SettingsForm>
    )
  }
  if (key === "menu") {
    const menu = await getSettingForEdit("menu")
    return <MenuEditor menu={menu} />
  }
  const footer = await getSettingForEdit("footer")
  return <FooterEditor footer={footer} />
}
