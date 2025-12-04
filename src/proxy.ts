import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/server/better-auth/server"

export async function proxy(request: NextRequest) {
  const session = await getSession()

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (Next.js static files)
     * - _next/image (Next.js image optimization files)
     * - favicon.ico, *.svg, *.png, *.jpg, *.jpeg, *.gif, *.webp (static assets)
     * - / (root page)
     * - /properties (properties page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$|properties|$).*)",
  ],
}
