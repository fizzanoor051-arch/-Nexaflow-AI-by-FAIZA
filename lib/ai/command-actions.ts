
import {
  createTask,
  getLeads,
  getTasks,
  updateTask,
} from "@/lib/workflows/store";

type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type LeadPriority = "low" | "medium" | "high";

type LeadStatus =
  | "new"
  | "contacted"
  | "qualified";

export type AICommandResult = {
  handled: boolean;

  type?:
    | "create_task"
    | "read_leads"
    | "bulk_create_tasks"
    | "schedule_followups";

  message?: string;

  task?: unknown;

  tasks?: unknown[];

  leads?: unknown[];

  count?: number;

  filters?: {
    priority?: LeadPriority;
    status?: LeadStatus;
    dateRange?: "today" | "this_week";
  };
};

/* =========================================================
   HELPERS
   ========================================================= */

function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[?!.,]+$/g, "")
    .replace(/\s+/g, " ");
}

function extractPriority(
  text: string
): TaskPriority {
  const value = normalize(text);

  if (
    value.includes("urgent") ||
    value.includes("asap") ||
    value.includes("immediately")
  ) {
    return "URGENT";
  }

  if (
    value.includes("high priority") ||
    value.includes("high-priority") ||
    value.includes("high priority leads") ||
    value.includes("high-priority leads")
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

/* =========================================================
   TASK PARSING
   ========================================================= */

function extractTaskTitle(
  text: string
): string {
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
      .replace(/[.!?]+$/, "") ||
    "New Task"
  );
}

function extractAssignee(
  text: string
): string | undefined {
  const match = text.match(
    /\bfor\s+([A-Za-z][A-Za-z'-]*(?:\s+[A-Za-z][A-Za-z'-]*){0,2}?)(?=\s+(?:tomorrow|today|on|at|with|due|by)\b|[,.!?]|$)/i
  );

  return match?.[1]?.trim() || undefined;
}

function extractDueDate(
  text: string
): string | undefined {
  const now = new Date();

  if (
    /\btomorrow\b/i.test(text) ||
    /\bkal\b/i.test(text)
  ) {
    now.setDate(
      now.getDate() + 1
    );

    return now
      .toISOString()
      .split("T")[0];
  }

  if (
    /\btoday\b/i.test(text) ||
    /\baaj\b/i.test(text)
  ) {
    return now
      .toISOString()
      .split("T")[0];
  }

  return undefined;
}

/*
 * Supports:
 *
 * English:
 * at 1
 * at 2
 * at 10
 * at 12
 * at 1 am
 * at 10 pm
 * at 10:30 pm
 *
 * Roman Urdu:
 * 1 baje
 * 2 baje
 * 10 baje
 * 12 baje
 * 10:30 baje
 *
 * Notes:
 * - 1–12 are valid clock hours.
 * - Without AM/PM, the entered hour is preserved.
 * - "7 baje" => 07:00
 * - "7 pm" => 19:00
 */
function extractDueTime(
  text: string
): string | undefined {
  const englishMatch = text.match(
    /\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i
  );

  const romanUrduMatch = text.match(
    /\b(\d{1,2})(?::(\d{2}))?\s*baje\b/i
  );

  const match =
    englishMatch ||
    romanUrduMatch;

  if (!match) {
    return undefined;
  }

  let hour = Number(match[1]);

  const minute = match[2]
    ? Number(match[2])
    : 0;

  const period =
    match[3]?.toLowerCase();

  /*
   * Valid 12-hour clock:
   * hour = 1–12
   * minute = 0–59
   */
  if (
    hour < 1 ||
    hour > 12 ||
    minute < 0 ||
    minute > 59
  ) {
    return undefined;
  }

  /*
   * Convert PM to 24-hour format.
   */
  if (
    period === "pm" &&
    hour < 12
  ) {
    hour += 12;
  }

  /*
   * Convert 12 AM to midnight.
   */
  if (
    period === "am" &&
    hour === 12
  ) {
    hour = 0;
  }

  return `${String(hour).padStart(
    2,
    "0"
  )}:${String(minute).padStart(
    2,
    "0"
  )}`;
}

