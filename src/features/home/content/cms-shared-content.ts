import type { SingleContentDefinition } from "@/features/cms/site-content/core/types"
import {
  detailDeveloperCtaContent,
  homeDeveloperCtaContent,
} from "@/features/developer/content/developer-cta-content"

/** The "developer prices + newsletter" band, shared by many pages. */
export function getDeveloperCtaDefaults() {
  return {
    /** Variant used on the home page and marketing pages. */
    home: { ...homeDeveloperCtaContent },
    /** Variant used on property / project / off-plan detail pages. */
    detail: { ...detailDeveloperCtaContent },
  }
}

export type DeveloperCtaContent = ReturnType<typeof getDeveloperCtaDefaults>

export const sharedContentDefinitions = [
  {
    key: "shared.developerCta",
    kind: "single",
    label: "Developer prices & newsletter band",
    group: "Shared",
    previewPath: "/",
    defaults: getDeveloperCtaDefaults,
    hints: {
      home: { label: "Home & marketing pages" },
      detail: { label: "Property & project detail pages" },
      imageUrl: { label: "Background image", type: "image" },
      heroEyebrowPercent: { label: "Eyebrow value" },
      heroEyebrowLabel: { label: "Eyebrow label" },
      heroTitle: { label: "Title" },
      newsletterTitle: { label: "Newsletter text", type: "textarea" },
    },
  } satisfies SingleContentDefinition<DeveloperCtaContent>,
]
