import type { ContentDefinition } from "@/features/cms/site-content/core/types"
import { aboutContentDefinitions } from "@/features/about/content/cms-content"
import { homeContentDefinitions } from "@/features/home/content/cms-content"
import { sharedContentDefinitions } from "@/features/home/content/cms-shared-content"
import { propertiesPageContentDefinitions } from "@/features/property/content/cms-properties-page-content"
import { servicesContentDefinitions } from "@/features/services/content/cms-content"
import { areaContentDefinitions } from "@/features/area/content/cms-content"
import { developerContentDefinitions } from "@/features/developer/content/cms-content"
import { eventContentDefinitions } from "@/features/event/content/cms-content"
import { careerContentDefinitions } from "@/features/career/content/cms-content"
import { agentContentDefinitions } from "@/features/agent/content/cms-content"
import { projectContentDefinitions } from "@/features/project/content/cms-content"

/**
 * Every editable coded page/dataset. Each feature owns its definitions in
 * `features/<feature>/content/cms-*.ts`; add new ones to this list.
 */
export const contentDefinitions: ContentDefinition[] = [
  ...homeContentDefinitions,
  ...aboutContentDefinitions,
  ...propertiesPageContentDefinitions,
  ...servicesContentDefinitions,
  ...areaContentDefinitions,
  ...developerContentDefinitions,
  ...eventContentDefinitions,
  ...careerContentDefinitions,
  ...agentContentDefinitions,
  ...projectContentDefinitions,
  ...sharedContentDefinitions,
] as ContentDefinition[]
