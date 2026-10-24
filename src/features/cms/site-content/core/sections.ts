import { Fragment, createElement, type ReactNode } from "react"

import type { ContentSection, SectionLayout } from "@/features/cms/site-content/core/types"

function isLayout(value: unknown): value is SectionLayout {
  if (!value || typeof value !== "object") return false
  const v = value as Record<string, unknown>
  return (
    Array.isArray(v.order) &&
    v.order.every((x) => typeof x === "string") &&
    Array.isArray(v.hidden) &&
    v.hidden.every((x) => typeof x === "string")
  )
}

/**
 * Resolves the stored layout against the page's declared sections: unknown
 * keys are dropped and sections added to the code later are appended in their
 * default position, so a layout saved today keeps working after code changes.
 */
export function resolveLayout(sections: ContentSection[], stored: unknown): SectionLayout {
  const keys = sections.map((s) => s.key)
  if (!isLayout(stored)) return { order: keys, hidden: [] }
  const order = stored.order.filter((k) => keys.includes(k))
  for (const k of keys) if (!order.includes(k)) order.splice(keys.indexOf(k), 0, k)
  return { order, hidden: stored.hidden.filter((k) => keys.includes(k)) }
}

/**
 * Renders a page's sections in the admin-chosen order, skipping hidden ones.
 * `render` maps each section key to the existing section component.
 */
export function renderSections(
  layout: SectionLayout,
  render: Record<string, ReactNode | (() => ReactNode)>,
): ReactNode[] {
  return layout.order
    .filter((key) => !layout.hidden.includes(key) && key in render)
    .map((key) => {
      const node = render[key]
      return createElement(Fragment, { key }, typeof node === "function" ? node() : node)
    })
}
