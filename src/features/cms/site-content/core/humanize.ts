/** "heroTitle" → "Hero title". */
export function humanize(key: string): string {
  const s = key
    .replace(/\[\]/g, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase()
  return s.charAt(0).toUpperCase() + s.slice(1)
}
