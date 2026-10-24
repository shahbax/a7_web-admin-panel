function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false
  if ("$$typeof" in (value as object)) return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/**
 * Builds a "shape" of the content by merging every sibling value at the same
 * path: all items of an array are unioned into one template item, so an array
 * that is empty in one place (e.g. a project with no story blocks) still knows
 * what its items look like from another place where it isn't.
 */
export function unionShape(values: unknown[]): unknown {
  const present = values.filter((v) => v !== undefined && v !== null)
  if (present.length === 0) return values[0]
  const first = present[0]

  if (present.every(Array.isArray)) {
    const elements = (present as unknown[][]).flat()
    return elements.length > 0 ? [unionShape(elements)] : []
  }

  if (isPlainObject(first) && present.every(isPlainObject)) {
    const objects = present as Record<string, unknown>[]
    const keys = [...new Set(objects.flatMap((o) => Object.keys(o)))]
    const out: Record<string, unknown> = {}
    for (const key of keys) out[key] = unionShape(objects.map((o) => o[key]))
    return out
  }

  if (typeof first === "string") {
    return present.find((v) => typeof v === "string" && v !== "") ?? first
  }
  return first
}

/** The shape of a definition's defaults (also used as the editor's templates). */
export function contentShape(defaults: unknown): unknown {
  // Group siblings by walking the tree: every array's elements are unioned with
  // the elements of arrays at the same path in other items.
  return unionShape([defaults])
}
