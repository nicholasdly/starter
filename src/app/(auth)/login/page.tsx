import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/auth/sessions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogInForm } from "./login-form";

export default async function Page() {
  const { user } = await getCurrentSession();
  if (user) redirect("/");

  return (
    <main className="mx-auto flex h-dvh max-w-sm items-center p-4">
      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-nowrap font-semibold text-xl">Sign in</h1>
          <p className="text-pretty text-center text-muted-foreground text-sm">
            Log in to your account with your email address and password.
          </p>
        </div>
        <LogInForm />
        <p className="text-center text-muted-foreground text-sm">
          Don&apos;t have an account?&nbsp;
          <Button variant="link" className="h-fit p-0" asChild>
            <Link
              href="/register"
              className="font-semibold text-foreground hover:underline"
            >
              Register
            </Link>
          </Button>
        </p>
      </div>
    </main>
  );
}
