import { z } from "zod";

export const workflowStepSchema = z.object({
  id: z.string().min(1),

  title: z
    .string()
    .trim()
    .min(1, "Step title is required."),

  description: z
    .string()
    .trim()
    .min(1, "Step description is required."),

  type: z.enum([
    "trigger",
    "ai",
    "action",
    "condition",
    "notification",
    "delay",
  ]),
});

export const workflowSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Workflow name is required.")
    .max(100),

  description: z
    .string()
    .trim()
    .max(500)
    .optional(),

  status: z
    .enum(["draft", "active", "paused", "archived"])
    .default("draft"),

  steps: z
    .array(workflowStepSchema)
    .min(1, "Workflow must contain at least one step."),
});

export const createWorkflowSchema = workflowSchema.omit({
  status: true,
});

export const updateWorkflowSchema = workflowSchema.partial();

export type WorkflowStepInput = z.infer<
  typeof workflowStepSchema
>;

export type WorkflowInput = z.infer<
  typeof workflowSchema
>;

export type CreateWorkflowInput = z.infer<
  typeof createWorkflowSchema
>;

export type UpdateWorkflowInput = z.infer<
  typeof updateWorkflowSchema
>;