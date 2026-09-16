import { NextResponse } from "next/server";
import {
  createTask,
  getTasks,
  updateTask,
} from "@/lib/workflows/store";
import type { Task } from "@/types/task";

export const runtime = "nodejs";

type ActionRequest = {
  action?: string;
  customerMessage?: string;
  message?: string;
  intent?: string;
  priority?: "Low" | "Medium" | "High";
  task?: Partial<Task>;
  actionData?: Record<string, unknown>;
};

type ActionResponse = {
  success: boolean;
  status?: string;
  action?: {
    type: string;
    label: string;
  };
  task?: Task;
  message?: string;
  error?: string;
};

function normalizeText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizePriority(
  value: unknown
): Task["priority"] {
  const priority =
    normalizeText(value).toLowerCase();

  if (priority === "high") {
    return "high" as Task["priority"];
  }

  if (priority === "low") {
    return "low" as Task["priority"];
  }

  return "medium" as Task["priority"];
}

function getTomorrowDate(): string {
  const date = new Date();

  date.setDate(date.getDate() + 1);

  return date.toISOString().split("T")[0];
}

function getTodayDate(): string {
  return new Date()
    .toISOString()
    .split("T")[0];
}

function extractAssignee(message: string): string {
  const patterns = [
    /for\s+([A-Za-z][A-Za-z\s'-]{1,40}?)(?:\s+tomorrow|\s+today|\s+on\s+|\s+at\s+|$)/i,
    /with\s+([A-Za-z][A-Za-z\s'-]{1,40}?)(?:\s+tomorrow|\s+today|\s+on\s+|\s+at\s+|$)/i,
    /to\s+([A-Za-z][A-Za-z\s'-]{1,40}?)(?:\s+tomorrow|\s+today|\s+on\s+|\s+at\s+|$)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return "";
}

function extractDueDate(
  message: string
): string {
  const lower = message.toLowerCase();

  if (lower.includes("tomorrow")) {
    return getTomorrowDate();
  }

  if (
    lower.includes("today") ||
    lower.includes("tonight")
  ) {
    return getTodayDate();
  }

  const explicitDate =
    message.match(
      /\b(\d{4}-\d{2}-\d{2})\b/
    );

  if (explicitDate?.[1]) {
    return explicitDate[1];
  }

  return "";
}

function extractDueTime(
  message: string
): string {
  const twelveHour =
    message.match(
      /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i
    );

  if (twelveHour) {
    let hour = Number(twelveHour[1]);

    const minute =
      Number(twelveHour[2] || "00");

    const period =
      twelveHour[3].toLowerCase();

    if (period === "pm" && hour !== 12) {
      hour += 12;
    }

    if (period === "am" && hour === 12) {
      hour = 0;
    }

    return `${String(hour).padStart(
      2,
      "0"
    )}:${String(minute).padStart(2, "0")}`;
  }

  const twentyFourHour =
    message.match(
      /\b([01]?\d|2[0-3]):([0-5]\d)\b/
    );

  if (twentyFourHour) {
    return `${String(
      Number(twentyFourHour[1])
    ).padStart(2, "0")}:${twentyFourHour[2]}`;
  }

  return "";
}

function extractTaskTitle(
  message: string,
  assignee: string
): string {
  const lower = message.toLowerCase();

  if (
    lower.includes("follow-up") ||
    lower.includes("follow up")
  ) {
    return assignee
      ? `Follow-up with ${assignee}`
      : "Follow-up task";
  }

  if (lower.includes("call")) {
    return assignee
      ? `Call ${assignee}`
      : "Customer call";
  }

  if (lower.includes("email")) {
    return assignee
      ? `Email ${assignee}`
      : "Send email";
  }

  if (lower.includes("meeting")) {
    return assignee
      ? `Meeting with ${assignee}`
      : "Schedule meeting";
  }

  if (lower.includes("review")) {
    return assignee
      ? `Review with ${assignee}`
      : "Review task";
  }

  return assignee
    ? `Task for ${assignee}`
    : "AI-created task";
}

function buildTaskFromMessage(
  message: string,
  actionData?: Record<string, unknown>,
  priority?: unknown
): Task {
  const now =
    new Date().toISOString();

  const data =
    actionData || {};

  const assigneeFromData =
    normalizeText(data.assignee);

  const assignee =
    assigneeFromData ||
    extractAssignee(message);

  const dueDateFromData =
    normalizeText(data.dueDate);

  const dueDate =
    dueDateFromData ||
    extractDueDate(message);

  const dueTimeFromData =
    normalizeText(data.dueTime);

  const dueTime =
    dueTimeFromData ||
    extractDueTime(message);

  const titleFromData =
    normalizeText(data.title);

  const title =
    titleFromData ||
    extractTaskTitle(
      message,
      assignee
    );

  const descriptionFromData =
    normalizeText(data.description);

  const description =
    descriptionFromData ||
    `Created by NexaFlow AI from command: "${message}"`;

  const task: Task = {
    id: `task-${Date.now()}`,
    title,
    description,
    status: "pending",
    priority: normalizePriority(
      data.priority || priority
    ),
    createdAt: now,
    updatedAt: now,

    ...(assignee
      ? {
          assignee,
        }
      : {}),

    ...(dueDate
      ? {
          dueDate,
        }
      : {}),

    ...(dueTime
      ? {
          dueTime,
        }
      : {}),
  } as Task;

  return task;
}

function detectAction(
  body: ActionRequest
): string {
  const explicitAction =
    normalizeText(body.action)
      .toLowerCase();

  if (explicitAction) {
    return explicitAction;
  }

  const intent =
    normalizeText(body.intent)
      .toLowerCase();

  if (intent) {
    return intent;
  }

  const message =
    normalizeText(
      body.message ||
        body.customerMessage
    ).toLowerCase();

  if (
    message.includes("create") &&
    message.includes("task")
  ) {
    return "create_task";
  }

  if (
    message.includes("add") &&
    message.includes("task")
  ) {
    return "create_task";
  }

  if (
    message.includes("make") &&
    message.includes("task")
  ) {
    return "create_task";
  }

  if (
    message.includes("update") &&
    message.includes("task")
  ) {
    return "update_task";
  }

  if (
    message.includes("complete") &&
    message.includes("task")
  ) {
    return "update_task";
  }

  if (
    message.includes("refund")
  ) {
    return "refund";
  }

  if (
    message.includes("support")
  ) {
    return "support";
  }

  return "";
}

function findTaskForUpdate(
  actionData: Record<string, unknown>
): Task | undefined {
  const tasks = getTasks();

  const id =
    normalizeText(actionData.id);

  if (id) {
    return tasks.find(
      (task) => task.id === id
    );
  }

  const title =
    normalizeText(actionData.title)
      .toLowerCase();

  if (title) {
    return tasks.find(
      (task) =>
        task.title.toLowerCase() ===
        title
    );
  }

  return undefined;
}

function createSupportTask(
  customerMessage: string,
  priority: "Low" | "Medium" | "High"
): Task {
  const now =
    new Date().toISOString();

  const task: Task = {
    id: `task-${Date.now()}`,
    title: "Review refund request",
    description:
      `Customer support follow-up required for a refund request.\n\nCustomer message: ${customerMessage}`,
    status: "pending",
    priority:
      priority.toLowerCase() as Task["priority"],
    createdAt: now,
    updatedAt: now,
  };

  createTask(task);

  return task;
}

export async function POST(
  request: Request
) {
  try {
    const body: ActionRequest =
      await request.json();

    const message =
      normalizeText(
        body.message ||
          body.customerMessage
      );

    const action =
      detectAction(body);

    const actionData =
      body.actionData &&
      typeof body.actionData ===
        "object"
        ? body.actionData
        : {};

    const priority =
      body.priority || "High";

    if (!action && !message) {
      return NextResponse.json<ActionResponse>(
        {
          success: false,
          error:
            "Action or message is required.",
        },
        { status: 400 }
      );
    }

    /*
     * =========================================================
     * CREATE TASK
     * =========================================================
     */

    if (
      action === "create_task" ||
      action === "create-task" ||
      action === "task" ||
      action === "create"
    ) {
      const task =
        buildTaskFromMessage(
          message,
          actionData,
          body.priority
        );

      createTask(task);

      console.log(
        "NexaFlow AI created task:",
        task
      );

      return NextResponse.json<ActionResponse>({
        success: true,
        status: "completed",
        action: {
          type: "create_task",
          label:
            "Create task",
        },
        task,
    message:
  `Task "${task.title}" was created successfully${
    task.assigneeId
      ? ` for ${task.assigneeId}`
      : ""
  }${
            task.dueDate
              ? ` for ${task.dueDate}`
              : ""
          }`,
      });
    }

    /*
     * =========================================================
     * UPDATE TASK
     * =========================================================
     */

    if (
      action === "update_task" ||
      action === "update-task" ||
      action === "complete_task" ||
      action === "complete-task"
    ) {
      const existingTask =
        findTaskForUpdate(
          actionData
        );

      if (!existingTask) {
        return NextResponse.json<ActionResponse>(
          {
            success: false,
            error:
              "I couldn't find the task to update. Please provide the task ID or exact task title.",
          },
          { status: 404 }
        );
      }

      const completed =
        action ===
          "complete_task" ||
        action ===
          "complete-task";

      const updateData: Partial<Task> = {
        updatedAt:
          new Date().toISOString(),
      };

      if (completed) {
        updateData.status =
          "completed";
      }

      if (
        normalizeText(
          actionData.title
        )
      ) {
        updateData.title =
          normalizeText(
            actionData.title
          );
      }

      if (
        normalizeText(
          actionData.description
        )
      ) {
        updateData.description =
          normalizeText(
            actionData.description
          );
      }

      if (
        normalizeText(
          actionData.priority
        )
      ) {
        updateData.priority =
          normalizePriority(
            actionData.priority
          );
      }

  if (
  normalizeText(
    actionData.assigneeId
  )
) {
  updateData.assigneeId =
    normalizeText(
      actionData.assigneeId
    );
}

      if (
        normalizeText(
          actionData.dueDate
        )
      ) {
        updateData.dueDate =
          normalizeText(
            actionData.dueDate
          );
      }

   

      const updatedTask =
        updateTask(
          existingTask.id,
          updateData
        );

      if (!updatedTask) {
        return NextResponse.json<ActionResponse>(
          {
            success: false,
            error:
              "Unable to update the task.",
          },
          { status: 500 }
        );
      }

      console.log(
        "NexaFlow AI updated task:",
        updatedTask
      );

      return NextResponse.json<ActionResponse>({
        success: true,
        status: "completed",
        action: {
          type: "update_task",
          label:
            completed
              ? "Complete task"
              : "Update task",
        },
        task: updatedTask,
        message:
          completed
            ? `Task "${updatedTask.title}" was marked as completed.`
            : `Task "${updatedTask.title}" was updated successfully.`,
      });
    }

    /*
     * =========================================================
     * REFUND SUPPORT
     * =========================================================
     */

    if (
      action === "refund" ||
      action ===
        "create_support_task"
    ) {
      const task =
        createSupportTask(
          message,
          priority
        );

      return NextResponse.json<ActionResponse>({
        success: true,
        status: "completed",
        action: {
          type:
            "refund_support",
          label:
            "Offer refund + create support task",
        },
        task,
        message:
          "Refund request analyzed successfully and a support follow-up task was created.",
      });
    }

    /*
     * =========================================================
     * CUSTOMER SUPPORT
     * =========================================================
     */

    if (
      action === "support" ||
      action ===
        "customer_support"
    ) {
      const now =
        new Date().toISOString();

      const task: Task = {
        id: `task-${Date.now()}`,
        title:
          "Customer support follow-up",
        description:
          `Follow up with the customer regarding their support request.\n\nCustomer message: ${message}`,
        status: "pending",
        priority:
          priority.toLowerCase() as Task["priority"],
        createdAt: now,
        updatedAt: now,
      };

      createTask(task);

      return NextResponse.json<ActionResponse>({
        success: true,
        status: "completed",
        action: {
          type:
            "customer_support",
          label:
            "Respond + create support task",
        },
        task,
        message:
          "Customer support action completed and a follow-up task was created.",
      });
    }

    /*
     * =========================================================
     * UNSUPPORTED ACTION
     * =========================================================
     */

    return NextResponse.json<ActionResponse>(
      {
        success: false,
        error:
          `Unsupported AI action: ${action || "unknown"}`,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error(
      "AI action execution error:",
      error
    );

    return NextResponse.json<ActionResponse>(
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
    service:
      "NexaFlow AI Actions",
    status: "ready",
    actions: [
      "create_task",
      "update_task",
      "complete_task",
      "refund",
      "create_support_task",
      "support",
    ],
  });
}