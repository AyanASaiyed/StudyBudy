// middleware.ts
import { getToken } from "next-auth/jwt"; // Get JWT token from next-auth
import { NextRequest, NextResponse } from "next/server";

interface MiddlewareRequest extends NextRequest {
  url: string;
}

export async function middleware(
  req: MiddlewareRequest
): Promise<NextResponse> {
  // Get the JWT token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token (i.e., user is not logged in), redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login page
  }

  return NextResponse.next(); // Allow access if logged in
}

export const config = {
  matcher: ["/home"], // Apply this middleware only to the /home page
};
