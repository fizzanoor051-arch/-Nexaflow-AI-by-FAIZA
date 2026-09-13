import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password.",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: "demo-user-1",
        name: "Faiza Noor",
        email,
        role: "user",
      },
    });
  } catch (error) {
    console.error("Login API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to process login.",
      },
      { status: 500 }
    );
  }
}