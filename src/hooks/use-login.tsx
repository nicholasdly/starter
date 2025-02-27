import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { loginFormSchema } from "@/lib/auth/schemas";
import { tc } from "@/lib/utils";

export async function login(values: z.infer<typeof loginFormSchema>) {
  const [response] = await tc(
    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }),
  );

  if (response?.ok) {
    return {
      success: true as const,
      error: null,
    };
  }

  if (response?.status === 401) {
    return {
      success: false as const,
      error: "Incorrect email or password.",
    };
  }

  return {
    success: false as const,
    error: "Something went wrong! Try again later.",
  };
}

export function useLogin() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const action = async (values: z.infer<typeof loginFormSchema>) => {
    startTransition(async () => {
      const { success, error } = await login(values);
      if (success) {
        router.push("/");
      } else {
        toast.error(error);
      }
    });
  };

  return { login: action, isPending };
}
