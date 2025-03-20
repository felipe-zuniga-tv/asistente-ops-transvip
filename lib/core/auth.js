'use server'

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { config } from "./config/general";

const secretKey = config.COOKIES.TOKEN_JWT_SECRET;
const key = new TextEncoder().encode(secretKey);
const COOKIE_KEY = config.COOKIES.COOKIE_KEY;
const secondsToExpire = 60 * 10; // 10 minutes

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

export async function createSession(email, accessToken, userLoginResponse) {
    const expires = new Date(Date.now() + secondsToExpire * 1000);
    // const user = {
    //     accessToken: accessToken,
    //     email: email,
    //     full_name: userLoginResponse.fullName,
    //     other: {
    //         ...userLoginResponse
    //     }
    // }
    const user = {
        accessToken,
        ...userLoginResponse
    }
    return {
        user: user,
        session: await encryptSession({ user, expires })
    }
}

export async function setCookie(session) {
    const expires = new Date(Date.now() + secondsToExpire * 1000);
    cookies().set(COOKIE_KEY, session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
}

export async function logout() {
    cookies().delete(COOKIE_KEY);
}

export async function getSession() {
    const session = cookies().get(COOKIE_KEY)?.value;
    if (!session) return null;
    return await decryptSession(session);
}

export async function isSessionExpired(request) {
    const session = request.cookies.get(COOKIE_KEY)?.value;
    try {
        const parsed = await decryptSession(session);
        return new Date(parsed.expires) < new Date();
    } catch {
        return true;
    }
}

export async function updateSession(request) {
    const session = request.cookies.get(COOKIE_KEY)?.value;

    if (!session) return null;

    // Check if session is expired
    if (await isSessionExpired(request)) {
        const res = NextResponse.next();
        res.cookies.delete(COOKIE_KEY);
        return res;
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
        return null;
    }
}