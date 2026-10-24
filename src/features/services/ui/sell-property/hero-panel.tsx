"use client"

import { MarketingSideHeroPanel } from "@/shared/ui/marketing"
import {
  SELL_PROPERTY_HERO_PANEL_DEFAULTS,
  SELL_PROPERTY_STAT_ICONS,
  type SellPropertyHeroPanelContent,
} from "@/features/services/core/sell-property-content"

export type SellPropertyHeroPanelProps = {
  /** CMS content; defaults to the built-in copy. */
  content?: SellPropertyHeroPanelContent
}

export function SellPropertyHeroPanel({ content = SELL_PROPERTY_HERO_PANEL_DEFAULTS }: SellPropertyHeroPanelProps) {
  const stats = content.stats.map((stat) => ({
    value: stat.value,
    label: stat.label,
    icon: SELL_PROPERTY_STAT_ICONS[stat.icon] ?? SELL_PROPERTY_STAT_ICONS.home,
  }))

  return (
    <MarketingSideHeroPanel
      backgroundImageUrl={content.backgroundImageUrl}
      eyebrow={content.eyebrow}
      titleLines={content.titleLines}
      description={content.description}
      stats={stats}
    />
  )
}
