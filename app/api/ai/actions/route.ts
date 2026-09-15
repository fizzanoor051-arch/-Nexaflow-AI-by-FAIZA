
import { NextResponse } from "next/server";
import { createTask } from "@/lib/workflows/store";
import type { Task } from "@/types/task";

export const runtime = "nodejs";

type ActionRequest = {
  action?: string;
  customerMessage?: string;
  intent?: string;
  priority?: "Low" | "Medium" | "High";
};

function createSupportTask(
  customerMessage: string,
  priority: "Low" | "Medium" | "High"
): Task {
  const now = new Date().toISOString();

  const task: Task = {
    id: `task-${Date.now()}`,
    title: "Review refund request",
    description:
      `Customer support follow-up required for a refund request.\n\nCustomer message: ${customerMessage}`,
    status: "pending",
    priority: priority.toLowerCase() as Task["priority"],
    createdAt: now,
    updatedAt: now,
  };

  createTask(task);

  return task;
}

export async function POST(request: Request) {
  try {
    const body: ActionRequest = await request.json();

    const action = body.action?.trim().toLowerCase();
    const customerMessage =
      body.customerMessage?.trim() || "";

    const priority = body.priority || "High";

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          error: "Action is required.",
        },
        { status: 400 }
      );
    }

    if (action === "refund" || action === "create_support_task") {
      const task = createSupportTask(
        customerMessage,
        priority
      );

      return NextResponse.json({
        success: true,
        status: "completed",
        action: {
          type: "refund_support",
          label: "Offer refund + create support task",
        },
        task,
        message:
          "Refund request analyzed successfully and a support follow-up task was created.",
      });
    }

    if (action === "support") {
      const now = new Date().toISOString();

      const task: Task = {
        id: `task-${Date.now()}`,
        title: "Customer support follow-up",
        description:
          `Follow up with the customer regarding their support request.\n\nCustomer message: ${customerMessage}`,
        status: "pending",
        priority: priority.toLowerCase() as Task["priority"],
        createdAt: now,
        updatedAt: now,
      };

      createTask(task);

      return NextResponse.json({
        success: true,
        status: "completed",
        action: {
          type: "customer_support",
          label: "Respond + create support task",
        },
        task,
        message:
          "Customer support action completed and a follow-up task was created.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: `Unsupported AI action: ${action}`,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("AI action execution error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to execute the AI action right now.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: "NexaFlow AI Actions",
    status: "ready",
    actions: [
      "refund",
      "create_support_task",
      "support",
    ],
  });
}
