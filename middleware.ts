import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { DriverSession } from '@/types/domain/driver'
import { SignJWT, jwtVerify } from "jose"
import { config as appConfig } from '@/lib/core/config/general'
import { Routes } from '@/utils/routes'

// General User Session
const GENERAL_USER_SESSION_DURATION = 30 * 60 * 1000; // 30 minutes (fallback if not in appConfig.COOKIES.SESSION_DURATION)
const GENERAL_USER_COOKIE_KEY = appConfig.COOKIES.COOKIE_KEY;

// Driver Session (as existing)
const DRIVER_SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
const DRIVER_COOKIE_KEY = appConfig.COOKIES.DRIVER_COOKIE_KEY;

// Shared secret key
const secretKey = appConfig.COOKIES.TOKEN_JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

// PUBLIC PATHS
// Ensure login page ('/') and login API route are public
const LOGIN_PAGE_PATH = Routes.LOGIN; // Should be '/'
const CUSTOM_LOGIN_API_PATH = '/api/auth/login'; // Your custom login API
const derivedPublicPaths: string[] = Object.values(Routes.PUBLIC);
const PUBLIC_PATHS: string[] = Array.from(new Set([...derivedPublicPaths, LOGIN_PAGE_PATH, CUSTOM_LOGIN_API_PATH]));

// Generic session encryption (adapt payload type if necessary)
async function encryptJoseSession(payload: Record<string, any>, duration: number) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Date.now() + duration)
    .sign(key);
}

