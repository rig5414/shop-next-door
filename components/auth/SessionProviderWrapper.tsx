"use client";

import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ReactNode } from "react";

export default function SessionProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <SessionProvider>{children}</SessionProvider>
    </UserProvider>
  );
}