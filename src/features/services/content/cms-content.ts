import type {
  ContentFieldHint,
  ContentSection,
  SingleContentDefinition,
} from "@/features/cms/site-content/core/types"
import { MARKETING_ICON_HINT, SERVICE_ICON_HINT } from "@/features/cms/site-content/core/hints"
import { SERVICE_MARKETING_SECTIONS } from "@/shared/ui/marketing/service-marketing-page-layout"
import { homeDeveloperCtaContent } from "@/features/developer/content/developer-cta-content"
import * as listYourProperty from "@/features/property/content/list-your-property-page-content"

import * as plots from "./plots-page-content"
import * as mortgages from "./mortgages-page-content"
import * as propertyManagement from "./property-management-page-content"
import * as propertySnagging from "./property-snagging-page-content"
import * as conveyancing from "./conveyancing-page-content"
import * as shortTermRentals from "./short-term-rentals-page-content"
import * as services from "./services-page-content"
import { sellPropertyCmsDefinition } from "./cms-sell-property"

const SITE_SUFFIX = " | A Seven Properties"

const seo = (title: string, description: string) => ({ title: `${title}${SITE_SUFFIX}`, description })

/* ------------------------------------------------------------------ */
/* Defaults (code values; admin edits are deep-merged over them)       */
/* ------------------------------------------------------------------ */

export function getServicesDefaults() {
  return {
    seo: seo(services.SERVICES_PAGE_TITLE, services.SERVICES_PAGE_HERO_SUBTITLE),
    hero: {
      title: services.SERVICES_PAGE_TITLE,
      subtitle: services.SERVICES_PAGE_HERO_SUBTITLE,
      imageUrl: services.SERVICES_HERO_IMAGE,
      cta: { label: "Enquiry Now", href: "#services-contact" },
    },
    intro: {
      breadcrumbs: services.SERVICES_PAGE_BREADCRUMBS,
      title: services.SERVICES_INTRO_TITLE,
      paragraphs: services.SERVICES_INTRO_PARAGRAPHS,
      imagePrimary: services.SERVICES_INTRO_IMAGE_PRIMARY,
      imageSecondary: services.SERVICES_INTRO_IMAGE_SECONDARY,
    },
    grid: {
      /** Screen-reader heading of the services grid. */
      heading: "Our services",
      offerings: services.SERVICE_OFFERINGS,
    },
    overview: services.SERVICES_SEO_SECTIONS,
    testimonials: services.servicesTestimonialsSectionProps,
    faq: services.servicesFaqSectionProps,
    contact: services.servicesContactSectionProps,
    newsletter: homeDeveloperCtaContent,
  }
}

export function getConveyancingDefaults() {
  return {
    seo: seo(conveyancing.CONVEYANCING_PAGE_TITLE, conveyancing.CONVEYANCING_HERO_DESCRIPTION),
    hero: conveyancing.conveyancingHeroProps,
    about: conveyancing.conveyancingAboutSectionProps,
    prism: {
      title: conveyancing.CONVEYANCING_PRISM_TITLE,
      subtitle: conveyancing.CONVEYANCING_PRISM_SUBTITLE,
      benefits: conveyancing.CONVEYANCING_PRISM_BENEFITS,
    },
    solutions: conveyancing.conveyancingSolutionsSectionProps,
    testimonials: conveyancing.conveyancingTestimonialsSectionProps,
    faq: conveyancing.conveyancingFaqSectionProps,
    contact: conveyancing.conveyancingContactSectionProps,
    newsletter: homeDeveloperCtaContent,
  }
}

export function getMortgagesDefaults() {
  return {
    seo: seo(mortgages.MORTGAGES_PAGE_TITLE, mortgages.MORTGAGES_HERO_DESCRIPTION),
    hero: mortgages.mortgagesHeroProps,
    ourServices: mortgages.mortgagesOurServicesSectionProps,
    whyWork: {
      title: mortgages.MORTGAGES_WHY_WORK_TITLE,
      subtitle: mortgages.MORTGAGES_WHY_WORK_SUBTITLE,
      benefits: mortgages.MORTGAGES_WHY_WORK_BENEFITS,
    },
    whyA7: mortgages.mortgagesWhyA7SectionProps,
    testimonials: mortgages.mortgagesTestimonialsSectionProps,
    faq: mortgages.mortgagesFaqSectionProps,
    contact: mortgages.mortgagesContactSectionProps,
    newsletter: homeDeveloperCtaContent,
  }
}

