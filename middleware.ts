import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware() {
  // Handle authentication and other middleware logic here
  
  // Much simpler middleware that doesn't try to handle [...nextauth] patterns
  // We'll just let NextAuth's normal routes work as expected
  
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 