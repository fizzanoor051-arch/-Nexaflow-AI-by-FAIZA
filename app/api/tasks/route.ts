
import { NextResponse } from "next/server";
import { createTaskSchema } from "@/lib/validations/task";
import type { Task } from "@/types/task";
import {
  createTask as createSharedTask,
  getTasks as getSharedTasks,
  updateTask as updateSharedTask,
  deleteTask as deleteSharedTask,
} from "@/lib/workflows/store";

export async function GET() {
  return NextResponse.json({
    success: true,
    tasks: getSharedTasks(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = createTaskSchema.safeParse(body);

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
      description: validation.data.description ?? "",
      status: validation.data.status ?? "pending",
      priority: validation.data.priority ?? "medium",
      createdAt: now,
      updatedAt: now,
    };

    createSharedTask(task);

    return NextResponse.json(
      {
        success: true,
        task,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create task error:", error);

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

    const existingTask = getSharedTasks().find(
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

    const validation = createTaskSchema.safeParse({
      ...existingTask,
      ...body,
    });

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

    const updatedTask = updateSharedTask(id, {
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

    return NextResponse.json({
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error);

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

    const deleted = deleteSharedTask(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Task not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully.",
      taskId: id,
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to delete task.",
      },
      { status: 500 }
    );
  }
}

