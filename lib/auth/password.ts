import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(
  password: string
): Promise<string> {
  if (!password) {
    throw new Error("Password is required");
  }

  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  if (!password || !hashedPassword) {
    return false;
  }

  return bcrypt.compare(password, hashedPassword);
}

export function validatePasswordStrength(
  password: string
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain an uppercase letter.");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain a lowercase letter.");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain a number.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}