/* =========================================================
   LEAD INTELLIGENCE
   ========================================================= */

function isLeadReadRequest(
  text: string
): boolean {
  const value = normalize(text);

  const hasLead =
    value.includes("lead") ||
    value.includes("leads") ||
    value.includes("prospect") ||
    value.includes("prospects");

  const hasReadIntent =
    value.includes("show") ||
    value.includes("list") ||
    value.includes("find") ||
    value.includes("get") ||
    value.includes("give") ||
    value.includes("dikhao") ||
    value.includes("dikhado") ||
    value.includes("batao") ||
    value.includes("dekhao") ||
    value.includes("kon kon");

  return (
    hasLead &&
    hasReadIntent
  );
}

function extractLeadPriorityFilter(
  text: string
): LeadPriority | undefined {
  const value = normalize(text);

  if (
    value.includes("high priority") ||
    value.includes("high-priority") ||
    value.includes("high priority leads") ||
    value.includes("high-priority leads")
  ) {
    return "high";
  }

  if (
    value.includes("medium priority") ||
    value.includes("medium-priority")
  ) {
    return "medium";
  }

  if (
    value.includes("low priority") ||
    value.includes("low-priority")
  ) {
    return "low";
  }

  return undefined;
}

function extractLeadStatusFilter(
  text: string
): LeadStatus | undefined {
  const value = normalize(text);

  if (
    value.includes("qualified") ||
    value.includes("qualify")
  ) {
    return "qualified";
  }

  if (
    value.includes("contacted")
  ) {
    return "contacted";
  }

  if (
    value.includes("new leads") ||
    value.includes("new lead")
  ) {
    return "new";
  }

  return undefined;
}

function isThisWeekRequest(
  text: string
): boolean {
  const value = normalize(text);

  return (
    value.includes("this week") ||
    value.includes("iss week") ||
    value.includes("is week") ||
    value.includes("iss haftay") ||
    value.includes("is haftay") ||
    value.includes("this haftay")
  );
}

function isTodayRequest(
  text: string
): boolean {
  const value = normalize(text);

  return (
    value.includes("today") ||
    value.includes("aaj") ||
    value.includes("aaj ki") ||
    value.includes("aaj ke")
  );
}

function getStartOfWeek(
  date: Date
): Date {
  const result = new Date(date);

  const day = result.getDay();

  /*
   * Monday = start of business week.
   */
  const difference =
    day === 0 ? -6 : 1 - day;

  result.setDate(
    result.getDate() + difference
  );

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
}

function getStartOfToday(
  date: Date
): Date {
  const result = new Date(date);

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
}

function readLeads(
  message: string
): AICommandResult {
  const leads = getLeads();

  const priority =
    extractLeadPriorityFilter(
      message
    );

  const status =
    extractLeadStatusFilter(
      message
    );

  const thisWeek =
    isThisWeekRequest(message);

  const today =
    isTodayRequest(message);

  const now = new Date();

  const startOfWeek =
    getStartOfWeek(now);

  const startOfToday =
    getStartOfToday(now);

  let filteredLeads = leads.filter(
    (lead) => {
      if (
        priority &&
        lead.priority !== priority
      ) {
        return false;
      }

      if (
        status &&
        lead.status !== status
      ) {
        return false;
      }

      const createdAt =
        new Date(
          lead.createdAt ??
            Date.now()
        );

      if (
        thisWeek &&
        createdAt < startOfWeek
      ) {
        return false;
      }

      if (
        today &&
        createdAt < startOfToday
      ) {
        return false;
      }

      return true;
    }
  );

  /*
   * Sort important leads first.
   */
  const priorityRank: Record<
    LeadPriority,
    number
  > = {
    high: 3,
    medium: 2,
    low: 1,
  };

  filteredLeads = [
    ...filteredLeads,
  ].sort(
    (a, b) =>
      priorityRank[b.priority] -
      priorityRank[a.priority]
  );

  return {
    handled: true,
    type: "read_leads",
    count:
      filteredLeads.length,
    leads:
      filteredLeads,
    filters: {
      priority,
      status,
      dateRange: thisWeek
        ? "this_week"
        : today
          ? "today"
          : undefined,
    },
  };
}

