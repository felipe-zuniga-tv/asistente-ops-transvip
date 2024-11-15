'use server'

import { cookies } from 'next/headers'
import { encrypt } from '../auth'

interface LoginResponse {
  data?: {
    id: string
    access_token: string
  }
  status: number
}

interface UserResponse {
  data: {
    result: Array<{
      fullName: string
    }>
  }
}

interface ActionResponse {
  status: number
  error?: string
  data?: Record<string, unknown>
}

const COOKIE_KEY = process.env.COOKIE_KEY
const secondsToExpire = 60 * 10

const API_HEADERS = {
  'Accept': 'application/json',
  'Content-Language': 'es',
  'Content-Type': 'application/json;charset=UTF-8',
} as const

export async function loginAction(formData: FormData): Promise<ActionResponse> {
  const LOGIN_URL = `${process.env.API_BASE_URL}/${process.env.API_ADMIN_LOGIN_ROUTE}`
  const ADMIN_ID_URL = `${process.env.API_BASE_URL}/${process.env.API_ADMIN_IDENTITY}`
  
  console.log('API URLs:', {
    LOGIN_URL,
    ADMIN_ID_URL,
    COOKIE_KEY: !!COOKIE_KEY
  })

  try {
    const email = formData.get('email')?.toString()
    const password = formData.get('password')?.toString()

    if (!email?.includes('@') || !password?.length) {
      return { status: 400, error: 'Invalid credentials format' }
    }

    // First API call - Login
    const loginResponse = await fetch(LOGIN_URL, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: API_HEADERS,
    })

    const loginData = await loginResponse.json() as LoginResponse

    if (loginData.status !== 200 || !loginData.data?.id) {
      return { 
        status: loginData.status || 400, 
        error: 'Authentication failed' 
      }
    }

    // Second API call - Get user details
    const userResponse = await fetch(
      `${ADMIN_ID_URL}?admin_id=${loginData.data.id}&limit=0&offset=0`,
      { headers: API_HEADERS }
    )

    const userData = await userResponse.json() as UserResponse

    if (!userData.data?.result?.[0]?.fullName) {
      return { status: 400, error: 'Failed to fetch user details' }
    }

    // Create session
    const user = {
      email,
      accessToken: loginData.data.access_token,
      full_name: userData.data.result[0].fullName
    }

    const expires = new Date(Date.now() + secondsToExpire * 1000)
    const session = await encrypt({ user, expires })

    console.log('Attempting to set cookie with session data', {
      expiresAt: expires.toISOString(),
      hasUserData: !!user,
      cookieOptions: {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      }
    })

    if (!COOKIE_KEY) {
      throw new Error('COOKIE_KEY environment variable is not set')
    }

    // Set cookie with modified options for production
    cookies().set(COOKIE_KEY, session, { 
      expires,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/'
    })

    return { status: 200, data: loginData.data }
  } catch (error) {
    console.error('Login action error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      phase: 'cookie-setting'
    })
    
    return { 
      status: 500, 
      error: error instanceof Error ? error.message : 'Internal server error'
    }
  }
}