import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "nexaflow_session";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type SessionPayload = {
  userId: string;
  name: string;
  email: string;
  role: "user" | "guest";
  exp: number;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error(
      "AUTH_SECRET is missing. Add AUTH_SECRET to your environment variables."
    );
  }

  return secret;
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const normalized = value
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padding =
    normalized.length % 4 === 0
      ? ""
      : "=".repeat(4 - (normalized.length % 4));

  return Buffer.from(normalized + padding, "base64").toString(
    "utf8"
  );
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret())
    .update(value)
    .digest("base64url");
}

function createToken(payload: SessionPayload) {
  const encodedPayload = base64UrlEncode(
    JSON.stringify(payload)
  );

  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

function verifyToken(token: string): SessionPayload | null {
  try {
    const [encodedPayload, signature] = token.split(".");

    if (!encodedPayload || !signature) {
      return null;
    }

    const expectedSignature = sign(encodedPayload);

    const received = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);

    if (received.length !== expected.length) {
      return null;
    }

    if (!timingSafeEqual(received, expected)) {
      return null;
    }

    const payload = JSON.parse(
      base64UrlDecode(encodedPayload)
    ) as SessionPayload;

    if (!payload.exp || payload.exp < Date.now()) {
      return null;
    }

    if (
      !payload.userId ||
      !payload.name ||
      !payload.email ||
      !payload.role
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function createSession(input: {
  userId: string;
  name: string;
  email: string;
  role: "user" | "guest";
}) {
  const payload: SessionPayload = {
    ...input,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };

  const token = createToken(payload);

  return {
    name: SESSION_COOKIE,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: SESSION_MAX_AGE,
    },
  };
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export function verifySessionToken(
  token: string | undefined
): SessionPayload | null {
  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getSessionMaxAge() {
  return SESSION_MAX_AGE;
}

export function createExpiredSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    },
  };
}