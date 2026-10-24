export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

export type JsonObject = { [key: string]: JsonValue }

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false
  if ("$$typeof" in (value as object)) return false // React element
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/**
 * Converts code defaults to plain JSON the admin can edit. Functions, React
 * elements/components and other non-data values are dropped: they stay in code
 * and are re-attached by `mergeContent`.
 */
export function toEditable(value: unknown): JsonValue | undefined {
  if (value === null) return null
  if (typeof value === "string" || typeof value === "boolean") return value
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined
  if (Array.isArray(value)) {
    return value.map(toEditable).filter((v): v is JsonValue => v !== undefined)
  }
  if (isPlainObject(value)) {
    const out: JsonObject = {}
    for (const [k, v] of Object.entries(value)) {
      const e = toEditable(v)
      if (e !== undefined) out[k] = e
    }
    return out
  }
  return undefined
}

function itemId(value: unknown): string | undefined {
  if (!isPlainObject(value)) return undefined
  const id = value.id ?? value.slug
  return typeof id === "string" || typeof id === "number" ? String(id) : undefined
}

/**
 * Deep-merges stored admin edits over the code defaults.
 *
 * - Only values whose type matches the default are accepted, so a page always
 *   receives the shape its components expect.
 * - Keys that don't exist in the defaults are ignored.
 * - Arrays take the stored length and order. Each stored item is merged over
 *   the default item with the same `id`/`slug` (keeping per-item icons and
 *   components), else the default at the same index, else the first default
 *   item as a template.
 */
export function mergeContent<T>(defaults: T, stored: unknown): T {
  return mergeValue(defaults, stored) as T
}

function mergeValue(d: unknown, s: unknown): unknown {
  if (s === undefined) return d

  if (typeof d === "string") return typeof s === "string" ? s : d
  if (typeof d === "number") return typeof s === "number" && Number.isFinite(s) ? s : d
  if (typeof d === "boolean") return typeof s === "boolean" ? s : d

  if (d === null || d === undefined) {
    // Optional field with no default value: accept plain JSON primitives only.
    if (s === null || typeof s === "string" || typeof s === "number" || typeof s === "boolean") {
      return s
    }
    return d
  }

  if (Array.isArray(d)) {
    if (!Array.isArray(s)) return d
    if (d.length === 0) {
      // No template to validate against: accept only primitive items.
      return s.filter((x) => ["string", "number", "boolean"].includes(typeof x))
    }
    const byId = new Map<string, unknown>()
    for (const item of d) {
      const id = itemId(item)
      if (id !== undefined) byId.set(id, item)
    }
    return s.map((item, i) => {
      const id = itemId(item)
      const base = (id !== undefined ? byId.get(id) : undefined) ?? (i < d.length && itemId(d[i]) === undefined ? d[i] : undefined) ?? d[0]
      return mergeValue(base, item)
    })
  }

  if (isPlainObject(d)) {
    if (!isPlainObject(s)) return d
    const out: Record<string, unknown> = { ...d }
    for (const key of Object.keys(d)) {
      out[key] = mergeValue(d[key], s[key])
    }
    return out
  }

  // Functions, React elements, class instances: not editable, keep the code value.
  return d
}

/** A blank-ish copy of a template item for "Add item" in the editor. */
export function cloneTemplate(template: JsonValue | undefined): JsonValue {
  if (template === undefined) return ""
  const copy = JSON.parse(JSON.stringify(template)) as JsonValue
  if (copy && typeof copy === "object" && !Array.isArray(copy)) {
    for (const idKey of ["id", "slug"]) {
      if (typeof copy[idKey] === "string") {
        copy[idKey] = `${copy[idKey]}-${Math.random().toString(36).slice(2, 7)}`
      }
    }
  }
  return copy
}
