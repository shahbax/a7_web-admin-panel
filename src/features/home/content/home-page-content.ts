import { HOME_BRAND_STORY_IMAGE } from "@/shared/lib/constants/home.constants"

/**
 * Texts of the home page sections. These are the code defaults: the home UI
 * components fall back to them, and the CMS ("page.home") deep-merges admin
 * edits over them.
 */

export const HOME_HERO_TEXTS = {
  imageAlt: "Dubai skyline — luxury living in Binghatti City",
  titleLine1: "Luxury Living In",
  titleLine2: "Binghatti City",
  titleLine2Options: [
    "Binghatti City",
    "Downtown Dubai",
    "Palm Jumeirah",
    "Dubai Marina",
    "Business Bay",
  ],
  subtitle:
    "We're A Real Estate Agency Dedicated To Helping You Find Your Dream Home. Ready To Talk About Your Ideal Residence?",
  startingFromValue: "AED 2.5M",
  startingFromLabel: "Starting From",
  paymentPlanValue: "30% - 70%",
  paymentPlanLabel: "Payment Plan",
  discoverMoreLabel: "Discover More",
  searchPlaceholder: "Search for properties",
  searchTypeLabel: "All types",
}

export const HOME_OFF_PLAN_TEXTS = {
  title: "Off Plan Latest Launches",
  browseAllLabel: "Browse all",
  browseAllHref: "/properties",
}

export const HOME_TRENDING_PROJECTS_TEXTS = {
  title: "Most Trending Projects in Dubai",
  viewAllLabel: "View All",
  viewAllHref: "/properties",
}

export const HOME_DEVELOPER_PARTNERS_TEXTS = {
  title: "Trusted Partner of the Most Prominent Developers",
}

export const HOME_FURNISHED_TEXTS = {
  title: "Furnished Luxury Properties",
}

export const HOME_TRENDING_VILLAS_TEXTS = {
  kicker: "Most Trending",
  title: "Dubai's Most Trending Luxury Villas",
  ctaLabel: "All Trending Properties",
  ctaHref: "/properties",
}

export const HOME_EXPERTS_TEXTS = {
  kicker: "Seamless and friendly service",
  title: "Real estate experts",
}

export const HOME_BRAND_STORY_TEXTS = {
  title: "Real Estating Since 2004",
  imageUrl: HOME_BRAND_STORY_IMAGE,
  imageAlt: "Luxury waterfront villas and skyline at golden hour",
  /** Optional video link for the play button (blank = button without link). */
  videoHref: "",
}

export const HOME_NEWS_TEXTS = {
  title: "Real Estate News",
  viewAllLabel: "View All Posts",
  viewAllHref: "/news",
}

export const HOME_TESTIMONIALS_TEXTS = {
  title: "Happy new home owners",
}

export const HOME_FAQ_TEXTS = {
  title: "Frequently asked questions",
}

