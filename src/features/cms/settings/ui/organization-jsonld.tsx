import { getSiteUrl } from "@/shared/lib/site-url"
import type { FooterSettings, SiteSettings } from "@/features/cms/settings/schemas"

/** Organization JSON-LD for the whole site, built from site + footer settings. */
export function OrganizationJsonLd({
  site,
  footer,
}: {
  site: SiteSettings
  footer: FooterSettings
}) {
  const url = getSiteUrl()
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.companyName,
    url,
    email: site.email || undefined,
    telephone: site.phone || undefined,
    address: site.officeAddress
      ? { "@type": "PostalAddress", streetAddress: site.officeAddress, addressCountry: "AE" }
      : undefined,
    sameAs: footer.social.map((s) => s.href).filter((h) => h && h !== "#"),
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
