"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onClick = () => {
    startTransition(async () => {
      const { success, error } = await logout();
      if (success) {
        router.refresh();
      } else {
        toast.error(error);
      }
    });
  };

  return (
    <Button size="sm" variant="outline" onClick={onClick} disabled={isPending}>
      Log out
    </Button>
  );
}
