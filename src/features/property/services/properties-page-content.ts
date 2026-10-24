import "server-only"

import { getPageContent } from "@/features/cms/site-content/service"
import type { PropertiesPageContent } from "@/features/property/content/cms-properties-page-content"

export type { PropertiesPageContent }

export function loadPropertiesPageContent() {
  return getPageContent<PropertiesPageContent>("page.properties")
}
