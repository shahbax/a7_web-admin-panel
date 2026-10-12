import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

/** Disable draft mode and return to the admin. */
export async function GET(request: NextRequest) {
  const dm = await draftMode()
  dm.disable()
  const to = request.nextUrl.searchParams.get("to") ?? "/admin/pages"
  redirect(to.startsWith("/admin") ? to : "/admin/pages")
}
