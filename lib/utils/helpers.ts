import { getSession } from "../auth"

// Utility function to get access token
export async function getAccessToken() {
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