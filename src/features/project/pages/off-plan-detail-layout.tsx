import { notFound } from "next/navigation"

import { ThemeScope, ThemeSync } from "@/shared/theme"
import { loadOffPlanProject, loadOffPlanProjectIds } from "@/features/project/services/project-content"

type OffPlanDetailLayoutProps = {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export async function generateOffPlanDetailStaticParams() {
  const ids = await loadOffPlanProjectIds()
  return ids.map((id) => ({ id }))
}

export default async function OffPlanDetailLayout({ children, params }: OffPlanDetailLayoutProps) {
  const { id } = await params
  const loaded = await loadOffPlanProject(id)

  if (!loaded) {
    notFound()
  }

  const { theme } = loaded

  return (
    <>
      <ThemeSync theme={theme} />
      <ThemeScope theme={theme}>{children}</ThemeScope>
    </>
  )
}
