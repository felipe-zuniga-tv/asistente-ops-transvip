import { NextRequest, NextResponse } from "next/server";
import { isSessionExpired, updateSession } from "./lib/auth";
import { Routes } from "./utils/routes";

export async function middleware(request: NextRequest) {
  try {
    if (await isSessionExpired(request)) {
      return NextResponse.redirect(new URL(Routes.HOME, request.url));
    }

    return await updateSession(request);
  } catch (error) {
    console.error('Middleware session update error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}