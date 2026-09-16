import { NextResponse } from "next/server";
import { createTaskSchema } from "@/lib/validations/task";
import type { Task } from "@/types/task";
import {
  createTask as createSharedTask,
  getTasks as getSharedTasks,
  updateTask as updateSharedTask,
  deleteTask as deleteSharedTask,
} from "@/lib/workflows/store";

function getActionData(body: unknown) {
  if (
    body &&
    typeof body === "object" &&
    "actionData" in body &&
    body.actionData &&
    typeof body.actionData === "object"
  ) {
    return body.actionData;
  }

  return body;
}

function isAIAction(body: unknown) {
  return (
    body &&
    typeof body === "object" &&
    "source" in body &&
    body.source === "ai"
  );
}

export async function GET() {
  return NextResponse.json({
    success: true,
    tasks: getSharedTasks(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    /*
     * AI actions can send:
     *
     * {
     *   source: "ai",
     *   action: "create_task",
     *   actionData: {
     *     ...
     *   }
     * }
     *
     * Normal Tasks page requests can continue sending
     * the existing flat task object.
     */
    const taskData = getActionData(body);

    const validation =
      createTaskSchema.safeParse(taskData);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid task data.",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const task: Task = {
      id: `task-${Date.now()}`,
      ...validation.data,
      description:
        validation.data.description ?? "",
      status:
        validation.data.status ?? "pending",
      priority:
        validation.data.priority ?? "medium",
      createdAt: now,
      updatedAt: now,
    };

    createSharedTask(task);

    console.log("NexaFlow task created:", {
      id: task.id,
      title: task.title,
      source: isAIAction(body)
        ? "ai"
        : "manual",
      action:
        body &&
        typeof body === "object" &&
        "action" in body
          ? body.action
          : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        task,
        source: isAIAction(body)
          ? "ai"
          : "manual",
        action:
          body &&
          typeof body === "object" &&
          "action" in body
            ? body.action
            : "create_task",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create task error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create task.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const actionData = getActionData(body);

    const id =
      body &&
      typeof body === "object" &&
      "id" in body &&
      typeof body.id === "string"
        ? body.id.trim()
        : actionData &&
          typeof actionData === "object" &&
          "id" in actionData &&
          typeof actionData.id === "string"
        ? actionData.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Task ID is required.",
        },
        { status: 400 }
      );
    }

    const existingTask =
      getSharedTasks().find(
        (task) => task.id === id
      );

    if (!existingTask) {
      return NextResponse.json(
        {
          success: false,
          error: "Task not found.",
        },
        { status: 404 }
      );
    }

    const validation =
      createTaskSchema.safeParse({
        ...existingTask,
        ...(actionData &&
        typeof actionData === "object"
          ? actionData
          : {}),
      });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid task data.",
          details:
            validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updatedTask =
      updateSharedTask(id, {
        ...validation.data,
        description:
          validation.data.description ??
          existingTask.description ??
          "",
        status:
          validation.data.status ??
          existingTask.status,
        priority:
          validation.data.priority ??
          existingTask.priority,
      });

    if (!updatedTask) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to update task.",
        },
        { status: 404 }
      );
    }

    console.log(
      "NexaFlow task updated:",
      {
        id: updatedTask.id,
        title: updatedTask.title,
        source: isAIAction(body)
          ? "ai"
          : "manual",
        action:
          body &&
          typeof body === "object" &&
          "action" in body
            ? body.action
            : undefined,
      }
    );

    return NextResponse.json({
      success: true,
      task: updatedTask,
      source: isAIAction(body)
        ? "ai"
        : "manual",
      action:
        body &&
        typeof body === "object" &&
        "action" in body
          ? body.action
          : "update_task",
    });
  } catch (error) {
    console.error(
      "Update task error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to update task.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    const id =
      typeof body?.id === "string"
        ? body.id.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Task ID is required.",
        },
        { status: 400 }
      );
    }

    const deleted =
      deleteSharedTask(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Task not found.",
        },
        { status: 404 }
      );
    }

    console.log(
      "NexaFlow task deleted:",
      {
        id,
        source:
          body?.source === "ai"
            ? "ai"
            : "manual",
        action:
          body?.action ??
          "delete_task",
      }
    );

    return NextResponse.json({
      success: true,
      message:
        "Task deleted successfully.",
      taskId: id,
      source:
        body?.source === "ai"
          ? "ai"
          : "manual",
      action:
        body?.action ??
        "delete_task",
    });
  } catch (error) {
    console.error(
      "Delete task error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to delete task.",
      },
      { status: 500 }
    );
  }
}