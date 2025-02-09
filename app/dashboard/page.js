"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserRole } from "@/utils/auth";

export default function Dashboard() {
  const router = useRouter();
  const { role, isLoading } = useUserRole();

  useEffect(() => {
    if (!isLoading) {
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "vendor") {
        router.push("/vendor/dashboard");
      } else {
        router.push("/customer/dashboard"); // Default for normal users
      }
    }
  }, [role, isLoading, router]);

  return <p>Loading Dashboard...</p>;
}
