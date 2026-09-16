import { NextRequest, NextResponse } from "next/server";

import {
  actionStore,
  addActivity,
  triggerWorkflow,
} from "@/lib/ai/action-store";

export async function GET() {
  return NextResponse.json({
    success: true,
    runs: actionStore.workflowRuns,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: "Workflow ID is required.",
        },
        { status: 400 },
      );
    }

    const workflowName =
      typeof body.workflowName === "string"
        ? body.workflowName
        : "AI Automation Workflow";

    const run = triggerWorkflow(
      body.workflowId,
      workflowName,
    );

    addActivity({
      action: "trigger_workflow",
      message: `Triggered workflow "${workflowName}"`,
      status: "success",
      entityId: run.id,
      entityType: "workflow",
      details: {
        workflowId: body.workflowId,
        workflowName,
      },
    });

    return NextResponse.json({
      success: true,
      run,
      message: `Workflow "${workflowName}" triggered successfully.`,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to trigger workflow.",
      },
      { status: 500 },
    );
  }
}