import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid registration data.",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email } = validation.data;

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: {
          id: `user-${Date.now()}`,
          name,
          email,
          role: "user",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create account.",
      },
      { status: 500 }
    );
  }
}