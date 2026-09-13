import { getSession } from "./session";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return {
    id: session.userId,
    name: session.name,
    email: session.email,
    role: session.role,
  };
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return Boolean(user);
}

export async function hasRole(
  role: AuthUser["role"]
): Promise<boolean> {
  const user = await getCurrentUser();

  return user?.role === role;
}