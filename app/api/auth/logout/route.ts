import { NextResponse } from "next/server";
import { createExpiredSessionCookie } from "@/lib/auth/session";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });

    const expiredCookie = createExpiredSessionCookie();

    response.cookies.set(
      expiredCookie.name,
      expiredCookie.value,
      expiredCookie.options
    );

    return response;
  } catch (error) {
    console.error("Logout API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to log out.",
      },
      { status: 500 }
    );
  }
}