"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-logout";

export default function LogoutButton() {
  const { logout, isPending } = useLogout();

  return (
    <Button size="sm" variant="outline" onClick={logout} disabled={isPending}>
      Log out
    </Button>
  );
}
