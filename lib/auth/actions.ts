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

  const email = formData.get('email')?.toString()
  const password = formData.get('password')?.toString()

  if (!email?.includes('@') || !password?.length) {
    return { status: 400, error: 'Invalid credentials format' }
  }

  try {
    const loginData = await fetchLoginData(LOGIN_URL, email, password)
    if (!loginData || !loginData.data) return { status: 400, error: 'Authentication failed' }

    const userData = await fetchUserData(ADMIN_ID_URL, loginData.data.id)
    if (!userData) return { status: 400, error: 'Failed to fetch user details' }

    const session = await createSession(email, loginData.data.access_token, userData.fullName)
    setCookie(session)

    return { status: 200, data: loginData.data }
  } catch (error) {
    return handleError(error)
  }
}

// Helper functions
async function fetchLoginData(url: string, email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: API_HEADERS,
  })
  if (!response.ok) throw new Error('Login failed')
  return await response.json() as LoginResponse
}

async function fetchUserData(url: string, adminId: string): Promise<{ fullName: string }> {
  const response = await fetch(`${url}?admin_id=${adminId}&limit=0&offset=0`, { headers: API_HEADERS })
  if (!response.ok) throw new Error('User data fetch failed')
  const data = await response.json() as UserResponse
  return data.data?.result?.[0] || { fullName: 'Unknown' }
}

async function createSession(email: string, accessToken: string, fullName: string) {
  const expires = new Date(Date.now() + secondsToExpire * 1000)
  const user = { email, accessToken, full_name: fullName }
  return await encrypt({ user, expires })
}

function setCookie(session: string) {
  const expires = new Date(Date.now() + secondsToExpire * 1000);
  
  if (!COOKIE_KEY) {
    console.error('COOKIE_KEY is not defined');
    return;
  }

  try {
    cookies().set(COOKIE_KEY, session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
}

function handleError(error: unknown): ActionResponse {
  console.error('Login action error:', {
    error: error instanceof Error ? error.message : 'Unknown error',
  })
  return { status: 500, error: error instanceof Error ? error.message : 'Internal server error' }
}