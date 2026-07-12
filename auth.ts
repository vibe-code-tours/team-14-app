import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import { verifyCredentials } from "./lib/users";
import { checkRateLimit } from "./lib/rate-limit";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const normalized = email.trim().toLowerCase();
        const { allowed } = await checkRateLimit(`login:${normalized}`, 10, 60 * 1000);
        if (!allowed) return null;

        const user = await verifyCredentials(email, password);
        if (!user) return null;

        return {
          id: String(user.id),
          email: user.email,
          role: user.role,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
          name: user.displayName,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isAdmin = (user as any).isAdmin ?? false;
        token.isSuperAdmin = (user as any).isSuperAdmin ?? false;
        token.image = (user as any).image ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.isSuperAdmin = token.isSuperAdmin as boolean;
        session.user.image = (token.image as string) ?? session.user.image;
      }
      return session;
    },
  },
});
