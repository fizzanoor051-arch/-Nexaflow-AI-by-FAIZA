import { hashPassword } from "@/lib/auth/password";

export type AuthRole = "user" | "guest";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AuthRole;
  createdAt: string;
};

const users = new Map<string, AuthUser>();

let initialized = false;

async function initializeUsers() {
  if (initialized) {
    return;
  }

  initialized = true;

  const demoEmail = "fizzanoor051@gmail.com";

  users.set(demoEmail, {
    id: "demo-user-1",
    name: "Faiza Noor",
    email: demoEmail,
    passwordHash: await hashPassword("Password123"),
    role: "user",
    createdAt: new Date().toISOString(),
  });
}

export async function getUserByEmail(
  email: string
): Promise<AuthUser | undefined> {
  await initializeUsers();

  return users.get(email.trim().toLowerCase());
}

export function findUserByEmail(
  email: string
): AuthUser | undefined {
  return users.get(email.trim().toLowerCase());
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthUser> {
  await initializeUsers();

  const email = input.email.trim().toLowerCase();

  if (users.has(email)) {
    throw new Error("An account with this email already exists.");
  }

  const user: AuthUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.trim(),
    email,
    passwordHash: await hashPassword(input.password),
    role: "user",
    createdAt: new Date().toISOString(),
  };

  users.set(email, user);

  return user;
}

export function sanitizeUser(user: AuthUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}