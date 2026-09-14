import { NextResponse } from "next/server";
import {
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
} from "@/lib/workflows/store";
import { updateWorkflowSchema } from "@/lib/validations/workflow";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const { id } = await context.params;

  const workflow = getWorkflowById(id);

  if (!workflow) {
    return NextResponse.json(
      {
        success: false,
        error: "Workflow not found.",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    workflow,
  });
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  const { id } = await context.params;

  try {
    const existingWorkflow = getWorkflowById(id);

    if (!existingWorkflow) {
      return NextResponse.json(
        {
          success: false,
          error: "Workflow not found.",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    const validation = updateWorkflowSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid workflow data.",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const workflow = updateWorkflow(id, validation.data);

    if (!workflow) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to update workflow.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      workflow,
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

  const existingWorkflow = getWorkflowById(id);

  if (!existingWorkflow) {
    return NextResponse.json(
      {
        success: false,
        error: "Workflow not found.",
      },
      { status: 404 }
    );
  }

  const deleted = deleteWorkflow(id);

  if (!deleted) {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to delete workflow.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Workflow deleted successfully.",
  });
}