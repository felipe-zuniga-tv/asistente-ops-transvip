import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { config } from "./config/general";
import type { Session, User } from "@/lib/types/chat";

const secretKey = config.COOKIES.TOKEN_JWT_SECRET;
const key = new TextEncoder().encode(secretKey);
const COOKIE_KEY = config.COOKIES.COOKIE_KEY;
const secondsToExpire = 60 * 10;

if (!secretKey) throw new Error('TOKEN_JWT_SECRET is not defined');
if (!COOKIE_KEY) throw new Error('COOKIE_KEY is not defined');

export async function decryptSession(input: string): Promise<Session> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    // Map the payload to our User interface.
    const user: User = {
        fullName: payload.full_name,  // adjust if needed (e.g., mapping "full_name" ➜ "fullName")
        email: payload.email,
        accessToken: payload.accessToken,
    };

    return { user };
}

export async function getSession(): Promise<Session | null> {
    const sessionCookie = cookies().get(COOKIE_KEY)?.value;
    if (!sessionCookie) return null;
    return await decryptSession(sessionCookie);
}

// ... other auth functions remain unchanged 