import type {
  ContentDefinition,
  ContentDefinitionInfo,
  ContentGroup,
} from "@/features/cms/site-content/core/types"
import { contentDefinitions as definitions } from "@/features/cms/site-content/definitions"

export const CONTENT_GROUP_ORDER: ContentGroup[] = [
  "Home",
  "Pages",
  "Services",
  "Directories",
  "Projects",
  "Shared",
]

export function getContentDefinition(key: string): ContentDefinition | undefined {
  return definitions.find((d) => d.key === key)
}

export function listContentDefinitions(): readonly ContentDefinition[] {
  return definitions
}

export function toDefinitionInfo(def: ContentDefinition): ContentDefinitionInfo {
  return {
    key: def.key,
    label: def.label,
    group: def.group,
    description: def.description,
    previewPath: def.previewPath,
    kind: def.kind,
    sections: def.kind === "single" ? def.sections : undefined,
    idField: def.kind === "list" ? def.idField : undefined,
    titleField: def.kind === "list" ? def.titleField : undefined,
    hints: def.hints,
  }
}
