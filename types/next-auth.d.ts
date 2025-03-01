import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend the User type
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: "customer" | "vendor" | "admin"; // Ensure this matches your Prisma schema
  }

  interface Session {
    user: User;
  }
}