export function getPlotsDefaults() {
  return {
    seo: seo(plots.PLOTS_PAGE_TITLE, plots.PLOTS_HERO_DESCRIPTION),
    breadcrumbs: plots.PLOTS_BREADCRUMBS,
    hero: plots.plotsHeroProps,
    whyChoose: plots.plotsWhyChooseSectionProps,
    audience: plots.plotsAudienceSectionProps,
    listings: plots.plotsListingsSectionProps,
    howItWorks: plots.plotsHowItWorksSectionProps,
    marketInsights: plots.plotsMarketInsightsSectionProps,
    legacy: plots.plotsLegacySectionProps,
    testimonials: plots.plotsTestimonialsSectionProps,
    faq: plots.plotsFaqSectionProps,
    contact: plots.plotsContactSectionProps,
    newsletter: homeDeveloperCtaContent,
  }
}

export function getPropertyManagementDefaults() {
  return {
    seo: seo(
      propertyManagement.PROPERTY_MANAGEMENT_PAGE_TITLE,
      "Professional property management in Dubai — tenant placement, rent collection, maintenance, and compliance.",
    ),
    hero: propertyManagement.propertyManagementHeroProps,
    intro: {
      breadcrumbs: propertyManagement.PROPERTY_MANAGEMENT_BREADCRUMBS,
      title: propertyManagement.PROPERTY_MANAGEMENT_INTRO_TITLE,
      paragraphs: propertyManagement.PROPERTY_MANAGEMENT_INTRO_PARAGRAPHS,
      imageUrl: propertyManagement.PROPERTY_MANAGEMENT_INTRO_IMAGE,
    },
    features: {
      /** Screen-reader heading of the features grid. */
      heading: "Property management services",
      description: propertyManagement.PROPERTY_MANAGEMENT_FEATURE_DESCRIPTION,
      items: propertyManagement.PROPERTY_MANAGEMENT_FEATURES,
    },
    why: propertyManagement.propertyManagementWhySectionProps,
    testimonials: propertyManagement.propertyManagementTestimonialsSectionProps,
    faq: propertyManagement.propertyManagementFaqSectionProps,
    contact: propertyManagement.propertyManagementContactSectionProps,
    newsletter: homeDeveloperCtaContent,
  }
}

export function getPropertySnaggingDefaults() {
  return {
    seo: seo(propertySnagging.PROPERTY_SNAGGING_PAGE_TITLE, propertySnagging.PROPERTY_SNAGGING_HERO_DESCRIPTION),
    hero: propertySnagging.propertySnaggingHeroProps,
    intro: propertySnagging.propertySnaggingIntroSectionProps,
    glassServices: propertySnagging.propertySnaggingGlassServicesSectionProps,
    stepCards: propertySnagging.propertySnaggingStepCardsSectionProps,
    testimonials: propertySnagging.propertySnaggingTestimonialsSectionProps,
    faq: propertySnagging.propertySnaggingFaqSectionProps,
    contact: propertySnagging.propertySnaggingContactSectionProps,
    newsletter: homeDeveloperCtaContent,
  }
}

