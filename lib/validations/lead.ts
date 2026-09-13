import { z } from "zod";

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Lead name is required.")
    .max(100),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  company: z
    .string()
    .trim()
    .max(100)
    .optional(),

  phone: z
    .string()
    .trim()
    .max(30)
    .optional(),

  status: z
    .enum([
      "new",
      "contacted",
      "qualified",
      "converted",
      "lost",
    ])
    .default("new"),

  priority: z
    .enum(["low", "medium", "high"])
    .default("medium"),

  notes: z
    .string()
    .trim()
    .max(1000)
    .optional(),
});

export const createLeadSchema = leadSchema;

export const updateLeadSchema = leadSchema.partial();

export type LeadInput = z.infer<typeof leadSchema>;
export type CreateLeadInput = z.infer<
  typeof createLeadSchema
>;
export type UpdateLeadInput = z.infer<
  typeof updateLeadSchema
>;