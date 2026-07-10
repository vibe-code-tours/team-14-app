import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    isAdmin: boolean;
    isSuperAdmin: boolean;
  }

  interface Session {
    user: {
      id: number;
      role: string;
      isAdmin: boolean;
      isSuperAdmin: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: string;
    isAdmin: boolean;
    isSuperAdmin: boolean;
  }
}
