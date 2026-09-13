import { z } from "zod";

export const workflowStepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum([
    "trigger",
    "ai",
    "extract",
    "condition",
    "task",
    "lead",
    "notification",
    "save",
  ]),
});

export const workflowSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(500),
  steps: z.array(workflowStepSchema).min(1).max(20),
});

export const leadSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(40).optional(),
  company: z.string().max(120).optional(),
  intent: z.string().max(300).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export const taskSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().max(1000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  status: z
    .enum(["TODO", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .default("TODO"),
  dueDate: z.string().optional(),
});

export const aiRequestSchema = z.object({
  message: z.string().min(1).max(5000),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});

export const aiWorkflowResponseSchema = z.object({
  message: z.string(),
  workflow: workflowSchema.optional(),
});

export type WorkflowStep = z.infer<typeof workflowStepSchema>;
export type WorkflowInput = z.infer<typeof workflowSchema>;
export type LeadInput = z.infer<typeof leadSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type AIRequestInput = z.infer<typeof aiRequestSchema>;
export type AIWorkflowResponse = z.infer<
  typeof aiWorkflowResponseSchema
>;