'use server'

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { config } from "./config/general";

const secretKey = config.COOKIES.TOKEN_JWT_SECRET;
const key = new TextEncoder().encode(secretKey);
const COOKIE_KEY = config.COOKIES.COOKIE_KEY;
const secondsToExpire = 60 * 10;

// Add error handling for missing env variables
if (!secretKey) throw new Error('TOKEN_JWT_SECRET is not defined');
if (!COOKIE_KEY) throw new Error('COOKIE_KEY is not defined');

export async function encryptSession(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(Date.now() + secondsToExpire * 1000)
        .sign(key);
}

export async function decryptSession(input) {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function login(email, password) {
    const LOGIN_URL = getLoginUrl();
    if (!isApiConfigured()) {
        return { status: 500, data: null, error: 'API configuration missing' };
    }

    if (!isValidCredentials(email, password)) {
        return { status: 400, data: null, error: 'Missing credentials' };
    }

    try {
        const loginResponse = await fetchLoginData(LOGIN_URL, email, password);
        if (!loginResponse) return { status: 400, error: 'Authentication failed' };
        if (!loginResponse.status !== 200) return { status: 201, error: 'Log in not possible' };

        const userResponse = await fetchUserData(loginResponse.data.id);
        if (!userResponse) return { status: 400, error: 'Failed to fetch user details' };

        const session = await createSession(email, loginResponse.data.access_token, userResponse.fullName);
        setCookie(session);

        return { status: 200, data: userResponse.data };
    } catch (error) {
        console.error('Login error:', error);
        return { status: 500, data: null, error: 'Internal server error' };
    }
}

async function fetchLoginData(url, email, password) {
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: getApiHeaders(),
    });
    if (!response.ok) throw new Error('Login failed');
    return await response.json();
}

async function fetchUserData(adminId) {
    const ADMIN_ID_URL = getAdminIdUrl();
    const response = await fetch(`${ADMIN_ID_URL}?admin_id=${adminId}&limit=0&offset=0`, {
        method: "GET",
        headers: getApiHeaders(),
    });
    if (!response.ok) throw new Error('User data fetch failed');
    return await response.json();
}

async function createSession(email, accessToken, fullName) {
    const expires = new Date(Date.now() + secondsToExpire * 1000);
    const user = { email, accessToken, full_name: fullName };
    return await encryptSession({ user, expires });
}

function setCookie(session) {
    const expires = new Date(Date.now() + secondsToExpire * 1000);
    cookies().set(COOKIE_KEY, session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
}

function getLoginUrl() {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/${process.env.NEXT_PUBLIC_API_ADMIN_LOGIN_ROUTE}`;
}

function getAdminIdUrl() {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/${process.env.NEXT_PUBLIC_API_ADMIN_IDENTITY}`;
}

function isApiConfigured() {
    return process.env.NEXT_PUBLIC_API_BASE_URL && process.env.NEXT_PUBLIC_API_ADMIN_LOGIN_ROUTE;
}

function isValidCredentials(email, password) {
    return email && password;
}

function getApiHeaders() {
    return {
        "Accept": "application/json",
        "Content-Language": "es",
        "Content-Type": "application/json;charset=UTF-8",
    };
}

export async function logout() {
    cookies().delete(COOKIE_KEY);
}

export async function getSession() {
    const session = cookies().get(COOKIE_KEY)?.value;
    if (!session) return null;
    return await decryptSession(session);
}

export async function updateSession(request) {
    const session = request.cookies.get(COOKIE_KEY)?.value;
    if (!session) {
        console.error('No session found in cookies');
        return;
    }

    try {
        const parsed = await decryptSession(session);
        parsed.expires = new Date(Date.now() + secondsToExpire * 1000);
        const res = NextResponse.next();
        
        res.cookies.set({
            name: COOKIE_KEY,
            value: await encryptSession(parsed),
            httpOnly: true,
            expires: parsed.expires,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });
        return res;
    } catch (error) {
        console.error('Error updating session:', error);
    }
}