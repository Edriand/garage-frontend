import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE = 'garage-auth-session'

const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/verify',
  '/forgot-password',
  '/reset-password',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = request.cookies.has(AUTH_COOKIE)

  const isPublic = PUBLIC_ROUTES.some(
    r => pathname === r || pathname.startsWith(r + '/'),
  )

  if (!isAuthenticated && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/garage', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Run on all routes except Next.js internals and static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
