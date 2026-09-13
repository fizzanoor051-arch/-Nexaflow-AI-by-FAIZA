export type AIMessageRole = "user" | "assistant" | "system";

export interface AIMessage {
  id?: string;
  role: AIMessageRole;
  content: string;
  timestamp?: string;
}

export interface AIWorkflowStep {
  id?: string;
  title: string;
  description: string;
  type:
    | "trigger"
    | "ai"
    | "action"
    | "condition"
    | "notification"
    | "delay";
  order?: number;
}

export interface AIWorkflow {
  id?: string;
  name: string;
  title?: string;
  description: string;
  status?: "draft" | "active" | "paused" | "completed";
  steps: AIWorkflowStep[];
}

export interface AIRequest {
  message: string;
  messages?: AIMessage[];
  conversationId?: string;
}

export interface AIResponse {
  message: string;
  workflow?: AIWorkflow;
  action?: string;
  success?: boolean;
  error?: string;
}

export type AIToolName =
  | "create_workflow"
  | "create_lead"
  | "create_task"
  | "search_leads"
  | "search_tasks"
  | "get_workflow"
  | "get_analytics";

export interface AIToolCall {
  name: AIToolName;
  arguments: Record<string, unknown>;
}