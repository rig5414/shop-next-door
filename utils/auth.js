import { useSession } from "next-auth/react";

export function useUserRole() {
  const { data: session, status } = useSession();

  if (status === "loading") return { role: null, isLoading: true };

  const role = session?.user?.role || null;
  return { role, isLoading: false };
}
