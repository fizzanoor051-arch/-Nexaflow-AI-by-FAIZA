
import { NextResponse } from "next/server";
import { createTaskSchema } from "@/lib/validations/task";
import type { Task } from "@/types/task";
import {
  createTask as createSharedTask,
  getTasks as getSharedTasks,
} from "@/lib/workflows/store";
 const tasks: Task[] = getSharedTasks();


export async function GET() {
  return NextResponse.json({
    success: true,
    tasks,
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
