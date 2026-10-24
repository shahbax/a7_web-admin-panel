import type { SingleContentDefinition } from "@/features/cms/site-content/core/types"
import { selectFromKeys } from "@/features/cms/site-content/core/hints"
import {
  SELL_PROPERTY_FORM_DEFAULTS,
  SELL_PROPERTY_HERO_PANEL_DEFAULTS,
  SELL_PROPERTY_STAT_ICONS,
} from "@/features/services/core/sell-property-content"

export function getSellPropertyDefaults() {
  return {
    /** Empty = keep the site-wide default title/description (today's behaviour). */
    seo: { title: "", description: "" },
    heroPanel: SELL_PROPERTY_HERO_PANEL_DEFAULTS,
    form: SELL_PROPERTY_FORM_DEFAULTS,
  }
}

export type SellPropertyPageContent = ReturnType<typeof getSellPropertyDefaults>

const OPTION_VALUE_HINT = { label: "Value", help: "internal value, keep unique" }

export const sellPropertyCmsDefinition = {
  key: "page.sell-property",
  kind: "single",
  label: "Sell / list your property (form)",
  group: "Pages",
  previewPath: "/sell-property",
  defaults: getSellPropertyDefaults,
  hints: {
    seo: { label: "Search engine (SEO)" },
    "seo.title": { help: "leave empty to use the site default" },
    "seo.description": { help: "leave empty to use the site default", type: "textarea" },
    heroPanel: { label: "Side hero panel" },
    "heroPanel.backgroundImageUrl": { label: "Background image", type: "image" },
    "heroPanel.stats[].icon": selectFromKeys(SELL_PROPERTY_STAT_ICONS, "Icon"),
    form: { label: "Listing form" },
    "form.steps": { label: "Step tabs" },
    "form.personal": { label: "Step 1 — Personal information" },
    "form.property": { label: "Step 2 — Property specifications" },
    "form.media": { label: "Step 3 — Verification & media" },
    "form.property.location.options[].value": OPTION_VALUE_HINT,
    "form.property.propertyType.options[].value": OPTION_VALUE_HINT,
    "form.property.bed.options[].value": OPTION_VALUE_HINT,
  },
} satisfies SingleContentDefinition<SellPropertyPageContent>
