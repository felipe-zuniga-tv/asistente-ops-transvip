import { createSession, setCookie } from "@/lib/core/auth";

/**
 * Returns the full URL for the admin login endpoint by combining environment variables
 */
export function getLoginUrl(): string {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/${process.env.NEXT_PUBLIC_API_ADMIN_LOGIN_ROUTE}`;
}

/**
 * Returns the full URL for the admin identity endpoint by combining environment variables
 */
function getAdminIdUrl(): string {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/${process.env.NEXT_PUBLIC_API_ADMIN_IDENTITY}`;
}

/**
 * Checks if the API configuration environment variables are properly set
 */
function isApiConfigured(): boolean {
    return !!process.env.NEXT_PUBLIC_API_BASE_URL && !!process.env.NEXT_PUBLIC_API_ADMIN_LOGIN_ROUTE;
}

/**
 * Validates that both email and password fields have values
 * @param email - User's email address
 * @param password - User's password
 */
function isValidCredentials(email: string, password: string): boolean {
    return !!email && !!password;
}

/**
 * Returns standardized headers for API requests
 */
function getApiHeaders(): Record<string, string> {
    return {
        "Accept": "application/json",
        "Content-Language": "es",
        "Content-Type": "application/json;charset=UTF-8",
    };
}

/**
 * Makes a POST request to the login API endpoint
 * @param url - Complete login API URL
 * @param email - User's email address
 * @param password - User's password
 * @throws Error if the login request fails
 */
export async function fetchLoginData(url: string, email: string, password: string): Promise<any> {
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: getApiHeaders(),
    });
    if (!response.ok) throw new Error('Login failed');
    return await response.json();
}

/**
 * Fetches user data from the admin identity API endpoint
 * @param adminId - The admin ID to fetch details for
 * @throws Error if the user data fetch fails
 */
export async function fetchUserData(adminId: string): Promise<any> {
    const ADMIN_ID_URL = getAdminIdUrl();
    const response = await fetch(`${ADMIN_ID_URL}?admin_id=${adminId}&limit=0&offset=0`, {
        method: "GET",
        headers: getApiHeaders(),
    });
    if (!response.ok) throw new Error('User data fetch failed');
    return await response.json();
}

interface LoginResponse {
    status: number;
    user: any | null;
    message: string;
}

/**
 * Main login function that authenticates a user and creates a session
 * @param email - User's email address
 * @param password - User's password
 */
export const login = async (email: string, password: string): Promise<LoginResponse | null> => {
    const LOGIN_URL = getLoginUrl();

    if (!isApiConfigured() || !isValidCredentials(email, password)) {
        return null
    }

    try {
        const loginResponse = await fetchLoginData(LOGIN_URL, email, password);
        if (!loginResponse) return null
        
        switch (loginResponse.status) {
            case 200:
                const { data: userResponse } = await fetchUserData(loginResponse.data.id);
                if (!userResponse) return null;

                const { user, session } = await createSession(loginResponse.data.access_token, userResponse.result[0]);
                await setCookie(session);

                return {
                    status: 200,
                    user: user,
                    message: 'Login exitoso',
                }
            case 201:
                return {
                    status: 201,
                    user: null,
                    message: '¿Estás conectado a VPN?'
                }
            case 401:
                return {
                    status: 401,
                    user: null,
                    message: 'Credenciales inválidas'
                }
            default:
                return {
                    status: 500,
                    user: null,
                    message: 'Ocurrió un error. No se ha podido iniciar sesión.'
                }
        }
    } catch (error) {
        console.error('Login error:', error);
        return null
    }
}