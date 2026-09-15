import { NextResponse } from "next/server";
import { runWorkflow } from "@/lib/workflows/store";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const result = runWorkflow(id);

    if (!result) {
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
      workflow: result.workflow,
      run: result.run,
    });
  } catch (error) {
    console.error("Workflow execution error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to execute workflow.",
      },
      { status: 500 }
    );
  }
}