export function getShortTermRentalsDefaults() {
  return {
    seo: seo(shortTermRentals.SHORT_TERM_RENTALS_PAGE_TITLE, shortTermRentals.SHORT_TERM_RENTALS_HERO_DESCRIPTION),
    hero: shortTermRentals.shortTermRentalsHeroProps,
    guest: shortTermRentals.shortTermRentalsGuestSectionProps,
    why: {
      title: shortTermRentals.SHORT_TERM_RENTALS_WHY_TITLE,
      benefits: shortTermRentals.SHORT_TERM_RENTALS_WHY_BENEFITS,
    },
    transform: shortTermRentals.shortTermRentalsTransformSectionProps,
    journeyBanner: shortTermRentals.SHORT_TERM_RENTALS_JOURNEY_BANNER,
    services: shortTermRentals.shortTermRentalsServicesSectionProps,
    testimonials: shortTermRentals.shortTermRentalsTestimonialsSectionProps,
    faq: shortTermRentals.shortTermRentalsFaqSectionProps,
    contact: shortTermRentals.shortTermRentalsContactSectionProps,
    newsletter: homeDeveloperCtaContent,
  }
}

export function getListYourPropertyDefaults() {
  return {
    seo: seo(listYourProperty.LIST_YOUR_PROPERTY_PAGE_TITLE, listYourProperty.LIST_YOUR_PROPERTY_HERO_DESCRIPTION),
    hero: listYourProperty.listYourPropertyHeroProps,
    why: listYourProperty.listYourPropertyWhySectionProps,
    howItWorks: {
      title: listYourProperty.LIST_YOUR_PROPERTY_HOW_IT_WORKS_TITLE,
      subtitle: listYourProperty.LIST_YOUR_PROPERTY_HOW_IT_WORKS_SUBTITLE,
      steps: listYourProperty.LIST_YOUR_PROPERTY_HOW_IT_WORKS_STEPS,
    },
    testimonials: listYourProperty.listYourPropertyTestimonialsSectionProps,
    faq: listYourProperty.listYourPropertyFaqSectionProps,
    contact: listYourProperty.listYourPropertyContactSectionProps,
    newsletter: homeDeveloperCtaContent,
  }
}

export type ServicesPageContent = ReturnType<typeof getServicesDefaults>
export type ConveyancingPageContent = ReturnType<typeof getConveyancingDefaults>
export type MortgagesPageContent = ReturnType<typeof getMortgagesDefaults>
export type PlotsPageContent = ReturnType<typeof getPlotsDefaults>
export type PropertyManagementPageContent = ReturnType<typeof getPropertyManagementDefaults>
export type PropertySnaggingPageContent = ReturnType<typeof getPropertySnaggingDefaults>
export type ShortTermRentalsPageContent = ReturnType<typeof getShortTermRentalsDefaults>
export type ListYourPropertyPageContent = ReturnType<typeof getListYourPropertyDefaults>

/* ------------------------------------------------------------------ */
/* Sections + editor hints                                             */
/* ------------------------------------------------------------------ */

/**
 * The layout's sections this page renders (default order), with page-specific
 * labels for the generic intro / grid / afterGrid slots.
 */
function sections(labels: Partial<Record<string, string | false>>): ContentSection[] {
  return SERVICE_MARKETING_SECTIONS.filter((s) => labels[s.key] !== false && (s.key !== "overview" || labels.overview)).map(
    (s) => {
      const label = labels[s.key]
      return typeof label === "string" ? { ...s, label } : s
    },
  )
}

const HIDDEN: ContentFieldHint = { type: "hidden" }

/** Layout/technical values that must not be edited (they would change visuals or anchors). */
const TECHNICAL_HINTS: Record<string, ContentFieldHint> = {
  imageClassName: HIDDEN,
  align: HIDDEN,
  surface: HIDDEN,
  iconTone: HIDDEN,
  columns: HIDDEN,
  parallax: HIDDEN,
  showStepLabel: HIDDEN,
  showStepIcons: HIDDEN,
  formIdPrefix: HIDDEN,
  idPrefix: HIDDEN,
  imagePosition: {
    type: "select",
    label: "Image position",
    options: [
      { value: "left", label: "Left" },
      { value: "right", label: "Right" },
    ],
  },
}

const BASE_HINTS: Record<string, ContentFieldHint> = {
  ...TECHNICAL_HINTS,
  icon: MARKETING_ICON_HINT,
  seo: { label: "Search engine (SEO)" },
  newsletter: { label: "Developer prices & newsletter" },
}

/* ------------------------------------------------------------------ */
/* Definitions                                                         */
/* ------------------------------------------------------------------ */

