import "server-only"

import sanitizeHtml from "sanitize-html"

/** Allowlist for admin-authored rich text: formatting, links, images, tables. No scripts, styles or event handlers. */
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "hr", "h2", "h3", "h4", "h5", "h6", "strong", "b", "em", "i", "u", "s",
      "blockquote", "ul", "ol", "li", "a", "img", "span", "div", "table", "thead",
      "tbody", "tr", "th", "td", "figure", "figcaption", "code", "pre",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel", "title"],
      img: ["src", "alt", "width", "height", "loading"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: attribs.target === "_blank" ? { ...attribs, rel: "noopener noreferrer" } : attribs,
      }),
    },
  })
}

/** Sanitises every field declared as rich text on a props object. */
export function sanitizeRichFields<T extends Record<string, unknown>>(
  props: T,
  fields: readonly { name: string; type: string }[],
): T {
  const out: Record<string, unknown> = { ...props }
  for (const field of fields) {
    if (field.type === "richtext" && typeof out[field.name] === "string") {
      out[field.name] = sanitizeRichText(out[field.name] as string)
    }
  }
  return out as T
}
