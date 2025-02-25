import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateExpiredSessions,
  invalidateSession,
} from "@/lib/auth/sessions";

export async function DELETE() {
  const { session } = await getCurrentSession();
  if (!session) return new Response(null, { status: 403 });

  await Promise.all([
    invalidateSession(session.id),
    deleteSessionTokenCookie(),
  ]);

  invalidateExpiredSessions();

  return new Response(null, { status: 200 });
}
