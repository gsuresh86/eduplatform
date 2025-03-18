import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Handle authentication and other middleware logic here
  
  // Redirect [...nextauth] requests to our new nextauth endpoint
  // This allows us to maintain compatibility with libraries expecting the [...nextauth] pattern
  // while using a GitHub-friendly file structure
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    const segments = request.nextUrl.pathname.split('/');
    if (segments[3] === '[...nextauth]') {
      // Redirect to our GitHub-friendly endpoint
      const newUrl = request.nextUrl.clone();
      newUrl.pathname = '/api/auth/nextauth';
      return NextResponse.rewrite(newUrl);
    }
  }

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