import "server-only"

import { getPageContent } from "@/features/cms/site-content/service"
import type { AboutContent } from "@/features/about/content/cms-content"

export type { AboutContent }

export function loadAboutContent() {
  return getPageContent<AboutContent>("page.about")
}
