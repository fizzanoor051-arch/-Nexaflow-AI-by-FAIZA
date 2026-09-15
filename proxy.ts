import { NextRequest, NextResponse } from "next/server";
import {
  getSessionCookieName,
  verifySessionToken,
} from "@/lib/auth/session";

const protectedRoutes = [
  "/dashboard",
  "/workflows",
  "/conversations",
  "/leads",
  "/tasks",
  "/analytics",
  "/settings",
];

const authRoutes = [
  "/login",
  "/register",
];

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );
}

function isAuthRoute(pathname: string) {
  return authRoutes.includes(pathname);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(
    getSessionCookieName()
  )?.value;

  const session = verifySessionToken(token);

  if (isProtectedRoute(pathname) && !session) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set(
      "next",
      pathname
    );

    return NextResponse.redirect(loginUrl);
  }

 

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/workflows/:path*",
    "/conversations/:path*",
    "/leads/:path*",
    "/tasks/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};