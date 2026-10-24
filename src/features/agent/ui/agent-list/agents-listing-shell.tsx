"use client"

import { useState } from "react"

import type { BreadcrumbItem } from "@/shared/ui/breadcrumb"
import type { RealEstateAgentProfile } from "@/features/agent/services/agent-profile"

import { AgentsPageHeaderSection } from "./agents-page-header-section"
import { AgentsResultsSection } from "./agents-results-section"

export type AgentsListingShellProps = {
  agents: RealEstateAgentProfile[]
  breadcrumbs: BreadcrumbItem[]
  title?: string
}

export function AgentsListingShell({
  agents,
  breadcrumbs,
  title,
}: AgentsListingShellProps) {
  const [sort, setSort] = useState("featured")

  return (
    <>
      <AgentsPageHeaderSection
        breadcrumbs={breadcrumbs}
        title={title}
        sortValue={sort}
        onSortChange={setSort}
      />
      <AgentsResultsSection agents={agents} sort={sort} />
    </>
  )
}
