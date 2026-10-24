import "server-only"

import { getPageContent } from "@/features/cms/site-content/service"
import type { HomeContent } from "@/features/home/content/cms-content"

export type { HomeContent }

export function loadHomeContent() {
  return getPageContent<HomeContent>("page.home")
}
