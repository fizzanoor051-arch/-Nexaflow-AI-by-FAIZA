
export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export type TaskPriority =
  | "low"
  | "medium"
  | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
  leadId?: string;
  workflowId?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
  leadId?: string;
  workflowId?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assigneeId?: string;
  leadId?: string;
  workflowId?: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}
