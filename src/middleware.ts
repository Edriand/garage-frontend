import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE = 'garage-auth-session'
const PROTECTED_PREFIXES = ['/garage', '/cars']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = request.cookies.has(AUTH_COOKIE)

  const isProtected = PROTECTED_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(prefix + '/'),
  )

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/garage', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/garage/:path*', '/cars/:path*', '/login'],
}
