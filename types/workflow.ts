export type WorkflowStatus =
  | "draft"
  | "active"
  | "paused"
  | "archived";

export type WorkflowStepType =
  | "trigger"
  | "ai"
  | "action"
  | "condition"
  | "notification"
  | "delay";

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  type: WorkflowStepType;
  order: number;
  config?: Record<string, unknown>;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  runs: number;
  successRate: number;
  steps: WorkflowStep[];
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface CreateWorkflowData {
  name: string;
  description?: string;
  steps: WorkflowStep[];
}

export interface UpdateWorkflowData {
  name?: string;
  description?: string;
  status?: WorkflowStatus;
  steps?: WorkflowStep[];
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: "running" | "completed" | "failed";
  startedAt: string;
  completedAt?: string;
  error?: string;
}