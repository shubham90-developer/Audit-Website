import { NextRequest, NextResponse } from 'next/server'

/**
 * Route gate for the admin panel (runs on the edge before any page renders).
 *
 * It only checks that a non-expired JWT cookie exists. It cannot prove the token is genuine -
 * that is the API's job (backend/middlewares/auth.ts), and any forged token fails there with 401,
 * which logs the user out. This just keeps logged-out visitors off the admin pages.
 */
const SIGN_IN = '/auth/sign-in'

const isExpired = (token: string): boolean => {
  try {
    const part = token.split('.')[1]
    const payload = JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now()
  } catch {
    return true
  }
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const raw = request.cookies.get('token')?.value
  const token = raw ? decodeURIComponent(raw) : undefined
  const authenticated = !!token && !isExpired(token)

  if (pathname === SIGN_IN) {
    return authenticated ? NextResponse.redirect(new URL('/dashboard', request.url)) : NextResponse.next()
  }

  if (!authenticated) {
    const url = new URL(SIGN_IN, request.url)
    if (pathname !== '/') url.searchParams.set('redirect', pathname + search)
    const response = NextResponse.redirect(url)
    if (raw) response.cookies.delete('token') // stale cookie
    return response
  }

  if (pathname === '/') return NextResponse.redirect(new URL('/dashboard', request.url))
  return NextResponse.next()
}

export const config = {
  // everything except Next internals, static files and images
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|css|js|map|woff2?)$).*)'],
}