/* =========================================================
   BULK FOLLOW-UP INTENT
   ========================================================= */

function isBulkFollowUpRequest(
  text: string
): boolean {
  const value = normalize(text);

  const hasFollowUp =
    value.includes("follow up") ||
    value.includes("follow-up") ||
    value.includes("followup");

  const hasMultiple =
    value.includes("all of them") ||
    value.includes("all them") ||
    value.includes("all of those") ||
    value.includes("those leads") ||
    value.includes("these leads") ||
    value.includes("all leads") ||
    value.includes("sab") ||
    value.includes("saray") ||
    value.includes("sari") ||
    value.includes("un sab");

  const hasTaskIntent =
    value.includes("task") ||
    value.includes("tasks") ||
    value.includes("create") ||
    value.includes("make") ||
    value.includes("add") ||
    value.includes("bana") ||
    value.includes("banado") ||
    value.includes("banao");

  return (
    hasFollowUp &&
    hasMultiple &&
    hasTaskIntent
  );
}

/* =========================================================
   SCHEDULE EXISTING FOLLOW-UPS
   ========================================================= */

function isScheduleFollowUpRequest(
  text: string
): boolean {
  const value = normalize(text);

  const hasTomorrow =
    value.includes("tomorrow") ||
    value.includes("kal");

  const hasTime =
    value.includes("baje") ||
    /\bat\s+\d{1,2}(?::\d{2})?\s*(am|pm)?\b/i.test(
      value
    );

  const hasScheduleAction =
    value.includes("kar do") ||
    value.includes("kardo") ||
    value.includes("schedule") ||
    value.includes("set") ||
    value.includes("change") ||
    value.includes("update");

  return (
    hasTomorrow &&
    hasTime &&
    hasScheduleAction
  );
}

function buildScheduledDueDate(
  message: string
): string | undefined {
  const dueDate =
    extractDueDate(message);

  const dueTime =
    extractDueTime(message);

  if (
    !dueDate ||
    !dueTime
  ) {
    return undefined;
  }

  const [year, month, day] =
    dueDate
      .split("-")
      .map(Number);

  const [hour, minute] =
    dueTime
      .split(":")
      .map(Number);

  const scheduledDate =
    new Date();

  scheduledDate.setFullYear(
    year,
    month - 1,
    day
  );

  scheduledDate.setHours(
    hour,
    minute,
    0,
    0
  );

  return scheduledDate.toISOString();
}

function scheduleExistingFollowUps(
  message: string
): AICommandResult {
  const scheduledDueDate =
    buildScheduledDueDate(
      message
    );

  const dueTime =
    extractDueTime(message);

  if (
    !scheduledDueDate ||
    !dueTime
  ) {
    return {
      handled: true,
      type:
        "schedule_followups",
      message:
        "I couldn't determine the exact date and time.",
      count: 0,
      tasks: [],
    };
  }

  const tasks =
    getTasks();

  /*
   * Only update real, open Follow-up tasks.
   *
   * Completed/cancelled tasks are intentionally
   * excluded so historical workspace data is safe.
   */
  const followUpTasks =
    tasks.filter(
      (task) =>
        task.title
          .toLowerCase()
          .trim() === "follow-up" &&
        task.status !==
          "completed" &&
        task.status !==
          "cancelled"
    );

  const updatedTasks =
    followUpTasks
      .map((task) =>
        updateTask(
          task.id,
          {
            dueDate:
              scheduledDueDate,
          }
        )
      )
      .filter(
        (
          task
        ): task is NonNullable<
          typeof task
        > =>
          Boolean(task)
      );

  return {
    handled: true,
    type:
      "schedule_followups",
    message:
      `I scheduled ${updatedTasks.length} follow-up task${
        updatedTasks.length === 1
          ? ""
          : "s"
      } for tomorrow at ${dueTime}.`,
    count:
      updatedTasks.length,
    tasks:
      updatedTasks,
  };
}

