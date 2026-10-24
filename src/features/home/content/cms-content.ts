import type { SingleContentDefinition } from "@/features/cms/site-content/core/types"
import { HOME_REAL_ESTATE_EXPERTS } from "@/features/home/content/home-real-estate-experts"
import {
  HOME_BRAND_STORY_TEXTS,
  HOME_DEVELOPER_PARTNERS_TEXTS,
  HOME_EXPERTS_TEXTS,
  HOME_FAQ_TEXTS,
  HOME_FURNISHED_TEXTS,
  HOME_HERO_TEXTS,
  HOME_NEWS_TEXTS,
  HOME_OFF_PLAN_TEXTS,
  HOME_TESTIMONIALS_TEXTS,
  HOME_TRENDING_PROJECTS_TEXTS,
  HOME_TRENDING_VILLAS_TEXTS,
} from "@/features/home/content/home-page-content"

/**
 * Editable home page content. Hero slide images, partner logos, news posts,
 * testimonials and FAQ items come from their CMS collections; property
 * listings come from the property feed. Only texts live here.
 * The bottom developer/newsletter band is the shared "shared.developerCta".
 */
export function getHomeDefaults() {
  return {
    /** Blank = keep the site default title/description. */
    seo: { title: "", description: "" },
    hero: { ...HOME_HERO_TEXTS, titleLine2Options: [...HOME_HERO_TEXTS.titleLine2Options] },
    offPlanLaunches: { ...HOME_OFF_PLAN_TEXTS },
    trendingProjects: { ...HOME_TRENDING_PROJECTS_TEXTS },
    developerPartners: { ...HOME_DEVELOPER_PARTNERS_TEXTS },
    furnishedLuxury: { ...HOME_FURNISHED_TEXTS },
    trendingVillas: { ...HOME_TRENDING_VILLAS_TEXTS },
    experts: {
      ...HOME_EXPERTS_TEXTS,
      items: HOME_REAL_ESTATE_EXPERTS.map((expert) => ({ ...expert, whatsAppHref: expert.whatsAppHref ?? "" })),
    },
    brandStory: { ...HOME_BRAND_STORY_TEXTS },
    news: { ...HOME_NEWS_TEXTS },
    testimonials: { ...HOME_TESTIMONIALS_TEXTS },
    faq: { ...HOME_FAQ_TEXTS },
  }
}

export type HomeContent = ReturnType<typeof getHomeDefaults>

export const HOME_SECTIONS = [
  { key: "hero", label: "Hero" },
  { key: "offPlanLaunches", label: "Off plan latest launches" },
  { key: "trendingProjects", label: "Most trending projects" },
  { key: "developerPartners", label: "Developer partner logos" },
  { key: "furnishedLuxury", label: "Furnished luxury properties" },
  { key: "trendingVillas", label: "Trending luxury villas" },
  { key: "experts", label: "Real estate experts" },
  { key: "brandStory", label: "Real estating since banner" },
  { key: "news", label: "Real estate news" },
  { key: "testimonials", label: "Happy home owners (testimonials)" },
  { key: "faq", label: "FAQ" },
  { key: "developerCta", label: "Developer prices & newsletter band" },
]

export const homeContentDefinitions = [
  {
    key: "page.home",
    kind: "single",
    label: "Home page",
    group: "Home",
    description:
      "Texts of the home page. Hero images, partner logos, news, testimonials and FAQ items are edited in Collections; the bottom newsletter band is under Shared.",
    previewPath: "/",
    defaults: getHomeDefaults,
    sections: HOME_SECTIONS,
    hints: {
      seo: { label: "Search engine (SEO)", help: "Leave blank to keep the site default." },
      "hero.imageAlt": { label: "Background image description (alt text)" },
      "hero.titleLine2": { label: "Title line 2 (fallback)", help: "Used only when the rotating list is empty." },
      "hero.titleLine2Options": { label: "Title line 2 — rotating words" },
      "hero.subtitle": { type: "textarea" },
      "hero.searchPlaceholder": { label: "Search box placeholder" },
      "hero.searchTypeLabel": { label: "Search type dropdown label" },
      "experts.items": { label: "Experts" },
      "experts.items[].id": { label: "Agent profile id (URL)", type: "text" },
      "experts.items[].whatsAppHref": { label: "WhatsApp link", type: "link" },
      "brandStory.videoHref": { label: "Video link", type: "link", help: "Optional. Opens when the play button is clicked." },
    },
  } satisfies SingleContentDefinition<HomeContent>,
]
