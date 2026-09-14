import { NextResponse } from "next/server";
import { createWorkflowSchema } from "@/lib/validations/workflow";
import {
  workflowStore,
  createWorkflow,
} from "@/lib/workflows/store";
import type { Workflow } from "@/types/workflow";

export async function GET() {
  return NextResponse.json({
    success: true,
    workflows: workflowStore.workflows,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = createWorkflowSchema.safeParse(body);

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

    const now = new Date().toISOString();

    const workflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name: validation.data.name,
      description: validation.data.description,
      status: "draft",
      runs: 0,
      successRate: 0,
      steps: validation.data.steps,
      createdAt: now,
      updatedAt: now,
    };

    createWorkflow(workflow);

    return NextResponse.json(
      {
        success: true,
        workflow,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to create workflow.",
      },
      { status: 500 }
    );
  }
}