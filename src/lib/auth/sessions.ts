import "server-only";
import { eq, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "@/db";
import { type Session, type User, sessions, users } from "@/db/schema";
import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";

// Make sure this matches the maximum cookie age in the middleware.
const sessionDuration = 1000 * 60 * 60 * 24 * 7; // 7 days in milliseconds

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  const id = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const expiresAt = new Date(Date.now() + sessionDuration);

  const [session] = await db
    .insert(sessions)
    .values({ id, userId, expiresAt })
    .returning();

  if (!session) throw new Error("Failed to create session");

  return session;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  // TODO: Use a transaction here if your database supports it.

  const [data] = await db
    .select({
      user: users,
      session: sessions,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  const user = data?.user;
  const session = data?.session;

  if (!user || !session) return { session: null, user: null };

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, session.id));
    return { session: null, user: null };
  }

  // Extends the session expiration when it's near expiration.
  if (Date.now() >= session.expiresAt.getTime() - sessionDuration / 2) {
    session.expiresAt = new Date(Date.now() + sessionDuration);
    await db
      .update(sessions)
      .set({ expiresAt: session.expiresAt })
      .where(eq(sessions.id, session.id));
  }

  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function invalidateAllSessions(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

export async function invalidateExpiredSessions() {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) return { session: null, user: null };

    const result = await validateSessionToken(token);
    return result;
  },
);
