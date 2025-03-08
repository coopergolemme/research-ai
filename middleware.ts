import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Check if the request is for the research action
  if (request.nextUrl.pathname === "/api/research") {
    // In a real application, you might want to add authentication checks here
  }

  return response
}

export const config = {
  matcher: ["/api/:path*"],
}

