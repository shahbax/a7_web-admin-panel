import { NextResponse, type NextRequest } from "next/server"

// Old mock routes (CRM dashboard, fake auth screens, design-system gallery) are
// not public and are redirected to the home page.
const BLOCKED_PREFIXES = [
  "/dashboard",
  "/login",
  "/register",
  "/welcome",
  "/components",
  "/icons",
  "/deep-research",
]

// Auth.js session cookie names (http vs. https/__Secure-).
const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
]

function hasSessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIES.some((name) => Boolean(request.cookies.get(name)?.value))
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin/**. This is only a cheap gate; every admin page and server
  // action re-checks the session server-side (never trust the proxy alone).
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    // Allow the login screen and the Auth.js endpoints through unauthenticated.
    if (pathname === "/admin/login" || pathname.startsWith("/api/auth")) {
      return NextResponse.next()
    }
    if (!hasSessionCookie(request)) {
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Redirect the old mock routes to the home page.
  if (BLOCKED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/welcome",
    "/components/:path*",
    "/icons",
    "/deep-research/:path*",
  ],
}
