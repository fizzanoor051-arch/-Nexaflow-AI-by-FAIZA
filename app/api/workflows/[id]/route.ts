import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { id } = await context.params;

  return NextResponse.json({
    success: true,
    workflow: {
      id,
      name: "Customer Support Automation",
      description:
        "Automatically analyze and respond to customer inquiries.",
      status: "active",
      runs: 248,
      successRate: 96,
      steps: [],
    },
  });
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params;

  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      workflow: {
        id,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update workflow.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  const { id } = await context.params;

  return NextResponse.json({
    success: true,
    message: `Workflow ${id} deleted successfully.`,
  });
}