'use server'

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.TOKEN_JWT_SECRET;
const key = new TextEncoder().encode(secretKey);
const COOKIE_KEY = process.env.COOKIE_KEY
const secondsToExpire = 60 * 10

// Add error handling for missing env variables
if (!secretKey) throw new Error('TOKEN_JWT_SECRET is not defined')
if (!COOKIE_KEY) throw new Error('COOKIE_KEY is not defined')

export async function encrypt(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(Date.now() + secondsToExpire * 1000)
        .sign(key);
}

export async function decrypt(input) {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    })
    return payload
}

export async function login(formData) {
    const LOGIN_URL = `${process.env.API_BASE_URL}/${process.env.API_ADMIN_LOGIN_ROUTE}`
    
    if (!process.env.API_BASE_URL || !process.env.API_ADMIN_LOGIN_ROUTE) {
        return { status: 500, data: null, error: 'API configuration missing' }
    }

    try {
        // Validate input
        const email = formData.get("email")?.toString()
        const password = formData.get("password")?.toString()

        if (!email || !password) {
            return { status: 400, data: null, error: 'Missing credentials' }
        }

        // First API call - Login
        const loginResponse = await fetch(LOGIN_URL, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
                "Accept": "application/json",
                "Content-Language": "es",
                "Content-Type": "application/json;charset=UTF-8",
            },
        })

        if (!loginResponse.ok) {
            return { 
                status: loginResponse.status, 
                data: null, 
                error: 'Authentication failed' 
            }
        }

        const { data, status } = await loginResponse.json()

        if (status !== 200 || !data) {
            return { status, data: null, error: 'Invalid response from server' }
        }

        // Second API call - Get user details
        const ADMIN_ID_URL = `${process.env.API_BASE_URL}/${process.env.API_ADMIN_IDENTITY}`
        const userResponse = await fetch(
            `${ADMIN_ID_URL}?admin_id=${data.id}&limit=0&offset=0`, 
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Language": "es",
                    "Content-Type": "application/json;charset=UTF-8",
                },
            }
        )

        if (!userResponse.ok) {
            return { 
                status: userResponse.status, 
                data: null, 
                error: 'Failed to fetch user details' 
            }
        }

        const { data: userData, status: userStatus } = await userResponse.json()

        if (userStatus !== 200 || !userData?.result?.[0]) {
            return { 
                status: userStatus, 
                data: null, 
                error: 'Invalid user data' 
            }
        }

        // Create session
        const user = {
            email,
            accessToken: data.access_token,
            full_name: userData.result[0].fullName
        }

        const expires = new Date(Date.now() + secondsToExpire * 1000)
        const session = await encrypt({ user, expires })

        // Set cookie
        cookies().set(COOKIE_KEY, session, { 
            expires, 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        })

        return { status: 200, data }

    } catch (error) {
        console.error('Login error:', error)
        return { 
            status: 500, 
            data: null, 
            error: 'Internal server error' 
        }
    }
}

export async function logout() {
    // Destroy the session
    cookies().delete(COOKIE_KEY)
    // cookies().set(COOKIE_KEY, "", { expires: new Date(0) });
}

export async function getSession() {
    if (!cookies().get(COOKIE_KEY)) return null

    const session = cookies().get(COOKIE_KEY).value;
    if (!session || session === undefined) return null;
    
    return await decrypt(session);
}

export async function updateSession(request) {
    const session = request.cookies.get(COOKIE_KEY)?.value;
    if (!session) {
        console.error('No session found in cookies');
        return;
    }

    try {
        const parsed = await decrypt(session);
        parsed.expires = new Date(Date.now() + secondsToExpire * 1000);
        const res = NextResponse.next();
        res.cookies.set({
            name: COOKIE_KEY,
            value: await encrypt(parsed),
            httpOnly: true,
            expires: parsed.expires,
            secure: true,
            sameSite: 'lax',
        });
        return res;
    } catch (error) {
        console.error('Error updating session:', error);
    }
}