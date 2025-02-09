"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function RedirectPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return; // Wait until user data is fully loaded

    if (user) {
      const role = user?.["https://yourdomain.com/roles"]; // Replace with your actual Auth0 claim URL

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "vendor") {
        router.push("/vendor/dashboard");
      } else {
        router.push("/user/home");
      }
    } else {
      router.push("/auth/login"); // Redirect if no user
    }
  }, [user, isLoading, router]);

  return <p className="text-center mt-10">Redirecting...</p>;
}