/* =========================================================
   SINGLE TASK CREATION
   ========================================================= */

async function createSingleTask(
  message: string
): Promise<AICommandResult> {
  const text =
    message.trim();

  const isFollowUp =
    /\bfollow[- ]?up\b/i.test(
      text
    );

  const title =
    isFollowUp
      ? "Follow-up"
      : extractTaskTitle(text);

  const assignee =
    extractAssignee(text);

  const dueDate =
    extractDueDate(text);

  const dueTime =
    extractDueTime(text);

  const priority =
    extractPriority(text);

  const descriptionParts = [
    assignee
      ? `Assigned to ${assignee}.`
      : "",

    dueDate
      ? `Due ${dueDate}.`
      : "",

    dueTime
      ? `Time ${dueTime}.`
      : "",
  ].filter(Boolean);

  const taskPriority =
    priority === "URGENT"
      ? "high"
      : (priority.toLowerCase() as
          | "low"
          | "medium"
          | "high");

  const now =
    new Date().toISOString();

  const task =
    createTask({
      id: `task-ai-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

      /*
       * FINAL GUARANTEE:
       * Follow-up requests are stored with
       * this exact title.
       */
      title,

      description:
        descriptionParts.join(" "),

      priority:
        taskPriority,

      status:
        "pending",

      createdAt:
        now,

      updatedAt:
        now,
    });

  return {
    handled:
      true,

    type:
      "create_task",

    message:
      `Task created successfully${
        assignee
          ? ` for ${assignee}`
          : ""
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

/* =========================================================
   COMMAND EXECUTION
   ========================================================= */

export async function executeAICommand(
  message: string
): Promise<AICommandResult> {
  const text =
    message.trim();

  if (!text) {
    return {
      handled: false,
    };
  }

  /*
   * -------------------------------------------------------
   * REAL LEAD READING
   * -------------------------------------------------------
   */

  if (
    isLeadReadRequest(text)
  ) {
    return readLeads(text);
  }

  /*
   * -------------------------------------------------------
   * SCHEDULE EXISTING FOLLOW-UPS
   * -------------------------------------------------------
   */

  if (
    isScheduleFollowUpRequest(
      text
    )
  ) {
    return scheduleExistingFollowUps(
      text
    );
  }

  /*
   * -------------------------------------------------------
   * BULK FOLLOW-UP
   *
   * Previous-result memory will be connected
   * from route.ts in the next P3 step.
   * -------------------------------------------------------
   */

  if (
    isBulkFollowUpRequest(text)
  ) {
    return {
      handled: true,
      type:
        "bulk_create_tasks",
      message:
        "I understand that you want follow-up tasks created for the leads from the previous result.",
      count: 0,
      tasks: [],
    };
  }

  /*
   * -------------------------------------------------------
   * SINGLE TASK CREATION
   * -------------------------------------------------------
   */

  const isFollowUp =
    /\bfollow[- ]?up\b/i.test(
      text
    );

  const isCreateTask =
    /\b(create|make|add|set up)\b.*\btask\b/i.test(
      text
    ) ||
    /\bfollow[- ]?up task\b/i.test(
      text
    ) ||
    /\btask\b.*\b(banao|bana do|banado|create karo|create kro)\b/i.test(
      text
    );

  if (!isCreateTask) {
    return {
      handled:
        false,
    };
  }

  /*
   * Existing single-task behavior remains intact.
   */
  return createSingleTask(
    text
  );
}
