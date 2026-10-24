import { Banknote, CalendarDays, Home } from "lucide-react"

/**
 * Default copy of the /sell-property page (side hero panel + listing wizard).
 * Lives in `core/` (not `content/`) because the UI components fall back to it
 * when rendered without CMS content (e.g. via the shared QuickPagesLayout).
 */

/** Icons the hero stats can pick by key. */
export const SELL_PROPERTY_STAT_ICONS = {
  banknote: Banknote,
  calendar: CalendarDays,
  home: Home,
} as const

export type SellPropertyStatIconKey = keyof typeof SELL_PROPERTY_STAT_ICONS

export const SELL_PROPERTY_HERO_PANEL_DEFAULTS = {
  backgroundImageUrl:
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
  eyebrow: "Sell Your Property in Dubai",
  titleLines: ["Sell Faster,", "Save Thousands"] as string[],
  description: "Reach more buyers and sellers with A7 Properties unmatched innovation.",
  stats: [
    { value: "AED 6M", label: "Saved for our customers", icon: "banknote" as SellPropertyStatIconKey },
    { value: "9,271", label: "Days saved for our customers", icon: "calendar" as SellPropertyStatIconKey },
    { value: "AED 3B", label: "Total sales volume", icon: "home" as SellPropertyStatIconKey },
  ],
}

export type SellPropertyHeroPanelContent = typeof SELL_PROPERTY_HERO_PANEL_DEFAULTS

type Option = { value: string; label: string }

const opts = (pairs: [string, string][]): Option[] => pairs.map(([value, label]) => ({ value, label }))

export const SELL_PROPERTY_FORM_DEFAULTS = {
  logoAlt: "A Seven Properties",
  titleLines: ["List/Sell Your", "Property in Dubai"] as string[],
  steps: {
    details: { line1: "Personal", line2: "Information" },
    media: { line1: "Property", line2: "Specifications" },
    submit: { line1: "Verification &", line2: "Media" },
  },
  buttons: { next: "Next", submit: "Submit", back: "Back" },
  personal: {
    heading: "Tell us about yourself",
    fullName: { label: "Full Name", placeholder: "John Doe" },
    email: { label: "Email", placeholder: "john@website.com" },
    mobile: { label: "Mobile", placeholder: "+971 12345 546" },
  },
  property: {
    heading: "Tell us about your property",
    propertyForLabel: "Property For:",
    propertyFor: { sale: "Sale", rent: "Rent", management: "Management" },
    location: {
      label: "Location",
      placeholder: "Dubai",
      options: opts([
        ["dubai-marina", "Dubai Marina"],
        ["downtown", "Downtown Dubai"],
        ["business-bay", "Business Bay"],
      ]),
    },
    propertyType: {
      label: "Property Type",
      placeholder: "Select",
      options: opts([
        ["apartment", "Apartment"],
        ["townhouse", "Townhouse"],
        ["villa", "Villa"],
        ["penthouse", "Penthouse"],
      ]),
    },
    bed: {
      label: "Bed",
      placeholder: "Select",
      options: opts([
        ["studio", "Studio"],
        ["1", "1 Bed"],
        ["2", "2 Bed"],
        ["3", "3 Bed"],
        ["4+", "4+ Bed"],
      ]),
    },
    size: { label: "Size Sqft", placeholder: "Enter" },
    unit: { label: "Unit No.", placeholder: "Enter" },
    price: { label: "Price", placeholder: "Enter" },
  },
  media: {
    heading: "Upload Multiple Images & Video",
    uploadHighlight: "Click here",
    uploadText: "to upload or drop files here",
    previewLabel: "Preview",
  },
}

export type SellPropertyFormContent = typeof SELL_PROPERTY_FORM_DEFAULTS
