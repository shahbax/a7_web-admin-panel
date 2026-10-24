import type { ContentDefinition } from "@/features/cms/site-content/core/types"
import { aboutContentDefinitions } from "@/features/about/content/cms-content"

/**
 * Every editable coded page/dataset. Each feature owns its definitions in
 * `features/<feature>/content/cms-content.ts`; add new ones to this list.
 */
export const contentDefinitions: ContentDefinition[] = [
  ...aboutContentDefinitions,
]
