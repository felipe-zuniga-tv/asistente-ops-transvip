import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  try {
    const response = await updateSession(request);
    return response;
  } catch (error) {
    console.error('Middleware session update error:', error);
    return NextResponse.next(); // Proceed without updating session if there's an error
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}