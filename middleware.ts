import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./lib/jwt"

const PROTECTED_PAGES = ["/dashboard"]
const PROTECTED_API = ["/api/purchase", "/api/agents"] // POST-only for /api/agents

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtectedPage = PROTECTED_PAGES.some((p) => pathname.startsWith(p))
  const isProtectedApi = PROTECTED_API.some((p) => pathname.startsWith(p))

  if (!isProtectedPage && !isProtectedApi) return NextResponse.next()

  const token = req.cookies.get("token")?.value
  if (!token) {
    // Page: redirect, API: 401
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const url = new URL("/auth/login", req.url)
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  try {
    await verifyToken(token)
    // For /api/agents GET should be public; enforce only on POST
    if (pathname === "/api/agents" && req.method !== "POST") {
      return NextResponse.next()
    }
    return NextResponse.next()
  } catch {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const url = new URL("/auth/login", req.url)
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
}
