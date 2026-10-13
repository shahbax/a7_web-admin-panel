import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { requireUser } from "@/features/auth/services/guards"
import {
  getPageById,
  listPageVersions,
} from "@/features/cms/pages/services/page-service"
import { PageEditor } from "@/features/cms/pages/ui/page-editor"

export const pageEditorMetadata: Metadata = {
  title: "Edit page · A7 Group admin",
  robots: { index: false, follow: false },
}

export async function PageEditorRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireUser()
  const { id } = await params
  const page = await getPageById(id)
  if (!page) notFound()
  const versions = await listPageVersions(id)

  return (
    <div className="h-full min-h-0">
      <PageEditor page={page} versions={versions} />
    </div>
  )
}
