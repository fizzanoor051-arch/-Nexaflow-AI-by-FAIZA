import { NextResponse } from "next/server";
import {
  createWorkflowSchema,
} from "@/lib/validations/workflow";

interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: "draft" | "active" | "paused" | "archived";
  runs: number;
  successRate: number;
  steps: unknown[];
  createdAt: string;
  updatedAt: string;
}

const workflows: Workflow[] = [
  {
    id: "workflow-1",
    name: "Customer Support Automation",
    description:
      "Automatically analyze and respond to customer inquiries.",
    status: "active",
    runs: 248,
    successRate: 96,
    steps: [
      {
        id: "step-1",
        title: "Receive inquiry",
        description: "Capture customer message.",
        type: "trigger",
      },
      {
        id: "step-2",
        title: "Analyze intent",
        description: "AI classifies the request.",
        type: "ai",
      },
      {
        id: "step-3",
        title: "Generate response",
        description: "AI creates the response.",
        type: "ai",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    workflows,
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

    workflows.unshift(workflow);

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