// Generic session decryption (adapt return type if necessary)
async function decryptJoseSession(token: string): Promise<Record<string, any>> {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip middleware for explicitly defined public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2. General User Session Check (e.g., for /sso)
  if (pathname.startsWith('/sso')) {
    const sessionCookie = request.cookies.get(GENERAL_USER_COOKIE_KEY);

    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL(LOGIN_PAGE_PATH, request.url));
    }

    try {
      const parsedSession = await decryptJoseSession(sessionCookie.value);
      if (new Date(parsedSession.expires as string | number | Date) < new Date()) { // Check expiry
        const response = NextResponse.redirect(new URL(LOGIN_PAGE_PATH, request.url));
        response.cookies.delete(GENERAL_USER_COOKIE_KEY);
        return response;
      }

      // Extend session if user is active
      const response = NextResponse.next();
      const newExpiry = new Date(Date.now() + GENERAL_USER_SESSION_DURATION);
      // Re-encrypt with all necessary user details from parsedSession.user
      // lib/core/auth.js stores { user, expires } in the JWT.
      const userPayloadForGeneralSession = parsedSession.user; // Assuming decryptJoseSession returns { user: ..., expires: ... }
      if (!userPayloadForGeneralSession) {
        // Invalid session structure if user property is missing
        const response = NextResponse.redirect(new URL(LOGIN_PAGE_PATH, request.url));
        response.cookies.delete(GENERAL_USER_COOKIE_KEY);
        return response;
      }
      const updatedSessionData = { user: userPayloadForGeneralSession, expires: newExpiry };
      const encryptedSession = await encryptJoseSession(updatedSessionData, GENERAL_USER_SESSION_DURATION);
      
      response.cookies.set(GENERAL_USER_COOKIE_KEY, encryptedSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: newExpiry,
        path: '/',
      });
      return response;

    } catch (err) {
      // Invalid session format or decryption error
      const response = NextResponse.redirect(new URL(LOGIN_PAGE_PATH, request.url));
      response.cookies.delete(GENERAL_USER_COOKIE_KEY);
      return response;
    }
  }

  // 3. Driver Session Check (for /conductores)
  // Note: If Routes.PUBLIC.TICKETS = '/conductores', this block might only apply to sub-paths
  // or if the public path check is more specific (e.g., exact match).
  // The current PUBLIC_PATHS.some(path => pathname.startsWith(path)) means /conductores itself is public.
  // This logic will apply if pathname.startsWith('/conductores') but IS NOT '/conductores' itself IF '/conductores' is public.
  if (pathname.startsWith('/conductores') && !PUBLIC_PATHS.includes(pathname)) { // Added !PUBLIC_PATHS.includes(pathname) for clarity
    const driverSessionCookie = request.cookies.get(DRIVER_COOKIE_KEY);

    if (!driverSessionCookie?.value) {
      // Redirect to driver login or a general error/access page if different from main login
      return NextResponse.redirect(new URL(Routes.DRIVERS.HOME, request.url)); // Assuming /conductores is the driver home/login
    }

    try {
      const parsedDriverSession = await decryptJoseSession(driverSessionCookie.value) as DriverSession; // Cast if structure is known
      if (new Date(parsedDriverSession.expires) < new Date()) {
        const response = NextResponse.redirect(new URL(Routes.DRIVERS.HOME, request.url));
        response.cookies.delete(DRIVER_COOKIE_KEY);
        return response;
      }

      const response = NextResponse.next();
      const newDriverExpiry = new Date(Date.now() + DRIVER_SESSION_DURATION);
      const updatedDriverSessionData = { ...parsedDriverSession, expires: newDriverExpiry };
      const encryptedDriverSession = await encryptJoseSession(updatedDriverSessionData, DRIVER_SESSION_DURATION);
      
      response.cookies.set(DRIVER_COOKIE_KEY, encryptedDriverSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: newDriverExpiry,
        path: '/',
      });
      return response;

    } catch (err) {
      const response = NextResponse.redirect(new URL(Routes.DRIVERS.HOME, request.url));
      response.cookies.delete(DRIVER_COOKIE_KEY);
      return response;
    }
  }
  
  // 4. Default behavior for any other authenticated routes not covered above
  // This part is reached if a path is NOT public, NOT /sso, and NOT /conductores.
  // It should check for the general user session.
  const generalSessionCookie = request.cookies.get(GENERAL_USER_COOKIE_KEY);
  if (!generalSessionCookie?.value) {
      return NextResponse.redirect(new URL(LOGIN_PAGE_PATH, request.url));
  }
  try {
      const parsedGeneralSession = await decryptJoseSession(generalSessionCookie.value);
      if (new Date(parsedGeneralSession.expires as string | number | Date) < new Date()) {
          const response = NextResponse.redirect(new URL(LOGIN_PAGE_PATH, request.url));
          response.cookies.delete(GENERAL_USER_COOKIE_KEY);
          return response;
      }
      // If session is valid, allow and refresh
      const response = NextResponse.next();
      const newGeneralExpiry = new Date(Date.now() + GENERAL_USER_SESSION_DURATION);
      const userPayloadForDefaultPath = parsedGeneralSession.user; // Assuming decryptJoseSession returns { user: ..., expires: ... }
      if (!userPayloadForDefaultPath) {
        // Invalid session structure
        const errResponse = NextResponse.redirect(new URL(LOGIN_PAGE_PATH, request.url));
        errResponse.cookies.delete(GENERAL_USER_COOKIE_KEY);
        return errResponse;
      }
      const updatedGeneralSessionData = { user: userPayloadForDefaultPath, expires: newGeneralExpiry };
      const encryptedGeneralSession = await encryptJoseSession(updatedGeneralSessionData, GENERAL_USER_SESSION_DURATION);
      
      response.cookies.set(GENERAL_USER_COOKIE_KEY, encryptedGeneralSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: newGeneralExpiry,
        path: '/',
      });
      return response;

  } catch (error) {
      const response = NextResponse.redirect(new URL(LOGIN_PAGE_PATH, request.url));
      response.cookies.delete(GENERAL_USER_COOKIE_KEY);
      return response;
  }

  // Fallback, though ideally all paths are handled or public.
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware to all paths except for static assets and specific files.
    // This is a common pattern. Adjust if you have other top-level public folders.
    '/((?!_next/static|_next/image|favicon.ico|api/auth/login|.+\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Ensure /sso and /conductores are included if not covered by the general pattern,
    // though the above pattern should cover them.
    // Redundant if covered by the general pattern above:
    // '/sso/:path*',
    // '/conductores/:path*',
  ],
};
