import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyCredentials } from "./lib/users";
import { checkRateLimit } from "./lib/rate-limit";
import authConfig from "./auth.config";
import { prisma } from "./lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: any) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const normalized = email.trim().toLowerCase();
        const { allowed } = await checkRateLimit(`login:${normalized}`, 10, 60 * 1000);
        if (!allowed) return null;

        const user = await verifyCredentials(email, password);
        if (!user) return null;

        // Handle unverified email case - return null and let client handle it
        if ("emailNotVerified" in user && user.emailNotVerified) {
          return null;
        }

        // Type guard: ensure we have a full user object (not the emailNotVerified variant)
        if (!("id" in user)) return null;

        return {
          id: String(user.id),
          email: user.email ?? "",
          role: user.role ?? "user",
          isAdmin: user.isAdmin ?? false,
          isSuperAdmin: user.isSuperAdmin ?? false,
          name: user.displayName ?? "",
          image: user.image ?? null,
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.isSuperAdmin = token.isSuperAdmin as boolean;

        // Fetch image from database (too large for JWT)
        try {
          const user = await prisma.user.findUnique({
            where: { id: parseInt(token.id as string) },
            select: { image: true },
          });
          session.user.image = user?.image ?? null;
        } catch {
          session.user.image = null;
        }
      }
      return session;
    },
  },
});
