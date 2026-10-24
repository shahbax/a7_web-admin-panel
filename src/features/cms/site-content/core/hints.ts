import type { ContentFieldHint } from "@/features/cms/site-content/core/types"
import { humanize } from "@/features/cms/site-content/core/humanize"
import { MARKETING_FEATURE_ICONS } from "@/shared/ui/marketing/marketing-feature-icons"
import { MARKETING_SERVICE_ICONS } from "@/shared/ui/marketing/marketing-service-icons"

/** A dropdown hint built from the keys of an icon map (or any object). */
export function selectFromKeys(map: object, label?: string): ContentFieldHint {
  return {
    type: "select",
    label,
    options: Object.keys(map).map((k) => ({ value: k, label: humanize(k) })),
  }
}

export const MARKETING_ICON_HINT = selectFromKeys(MARKETING_FEATURE_ICONS, "Icon")
export const SERVICE_ICON_HINT = selectFromKeys(MARKETING_SERVICE_ICONS, "Icon")
