
import { createTask } from "@/lib/workflows/store";

type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type AICommandResult = {
  handled: boolean;
  type?: "create_task";
  message?: string;
  task?: unknown;
};

function extractPriority(text: string): TaskPriority {
  const value = text.toLowerCase();

  if (
    value.includes("urgent") ||
    value.includes("asap") ||
    value.includes("immediately")
  ) {
    return "URGENT";
  }

  if (
    value.includes("high priority") ||
    value.includes("high-priority")
  ) {
    return "HIGH";
  }

  if (
    value.includes("low priority") ||
    value.includes("low-priority")
  ) {
    return "LOW";
  }

  return "MEDIUM";
}

function extractTaskTitle(text: string): string {
  /*
   * IMPORTANT:
   * Any follow-up task must always use "Follow-up"
   * as its actual task title.
   */
  if (/\bfollow[- ]?up\b/i.test(text)) {
    return "Follow-up";
  }

  const match = text.match(
    /(?:create|make|add|set up)\s+(?:a\s+)?task\s+(?:to\s+)?(.+?)(?:\s+(?:tomorrow|today|on|at)\b|$)/i
  );

  if (match?.[1]) {
    return match[1]
      .trim()
      .replace(/[.!?]+$/, "");
  }

  return (
    text
      .replace(
        /^(please\s+)?(?:create|make|add|set up)\s+(?:a\s+)?task\s*/i,
        ""
      )
      .trim()
      .replace(/[.!?]+$/, "") || "New Task"
  );
}

function extractAssignee(text: string): string | undefined {
  const match = text.match(
    /\bfor\s+([A-Za-z][A-Za-z'-]*(?:\s+[A-Za-z][A-Za-z'-]*){0,2}?)(?=\s+(?:tomorrow|today|on|at|with|due|by)\b|[,.!?]|$)/i
  );

  return match?.[1]?.trim() || undefined;
}

function extractDueDate(text: string): string | undefined {
  const now = new Date();

  if (/\btomorrow\b/i.test(text)) {
    now.setDate(now.getDate() + 1);
    return now.toISOString().split("T")[0];
  }

  if (/\btoday\b/i.test(text)) {
    return now.toISOString().split("T")[0];
  }

  return undefined;
}

function extractDueTime(text: string): string | undefined {
  const match = text.match(
    /\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i
  );

  if (!match) {
    return undefined;
  }

  let hour = Number(match[1]);
  const minute = match[2] ? Number(match[2]) : 0;
  const period = match[3]?.toLowerCase();

  if (period === "pm" && hour < 12) {
    hour += 12;
  }

  if (period === "am" && hour === 12) {
    hour = 0;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
    2,
    "0"
  )}`;
}

export async function executeAICommand(
  message: string
): Promise<AICommandResult> {
  const text = message.trim();

  const isFollowUp = /\bfollow[- ]?up\b/i.test(text);

  const isCreateTask =
    /\b(create|make|add|set up)\b.*\btask\b/i.test(text) ||
    /\bfollow[- ]?up task\b/i.test(text);

  if (!isCreateTask) {
    return {
      handled: false,
    };
  }

  /*
   * For follow-up commands, the title is ALWAYS "Follow-up".
   * This prevents words such as "tomorrow" from becoming the title.
   */
  const title = isFollowUp
    ? "Follow-up"
    : extractTaskTitle(text);

  const assignee = extractAssignee(text);
  const dueDate = extractDueDate(text);
  const dueTime = extractDueTime(text);
  const priority = extractPriority(text);

  const descriptionParts = [
    assignee ? `Assigned to ${assignee}.` : "",
    dueDate ? `Due ${dueDate}.` : "",
    dueTime ? `Time ${dueTime}.` : "",
  ].filter(Boolean);

  const taskPriority =
    priority === "URGENT"
      ? "high"
      : (priority.toLowerCase() as "low" | "medium" | "high");

  const now = new Date().toISOString();

  const task = createTask({
    id: `task-ai-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    /*
     * FINAL GUARANTEE:
     * Follow-up requests are stored with this exact title.
     */
    title,

    description: descriptionParts.join(" "),
    priority: taskPriority,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });

  return {
    handled: true,
    type: "create_task",

    message: `Task created successfully${
      assignee ? ` for ${assignee}` : ""
    }. `,

    task: {
      ...task,
      title,
      assignee,
      dueDate,
      dueTime,
    },
  };
}
