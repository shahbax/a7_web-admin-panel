// Block system types — client-safe (no component imports), so the admin editor
// can build forms from these definitions without pulling in server components.

export type BlockFieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "image"
  | "url"
  | "boolean"
  | "select"
  | "list"

export type BlockField = {
  name: string
  label: string
  type: BlockFieldType
  placeholder?: string
  help?: string
  options?: { label: string; value: string }[] // for select
  itemFields?: BlockField[] // for list
  itemLabel?: string // for list
}

export type BlockProps = Record<string, unknown>

export type Block = {
  id: string
  type: string
  props: BlockProps
  visible: boolean
}

export type BlockCategory = "generic" | "existing"

export type BlockDefinition = {
  type: string
  label: string
  description?: string
  category: BlockCategory
  fields: BlockField[]
  defaults: BlockProps
  /** Page templates this block may be added to. Empty = any. */
  allowedOn?: string[]
}

export function newBlock(def: BlockDefinition): Block {
  return {
    id: Math.random().toString(36).slice(2, 10),
    type: def.type,
    props: structuredClone(def.defaults),
    visible: true,
  }
}
