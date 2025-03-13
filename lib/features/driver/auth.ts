'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { DriverSession, DriverDetails } from '@/types/domain/driver'

const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes

export async function validateDriverWithTransvip(email: string, password: string): Promise<DriverDetails> {
  // TODO: Replace with actual Transvip API call
  if (!password || password.length < 6) {
    throw new Error('Invalid password')
  }

  return {
    id: "driver-id",
    email,
    full_name: "Driver Name",
    active: true,
    vehicle_number: "4212",
    created_at: new Date().toISOString()
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

  cookies().set('driver_session', JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: session.expires
  })

  return session
}

export async function getDriverSession(): Promise<DriverSession | null> {
  const sessionCookie = cookies().get('driver_session')
  
  if (!sessionCookie) {
    redirect('/conductores')
  }

  try {
    const session: DriverSession = JSON.parse(sessionCookie.value)
    
    if (new Date(session.expires) < new Date()) {
      cookies().delete('driver_session')
      redirect('/conductores')
    }

    return session
  } catch {
    cookies().delete('driver_session')
    redirect('/conductores')
  }
}

export async function clearDriverSession() {
  cookies().delete('driver_session')
} 