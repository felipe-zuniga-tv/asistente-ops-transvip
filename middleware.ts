import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { DriverSession } from '@/types/domain/driver'
import { SignJWT, jwtVerify } from "jose"
import { config as appConfig } from '@/lib/core/config/general'

const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes
const PUBLIC_PATHS = ['/conductores', '/auth']
const DRIVER_COOKIE_KEY = appConfig.COOKIES.DRIVER_COOKIE_KEY

// Use the same secret key as core auth for consistency
const secretKey = appConfig.COOKIES.TOKEN_JWT_SECRET
const key = new TextEncoder().encode(secretKey)

async function encryptSession(payload: DriverSession) {
  return await new SignJWT(payload as unknown as Record<string, any>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Date.now() + SESSION_DURATION)
    .sign(key)
}

async function decryptSession(input: string): Promise<DriverSession> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  })
  return payload as unknown as DriverSession
}

export async function middleware(request: NextRequest) {
  // Skip middleware for public paths
  if (PUBLIC_PATHS.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Legacy session check for driver-access routes
  if (request.nextUrl.pathname.startsWith('/conductores')) {
    const session = request.cookies.get(DRIVER_COOKIE_KEY)

    if (!session) {
      return NextResponse.redirect(new URL('/conductores', request.url))
    }

    try {
      const parsedSession = await decryptSession(session.value)
      
      // Check if session is expired
      if (new Date(parsedSession.expires) < new Date()) {
        const response = NextResponse.redirect(new URL('/conductores', request.url))
        response.cookies.delete(DRIVER_COOKIE_KEY)
        return response
      }

      // Extend session if user is active
      const response = NextResponse.next()
      const newExpiry = new Date(Date.now() + SESSION_DURATION)
      
      const updatedSession = {
        ...parsedSession,
        expires: newExpiry
      }

      const encryptedSession = await encryptSession(updatedSession)

      response.cookies.set(DRIVER_COOKIE_KEY, encryptedSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: newExpiry
      })

      return response
    } catch {
      // Invalid session format
      return NextResponse.redirect(new URL('/conductores', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/conductores', '/conductores/:path*']
}