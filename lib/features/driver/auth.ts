'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignJWT, jwtVerify } from "jose"
import type { DriverSession, DriverDetails } from '@/types/domain/driver'
import { config as appConfig } from '@/lib/core/config/general'
import { Routes } from '@/utils/routes'

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

export async function createDriverSession(driver: DriverDetails): Promise<DriverSession> {
	const session: DriverSession = {
		driver_id: driver.fleet_id,
		email: driver.email,
		full_name: `${driver.first_name.trim()} ${driver.last_name.trim()}`,
		expires: new Date(Date.now() + SESSION_DURATION)
	}

	const encryptedSession = await encryptSession(session)

	(await cookies()).set(DRIVER_COOKIE_KEY, encryptedSession, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		expires: session.expires
	})

	return session
}

export async function getDriverSession(): Promise<DriverSession | null> {
	const sessionCookie = (await cookies()).get(DRIVER_COOKIE_KEY)

	if (!sessionCookie) {
		redirect(Routes.DRIVERS.HOME)
	}

	try {
		const session = await decryptSession(sessionCookie.value)

		if (new Date(session.expires) < new Date()) {
			(await cookies()).delete(DRIVER_COOKIE_KEY)
			redirect(Routes.DRIVERS.HOME)
		}

		return session
	} catch {
		(await cookies()).delete(DRIVER_COOKIE_KEY)
		redirect(Routes.DRIVERS.HOME)
	}
}

export async function clearDriverSession() {
	(await cookies()).delete(DRIVER_COOKIE_KEY)
} 