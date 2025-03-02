import Link from "next/link";
import LogoutButton from "@/components/custom/logout-button";
import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/auth/sessions";

export default async function Page() {
  const { session, user } = await getCurrentSession();

  return (
    <div className="mx-auto flex h-svh max-w-md flex-col items-center justify-center p-4">
      <header className="mb-3">
        <h1 className="font-semibold">nicholasdly/starter</h1>
      </header>
      <main className="flex flex-col items-center gap-4">
        {session ? (
          <>
            <p>You are logged in.</p>
            <pre className="max-w-96 overflow-x-scroll whitespace-pre rounded border bg-muted px-3 py-2 text-muted-foreground leading-snug">
              <code className="font-medium font-mono text-xs">
                {JSON.stringify(user, null, 2)}
              </code>
            </pre>
            <LogoutButton />
          </>
        ) : (
          <>
            <p>You are not logged in.</p>
            <Button size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </>
        )}
      </main>
    </div>
  );
}
