import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { DriverSession } from '@/types'

const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes
const PUBLIC_PATHS = ['/conductores/login', '/auth']

export async function middleware(request: NextRequest) {
  // Check if the path is /conductores exactly and redirect to /conductores/login
  if (request.nextUrl.pathname === '/conductores') {
    return NextResponse.redirect(new URL('/conductores/login', request.url))
  }

  // Skip middleware for public paths
  if (PUBLIC_PATHS.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Legacy session check for driver-access routes
  if (request.nextUrl.pathname.startsWith('/conductores')) {
    const session = request.cookies.get('driver_session')

    if (!session) {
      return NextResponse.redirect(new URL('/conductores/login', request.url))
    }

    try {
      const parsedSession: DriverSession = JSON.parse(session.value)
      
      // Check if session is expired
      if (new Date(parsedSession.expires) < new Date()) {
        const response = NextResponse.redirect(new URL('/conductores/login', request.url))
        response.cookies.delete('driver_session')
        return response
      }

      // Extend session if user is active
      const response = NextResponse.next()
      const newExpiry = new Date(Date.now() + SESSION_DURATION)
      
      const updatedSession = {
        ...parsedSession,
        expires: newExpiry
      }

      response.cookies.set('driver_session', JSON.stringify(updatedSession), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: newExpiry
      })

      return response
    } catch {
      // Invalid session format
      return NextResponse.redirect(new URL('/conductores/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/conductores', '/conductores/:path*']
}