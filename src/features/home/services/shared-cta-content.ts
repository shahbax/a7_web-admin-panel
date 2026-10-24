import "server-only"

import { getContent } from "@/features/cms/site-content/service"
import type { DeveloperCtaContent } from "@/features/home/content/cms-shared-content"

export type { DeveloperCtaContent }

/** Developer-prices / newsletter band content (`home` and `detail` variants). */
export function loadDeveloperCtaContent() {
  return getContent<DeveloperCtaContent>("shared.developerCta")
}
