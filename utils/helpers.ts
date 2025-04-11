import { getSession } from "@/lib/core/auth"

// Utility function to get access token
export async function getAccessToken() {
    const sessionToken = (await getSessionToken()) || process.env.TOKEN_FINANCE_PARKING_TICKETS || null
    return sessionToken || ''
}

export async function getSessionToken() {
    const session = await getSession()
    const currentUser = session?.user as any
    return currentUser?.accessToken as string
}


// Utility function to build URL parameters
export function buildUrlParams(params: Record<string, string | number>) {
    return Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
}