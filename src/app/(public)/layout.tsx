import type { Metadata } from "next"

import { LayoutFooter } from "@/shared/layout/layout-footer"
import { LayoutHeader } from "@/shared/layout/layout-header"
import { ThemeProvider } from "@/shared/theme"
import { getSettings } from "@/features/cms/settings/service"
import { toHeaderNav } from "@/features/cms/settings/schemas"
import { Analytics } from "@/features/cms/settings/ui/analytics"

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSettings()
  return {
    title: {
      default: seo.defaultTitle,
      template: seo.titleTemplate.includes("%s") ? seo.titleTemplate : `%s | ${seo.defaultTitle}`,
    },
    description: seo.defaultDescription,
    icons: seo.faviconUrl ? { icon: seo.faviconUrl } : undefined,
    robots: seo.indexable ? undefined : { index: false, follow: false },
    openGraph: {
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      images: seo.ogImageUrl ? [seo.ogImageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.defaultTitle,
      description: seo.defaultDescription,
      images: seo.ogImageUrl ? [seo.ogImageUrl] : undefined,
    },
  }
}

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { header, menu, footer, seo } = await getSettings()

  return (
    <div className="flex min-h-svh flex-col bg-white font-inter text-a7-text-gray">
      <ThemeProvider>
        <LayoutHeader
          nav={toHeaderNav(menu)}
          ctaLabel={header.ctaLabel}
          ctaHref={header.ctaHref}
        />
        <div className="flex-1">{children}</div>
        <LayoutFooter
          columns={footer.columns}
          mainNav={footer.mainNav}
          social={footer.social}
          email={footer.email}
          office={footer.office}
          copyright={footer.copyright}
          showColumns={footer.showColumns}
          showSocial={footer.showSocial}
        />
      </ThemeProvider>
      <Analytics ga4Id={seo.ga4Id} metaPixelId={seo.metaPixelId} />
    </div>
  )
}
