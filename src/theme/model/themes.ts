import { generatePaletteFromColor } from "@/theme/lib/generate-palette-from-color"
import type { ProjectTheme, ThemeColors } from "@/theme/model/types"

const SITE_COLORS: ThemeColors = {
  primary: "#b68c40",
  primaryHover: "#a67d38",
  primaryForeground: "#ffffff",
  primarySoft: "#f8f1e1",
  secondary: "#042938",
  secondaryForeground: "#f4f4f5",
  background: "#f4f4f5",
  foreground: "#042938",
  muted: "#e8e9ea",
  mutedForeground: "#3d5661",
  card: "#ffffff",
  cardForeground: "#042938",
  border: "color-mix(in srgb, #042938 12%, #f4f4f5)",
  input: "color-mix(in srgb, #042938 14%, #f4f4f5)",
  accent: "#dde6e3",
  accentForeground: "#042938",
  ring: "#b68c40",
  destructive: "#b42318",
}

type ProjectPalette = Pick<
  ThemeColors,
  "primary" | "primaryHover" | "primarySoft" | "secondary" | "secondaryForeground"
> &
  Partial<ThemeColors>

function buildTheme(
  id: string,
  name: string,
  logoSrc: string,
  logoAlt: string,
  palette: ProjectPalette,
  options?: { preserveLogoColors?: boolean }
): ProjectTheme {
  return {
    id,
    name,
    logo: {
      src: logoSrc,
      alt: logoAlt,
      preserveColorsOnTransparentHeader: options?.preserveLogoColors ?? true,
    },
    colors: {
      ...SITE_COLORS,
      ...palette,
      primaryForeground: palette.primaryForeground ?? "#ffffff",
      ring: palette.ring ?? palette.primary,
      accent: palette.accent ?? palette.primarySoft,
      accentForeground: palette.accentForeground ?? palette.secondary,
      muted: palette.muted ?? palette.primarySoft,
      // Structural borders stay site-neutral; brand color applies to primary/actions only.
      border: SITE_COLORS.border,
      input: SITE_COLORS.input,
    },
    radii: {
      sm: "0.375rem",
      md: "0.625rem",
      lg: "1rem",
    },
  }
}

/** Pick one brand color — all tokens below are generated automatically. */
function projectThemeFromColor(
  id: string,
  name: string,
  logoSrc: string,
  logoAlt: string,
  brandColor: string,
  options?: { secondary?: string; preserveLogoColors?: boolean }
) {
  return buildTheme(id, name, logoSrc, logoAlt, generatePaletteFromColor(brandColor, options), {
    preserveLogoColors: options?.preserveLogoColors,
  })
}

/** Default A7 marketing theme (restored when leaving a project page). */
export const SITE_DEFAULT_THEME: ProjectTheme = buildTheme(
  "site-default",
  "A Seven Properties",
  "/assets/brand/logo.svg",
  "A Seven Properties",
  {
    primary: SITE_COLORS.primary,
    primaryHover: SITE_COLORS.primaryHover,
    primarySoft: SITE_COLORS.primarySoft,
    secondary: SITE_COLORS.secondary,
    secondaryForeground: SITE_COLORS.secondaryForeground,
    background: SITE_COLORS.background,
    foreground: SITE_COLORS.foreground,
    muted: SITE_COLORS.muted,
    mutedForeground: SITE_COLORS.mutedForeground,
    card: SITE_COLORS.card,
    cardForeground: SITE_COLORS.cardForeground,
    accent: SITE_COLORS.accent,
    accentForeground: SITE_COLORS.accentForeground,
    border: SITE_COLORS.border,
    input: SITE_COLORS.input,
    ring: SITE_COLORS.ring,
  },
  { preserveLogoColors: false }
)

/** Seed for a project theme: one brand colour (+ optional dark secondary) and a header logo. */
export type ProjectThemeSeed = {
  name: string
  logoSrc: string
  logoAlt: string
  brandColor: string
  secondary?: string
}

/**
 * Off-plan themes — change only `brandColor` (and optional `secondary`) per project.
 * These are the code defaults; the CMS project items carry the same values as
 * `themeColor` / `themeSecondaryColor` / `themeLogoUrl` and override them.
 */
export const PROJECT_THEME_SEEDS: Record<string, ProjectThemeSeed> = {
  "damac-district": {
    name: "Damac District",
    logoSrc: "/assets/developers/azizi.png",
    logoAlt: "Damac District",
    brandColor: "#C9A227",
  },
  "the-hillgate": {
    name: "The Hillgate",
    logoSrc: "/assets/developers/binghatti.png",
    logoAlt: "The Hillgate",
    brandColor: "#3B82C4",
  },
  "baystar-by-vida": {
    name: "Baystar by Vida",
    logoSrc: "/assets/developers/dubai-properties.png",
    logoAlt: "Baystar by Vida",
    brandColor: "#1A9B88",
  },
  "silva-at-dubai-creek": {
    name: "Silva at Dubai Creek",
    logoSrc: "/assets/developers/azizi.png",
    logoAlt: "Silva at Dubai Creek",
    brandColor: "#C45C3E",
  },
  "waldorf-astoria-residences": {
    name: "Waldorf Astoria Residences",
    logoSrc: "/assets/developers/dubai-properties.png",
    logoAlt: "Waldorf Astoria Residences",
    brandColor: "#1B3A6B",
  },
  "palm-jumeirah-villas": {
    name: "Palm Jumeirah Signature Villas",
    logoSrc: "/assets/developers/azizi.png",
    logoAlt: "Palm Jumeirah Signature Villas",
    brandColor: "#E07A5F",
    secondary: "#1A3A4A",
  },
  "bvlgari-beachfront": {
    name: "Bvlgari Beachfront",
    logoSrc: "/assets/developers/dubai-properties.png",
    logoAlt: "Bvlgari Beachfront",
    brandColor: "#1B2C5E",
    secondary: "#0D1A36",
  },
  "bugatti-residences-business-bay": {
    name: "Bugatti Residences",
    logoSrc: "/assets/developers/binghatti.png",
    logoAlt: "Bugatti Residences",
    brandColor: "#C0A050",
    secondary: "#1A1A1A",
  },
}

/** Builds a full project theme from a seed (one brand colour → all tokens). */
export function projectThemeFromSeed(id: string, seed: ProjectThemeSeed): ProjectTheme {
  return projectThemeFromColor(id, seed.name, seed.logoSrc, seed.logoAlt, seed.brandColor, {
    secondary: seed.secondary,
  })
}

export const PROJECT_THEMES: Record<string, ProjectTheme> = Object.fromEntries(
  Object.entries(PROJECT_THEME_SEEDS).map(([id, seed]) => [id, projectThemeFromSeed(id, seed)])
)

export function getProjectTheme(projectId: string): ProjectTheme | null {
  return PROJECT_THEMES[projectId] ?? null
}
