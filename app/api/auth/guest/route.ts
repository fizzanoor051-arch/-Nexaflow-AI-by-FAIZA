import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Guest workspace opened successfully.",
      user: {
        id: "guest-user",
        name: "Guest User",
        email: "guest@nexaflow.local",
        role: "guest",
      },
    });

    const session = await createSession({
      userId: "guest-user",
      name: "Guest User",
      email: "guest@nexaflow.local",
      role: "guest",
    });

    response.cookies.set(session.name, session.value, session.options);

    return response;
  } catch (error) {
    console.error("Guest authentication error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to open guest workspace.",
      },
      { status: 500 }
    );
  }
}