import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Task title is required.")
    .max(150),

  description: z
    .string()
    .trim()
    .max(1000)
    .optional(),

  status: z
    .enum([
      "pending",
      "in_progress",
      "completed",
      "cancelled",
    ])
    .default("pending"),

  priority: z
    .enum(["low", "medium", "high"])
    .default("medium"),

  dueDate: z
    .string()
    .optional(),

  assigneeId: z
    .string()
    .optional(),

  leadId: z
    .string()
    .optional(),

  workflowId: z
    .string()
    .optional(),
});

export const createTaskSchema = taskSchema;

export const updateTaskSchema = taskSchema.partial();

export type TaskInput = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<
  typeof createTaskSchema
>;
export type UpdateTaskInput = z.infer<
  typeof updateTaskSchema
>;