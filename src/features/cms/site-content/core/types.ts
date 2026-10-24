import type { JsonValue } from "@/features/cms/site-content/core/merge"

export type ContentFieldType =
  | "text"
  | "textarea"
  | "html"
  | "image"
  | "link"
  | "number"
  | "boolean"
  | "select"
  | "hidden"

/**
 * Optional per-field override, addressed by path: object keys joined with "."
 * and "[]" for array items, e.g. "points[].icon" or "hero.imageUrl".
 * A hint keyed by a bare field name (e.g. "icon") applies at any depth.
 */
export type ContentFieldHint = {
  label?: string
  type?: ContentFieldType
  options?: { value: string; label: string }[]
  help?: string
}

export type ContentSection = {
  key: string
  label: string
}

export type ContentGroup =
  | "Home"
  | "Pages"
  | "Services"
  | "Directories"
  | "Projects"
  | "Shared"

type ContentDefinitionBase = {
  /** Stable DB key, e.g. "page.about". */
  key: string
  label: string
  group: ContentGroup
  description?: string
  /** Public URL to open for preview. */
  previewPath?: string
  hints?: Record<string, ContentFieldHint>
}

/** One editable content object for a page (hero, sections, FAQ, SEO…). */
export type SingleContentDefinition<T = unknown> = ContentDefinitionBase & {
  kind: "single"
  defaults: () => T
  /** Sections of the page that can be hidden or reordered. */
  sections?: ContentSection[]
}

/** A list of items with their own detail pages (areas, developers, events…). */
export type ListContentDefinition<T = unknown> = ContentDefinitionBase & {
  kind: "list"
  defaults: () => T[]
  /** Field used as the item's URL id/slug. */
  idField: string
  /** Field shown as the item's name in the admin list. */
  titleField: string
  /** Public URL of an item, for preview. */
  itemPath?: (id: string) => string
}

export type ContentDefinition<T = unknown> = SingleContentDefinition<T> | ListContentDefinition<T>

export type SectionLayout = {
  order: string[]
  hidden: string[]
}

/** Stored document shape (draft and published). */
export type StoredContent = {
  content?: JsonValue
  layout?: SectionLayout
}

/** Client-safe description of a definition (no functions). */
export type ContentDefinitionInfo = {
  key: string
  label: string
  group: ContentGroup
  description?: string
  previewPath?: string
  kind: "single" | "list"
  sections?: ContentSection[]
  idField?: string
  titleField?: string
  hints?: Record<string, ContentFieldHint>
}
