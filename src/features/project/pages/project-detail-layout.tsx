import { notFound } from "next/navigation"

import { ThemeScope, ThemeSync } from "@/shared/theme"
import { loadSecondaryProject, loadSecondaryProjectIds } from "@/features/project/services/project-content"

type ProjectDetailLayoutProps = {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export async function generateProjectDetailStaticParams() {
  const ids = await loadSecondaryProjectIds()
  return ids.map((id) => ({ id }))
}

export default async function ProjectDetailLayout({ children, params }: ProjectDetailLayoutProps) {
  const { id } = await params
  const loaded = await loadSecondaryProject(id)

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
