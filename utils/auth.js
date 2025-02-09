import { useUser } from "@auth0/nextjs-auth0/client";

export function useUserRole() {
  const { user, isLoading } = useUser();
  if (isLoading) return { role: null, isLoading };

  const roles = user?.["https://shopnextdoor.com/roles"] || [];
  return { role: roles[0] || null, isLoading };
}
