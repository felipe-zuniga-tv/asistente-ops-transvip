import { NextRequest, NextResponse } from "next/server";
import { login, logout, getSession, encrypt } from "@/lib/auth"; // Adjust the import path as necessary
import { cookies } from "next/headers";
import { config } from "@/lib/config/general";

const validActions = ["login", "logout", "getSession"]; // List of valid actions

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const action = formData.get("action") as string;

    if (!validActions.includes(action)) {
        return NextResponse.json({ status: 400, message: "Invalid action" });
    }

    if (action === "login") {
        const result = await login(formData);
        const { status, data } = result;

        if (status === 200) {
            const expires = new Date(Date.now() + 60 * 10 * 1000); // 10 minutes
            const session = await encrypt({ user: data.user, expires }); // Ensure encrypt function is available
            const cookieKey = config.COOKIES.COOKIE_KEY;

            // Ensure cookieKey is defined
            if (!cookieKey) {
                throw new Error("COOKIE_KEY is not defined");
            }
            // Set the cookie
            cookies().set(cookieKey, session, { expires, httpOnly: true, secure: true, sameSite: 'strict' });
        }

        return NextResponse.json({ status, data });
    } else if (action === "logout") {
        await logout();
        return NextResponse.json({ status: 200, message: "Logged out successfully" });
    } else if (action === "getSession") {
        const session = await getSession();
        return NextResponse.json({ status: 200, session });
    }
}
