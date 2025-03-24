'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignJWT, jwtVerify } from "jose"
import type { DriverSession, DriverDetails } from '@/types/domain/driver'
import { searchDriver, getDriverProfile } from '@/lib/services/driver'
import { config as appConfig } from '@/lib/core/config/general'

const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes
const DRIVER_COOKIE_KEY = appConfig.COOKIES.DRIVER_COOKIE_KEY

// Use the same secret key as core auth for consistency
const secretKey = appConfig.COOKIES.TOKEN_JWT_SECRET
const key = new TextEncoder().encode(secretKey)

// Add error handling for missing env variables
if (!secretKey) throw new Error('TOKEN_JWT_SECRET is not defined')

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

export async function validateDriverWithTransvip(email: string, password: string): Promise<DriverDetails> {
  if (!email || !password || password.length < 6) {
    throw new Error('Credenciales inválidas')
  }

  try {
    // Search driver by email
    const driver = await searchDriver(email)
    if (!driver || !driver.fleet_id) {
      throw new Error('Conductor no encontrado')
    }

    // Get driver profile
    const driverProfile = await getDriverProfile(driver.fleet_id)
    if (!driverProfile) {
      throw new Error('No se pudo obtener el perfil del conductor')
    }

    // Check if driver is active
    if (driverProfile.status.is_active !== 1) {
      throw new Error('Esta cuenta de conductor no está activa')
    }

    // TODO: Replace this with actual password validation once API endpoint is available
    // For now, we're using a minimum length validation
    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres')
    }

    return {
      id: driver.fleet_id.toString(),
      email: driverProfile.personal.email,
      full_name: driverProfile.personal.full_name,
      active: driverProfile.status.is_active === 1,
      created_at: driverProfile.created_at,
      last_login: driverProfile.last_login,
      vehicle_number: driverProfile.current_license_plate || ""
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Error al validar las credenciales')
  }
}

export async function createDriverSession(driver: DriverDetails): Promise<DriverSession> {
  const session: DriverSession = {
    driver_id: driver.id,
    email: driver.email,
    full_name: driver.full_name,
    vehicle_number: driver.vehicle_number || "",
    expires: new Date(Date.now() + SESSION_DURATION)
  }

  const encryptedSession = await encryptSession(session)
  
  cookies().set(DRIVER_COOKIE_KEY, encryptedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: session.expires
  })

  return session
}

export async function getDriverSession(): Promise<DriverSession | null> {
  const sessionCookie = cookies().get(DRIVER_COOKIE_KEY)
  
  if (!sessionCookie) {
    redirect('/conductores')
  }

  try {
    const session = await decryptSession(sessionCookie.value)
    
    if (new Date(session.expires) < new Date()) {
      cookies().delete(DRIVER_COOKIE_KEY)
      redirect('/conductores')
    }

    return session
  } catch {
    cookies().delete(DRIVER_COOKIE_KEY)
    redirect('/conductores')
  }
}

export async function clearDriverSession() {
  cookies().delete(DRIVER_COOKIE_KEY)
} 