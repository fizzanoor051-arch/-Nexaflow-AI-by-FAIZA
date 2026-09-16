import { randomUUID } from "crypto";

export type TaskStatus = "pending" | "in_progress" | "completed";

export type Task = {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  dueTime?: string;
  priority: "low" | "medium" | "high";
  status: TaskStatus;
  source: "manual" | "ai";
  createdAt: string;
  updatedAt: string;
};

export type LeadStatus = "new" | "contacted" | "qualified" | "converted";

export type Lead = {
  id: string;
  name: string;
  email?: string;
  company?: string;
  status: LeadStatus;
  source: "manual" | "ai";
  createdAt: string;
  updatedAt: string;
};

export type WorkflowRun = {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "running" | "completed" | "failed";
  triggeredBy: "manual" | "ai";
  createdAt: string;
  completedAt?: string;
};

export type AIActivity = {
  id: string;
  action:
    | "create_task"
    | "update_task"
    | "create_lead"
    | "update_lead"
    | "trigger_workflow";
  message: string;
  status: "success" | "error";
  entityId?: string;
  entityType?: "task" | "lead" | "workflow";
  details?: Record<string, unknown>;
  createdAt: string;
};

type ActionStore = {
  tasks: Task[];
  leads: Lead[];
  workflowRuns: WorkflowRun[];
  activities: AIActivity[];
};

const globalForActionStore = globalThis as typeof globalThis & {
  __nexaflowActionStore?: ActionStore;
};

if (!globalForActionStore.__nexaflowActionStore) {
  globalForActionStore.__nexaflowActionStore = {
    tasks: [
      {
        id: "task-demo-1",
        title: "Review qualified leads",
        description: "Review recently qualified leads",
        assignee: "Faiza",
        priority: "high",
        status: "in_progress",
        source: "manual",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    leads: [
      {
        id: "lead-demo-1",
        name: "Ahmed",
        email: "ahmed@example.com",
        company: "Acme Corp",
        status: "qualified",
        source: "manual",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    workflowRuns: [],
    activities: [],
  };
}

export const actionStore = globalForActionStore.__nexaflowActionStore;

export function createTask(
  input: Omit<Task, "id" | "createdAt" | "updatedAt">,
) {
  const now = new Date().toISOString();

  const task: Task = {
    ...input,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  actionStore.tasks.unshift(task);

  return task;
}

export function updateTask(
  id: string,
  updates: Partial<Omit<Task, "id" | "createdAt">>,
) {
  const index = actionStore.tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return null;
  }

  const existing = actionStore.tasks[index];

  const updated: Task = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  actionStore.tasks[index] = updated;

  return updated;
}

export function createLead(
  input: Omit<Lead, "id" | "createdAt" | "updatedAt">,
) {
  const now = new Date().toISOString();

  const lead: Lead = {
    ...input,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  actionStore.leads.unshift(lead);

  return lead;
}

export function updateLead(
  id: string,
  updates: Partial<Omit<Lead, "id" | "createdAt">>,
) {
  const index = actionStore.leads.findIndex((lead) => lead.id === id);

  if (index === -1) {
    return null;
  }

  const existing = actionStore.leads[index];

  const updated: Lead = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  actionStore.leads[index] = updated;

  return updated;
}

export function addActivity(
  input: Omit<AIActivity, "id" | "createdAt">,
) {
  const activity: AIActivity = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  actionStore.activities.unshift(activity);

  if (actionStore.activities.length > 100) {
    actionStore.activities.length = 100;
  }

  return activity;
}

export function triggerWorkflow(
  workflowId: string,
  workflowName: string,
) {
  const run: WorkflowRun = {
    id: randomUUID(),
    workflowId,
    workflowName,
    status: "running",
    triggeredBy: "ai",
    createdAt: new Date().toISOString(),
  };

  actionStore.workflowRuns.unshift(run);

  setTimeout(() => {
    const current = actionStore.workflowRuns.find(
      (item) => item.id === run.id,
    );

    if (current) {
      current.status = "completed";
      current.completedAt = new Date().toISOString();
    }
  }, 500);

  return run;
}