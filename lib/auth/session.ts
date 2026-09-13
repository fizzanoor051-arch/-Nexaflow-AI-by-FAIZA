export interface SessionData {
  userId: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

const DEMO_SESSION: SessionData = {
  userId: "demo-user-1",
  name: "Faiza Noor",
  email: "faiza@example.com",
  role: "user",
};

export async function getSession(): Promise<SessionData | null> {
  // Temporary demo session.
  // Real cookie/JWT session will be connected later.
  return DEMO_SESSION;
}

export async function createSession(
  user: SessionData
): Promise<SessionData> {
  return user;
}

export async function destroySession(): Promise<void> {
  // Session cleanup will be implemented with cookies/JWT later.
}

export async function updateSession(
  data: Partial<SessionData>
): Promise<SessionData | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return {
    ...session,
    ...data,
  };
}