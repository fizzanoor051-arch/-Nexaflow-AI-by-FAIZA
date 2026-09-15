import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/auth/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email address is required.",
        },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);

    console.info(
      user
        ? `Password reset requested for ${email}`
        : `Password reset requested for unknown email`
    );

    return NextResponse.json({
      success: true,
      message:
        "If an account exists for this email, password reset instructions are ready.",
    });
  } catch (error) {
    console.error("Forgot password API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to process your request.",
      },
      { status: 500 }
    );
  }
}