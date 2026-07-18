import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { getPublicDisplayName } from "./users";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "fallback-secret");
const COOKIE_NAME = "wv-admin-session";
const EXPIRY = "8h";

export interface AdminSessionPayload {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export async function createAdminSession(user: {
  id: number;
  email: string;
  fullName: string;
  nickname: string | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}) {
  const payload: AdminSessionPayload = {
    id: user.id,
    email: user.email,
    name: getPublicDisplayName(user),
    isAdmin: user.isAdmin,
    isSuperAdmin: user.isSuperAdmin,
  };

  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(SECRET);

  return token;
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function setAdminSessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours
    },
  };
}

export async function verifyAdminCredentials(email: string, password: string) {
  const user = await prisma.user.findFirst({
    where: { email: email.trim().toLowerCase(), isAdmin: true },
  });

  if (!user || !user.passwordHash) return null;
  if (!user.isAdmin) return null;
  if (user.status === "blocked") return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return user;
}
