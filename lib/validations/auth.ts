import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters."),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name is too long."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain an uppercase letter.")
    .regex(/[a-z]/, "Password must contain a lowercase letter.")
    .regex(/[0-9]/, "Password must contain a number."),

  confirmPassword: z
    .string()
    .min(8, "Please confirm your password."),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  }
);

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(50),

  email: z
    .string()
    .trim()
    .email(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<
  typeof updateProfileSchema
>;