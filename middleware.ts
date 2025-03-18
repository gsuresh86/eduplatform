import { NextResponse } from 'next/server'

// Minimal middleware that doesn't interfere with NextAuth
export function middleware() {
  return NextResponse.next()
}

// Exclude all api/auth paths from middleware to avoid interference
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
} 