export const servicesContentDefinitions = [
  {
    key: "page.services",
    kind: "single",
    label: "Services (overview)",
    group: "Services",
    previewPath: "/services",
    defaults: getServicesDefaults,
    sections: sections({
      intro: "Intro (breadcrumbs, text & images)",
      grid: "Services grid",
      afterGrid: false,
      overview: "SEO text blocks",
    }),
    hints: {
      ...BASE_HINTS,
      "grid.heading": { label: "Grid heading (screen readers only)" },
      overview: { label: "SEO text blocks" },
    },
  } satisfies SingleContentDefinition<ServicesPageContent>,
  {
    key: "page.services.conveyancing",
    kind: "single",
    label: "Conveyancing",
    group: "Services",
    previewPath: "/services/conveyancing",
    defaults: getConveyancingDefaults,
    sections: sections({ intro: "About conveyancing", grid: "PRISM advantage", afterGrid: "Our solutions" }),
    hints: { ...BASE_HINTS, prism: { label: "PRISM advantage" } },
  } satisfies SingleContentDefinition<ConveyancingPageContent>,
  {
    key: "page.services.mortgages",
    kind: "single",
    label: "Mortgages",
    group: "Services",
    previewPath: "/services/mortgages",
    defaults: getMortgagesDefaults,
    sections: sections({ intro: "Our services", grid: "Why work with us", afterGrid: "Why A7" }),
    hints: {
      ...BASE_HINTS,
      "ourServices.services[].icon": SERVICE_ICON_HINT,
      whyA7: { label: "Why A7" },
    },
  } satisfies SingleContentDefinition<MortgagesPageContent>,
  {
    key: "page.services.plots",
    kind: "single",
    label: "Plots",
    group: "Services",
    previewPath: "/services/plots",
    defaults: getPlotsDefaults,
    sections: sections({
      intro: "Why choose A7 (with breadcrumbs)",
      grid: "Who buys plots",
      afterGrid: "Listings, how it works, market insights & legacy",
    }),
    hints: BASE_HINTS,
  } satisfies SingleContentDefinition<PlotsPageContent>,
  {
    key: "page.services.property-management",
    kind: "single",
    label: "Property management",
    group: "Services",
    previewPath: "/services/property-management",
    defaults: getPropertyManagementDefaults,
    sections: sections({ intro: "Intro (breadcrumbs, text & image)", grid: "Features grid", afterGrid: "Why choose us" }),
    hints: {
      ...BASE_HINTS,
      "features.heading": { label: "Grid heading (screen readers only)" },
      "features.description": { label: "Card description (shown on every card)" },
    },
  } satisfies SingleContentDefinition<PropertyManagementPageContent>,
  {
    key: "page.services.property-snagging",
    kind: "single",
    label: "Property snagging",
    group: "Services",
    previewPath: "/services/property-snagging",
    defaults: getPropertySnaggingDefaults,
    sections: sections({ intro: "Intro", grid: "Snagging services", afterGrid: "Process steps" }),
    hints: BASE_HINTS,
  } satisfies SingleContentDefinition<PropertySnaggingPageContent>,
  {
    key: "page.services.short-term-rentals",
    kind: "single",
    label: "Short term rentals",
    group: "Services",
    previewPath: "/services/short-term-rentals",
    defaults: getShortTermRentalsDefaults,
    sections: sections({
      intro: "Guest experience",
      grid: "Why choose us",
      afterGrid: "Transform, journey banner & services",
    }),
    hints: BASE_HINTS,
  } satisfies SingleContentDefinition<ShortTermRentalsPageContent>,
  {
    key: "page.services.list-your-property",
    kind: "single",
    label: "List your property",
    group: "Services",
    previewPath: "/services/list-your-property",
    defaults: getListYourPropertyDefaults,
    sections: sections({ intro: false, grid: "Why list with us & how it works", afterGrid: false }),
    hints: BASE_HINTS,
  } satisfies SingleContentDefinition<ListYourPropertyPageContent>,
  sellPropertyCmsDefinition,
]
