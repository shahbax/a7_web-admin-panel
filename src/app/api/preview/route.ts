import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

import { getCurrentUser } from "@/features/auth/services/guards"

/** Enable Next draft mode for an authenticated admin, then show the draft page. */
export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/admin/login")
  }
  const slug = request.nextUrl.searchParams.get("slug") ?? ""
  const dm = await draftMode()
  dm.enable()
  redirect(`/${slug.replace(/^\/+/, "")}`)
}
