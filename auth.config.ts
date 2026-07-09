import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Edge-safe config: no Prisma adapter, no bcrypt. This is imported by
// middleware.ts (Edge runtime) as well as auth.ts (Node runtime).
export default {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      // Real verification happens in auth.ts's authorize(), which needs
      // Prisma + bcrypt and therefore cannot live in this Edge-safe file.
      authorize: async () => null,
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.isAdmin = (user as any).isAdmin ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
