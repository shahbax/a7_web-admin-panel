import { NextResponse, type NextRequest } from "next/server"

// The CRM dashboard, auth screens and design-system gallery are not public yet.
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/", request.url))
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/welcome",
    "/components/:path*",
    "/icons",
  ],
}
