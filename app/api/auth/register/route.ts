import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import {
  createUser,
  getUserByEmail,
  sanitizeUser,
} from "@/lib/auth/users";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Please check your registration details.",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    const user = await createUser({
      name,
      email,
      password,
    });

    const session = await createSession({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: sanitizeUser(user),
      },
      { status: 201 }
    );

    response.cookies.set(
      session.name,
      session.value,
      session.options
    );

    return response;
  } catch (error) {
    console.error("Register API error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create account.";

    if (
      message.includes("already exists")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create account.",
      },
      { status: 500 }
    );
  }
}