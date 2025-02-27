import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { tc } from "@/lib/utils";

async function logout() {
  const [response] = await tc(
    fetch("/api/logout", {
      method: "DELETE",
    }),
  );

  if (response?.ok) {
    return {
      success: true as const,
      error: null,
    };
  }

  return {
    success: false as const,
    error: "Something went wrong! Try again later.",
  };
}

export function useLogout() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const action = () => {
    startTransition(async () => {
      const { success, error } = await logout();
      if (success) {
        router.refresh();
      } else {
        toast.error(error);
      }
    });
  };

  return { logout: action, isPending };
}
