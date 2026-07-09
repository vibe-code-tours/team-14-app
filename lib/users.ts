import crypto from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "./prisma";
import { sendVerificationEmail, sendPasswordResetEmail } from "./email";

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
  fullName: z.string().trim().min(1).max(255),
  nickname: z.string().trim().min(1).max(50).optional(),
});

export interface RegisterUserInput {
  email: string;
  password: string;
  fullName: string;
  nickname?: string;
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

// The only function permitted to surface a name publicly. fullName is
// captured for admin audit purposes and must never be returned directly
// by any public-facing API response.
export function getPublicDisplayName(user: { nickname: string | null; fullName: string }) {
  return user.nickname ?? user.fullName;
}

export async function registerUser(input: RegisterUserInput) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid registration input");
  }
  const { email, password, fullName, nickname } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName,
      nickname: nickname || null,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      nickname: true,
    },
  });

  const rawToken = generateToken();
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashToken(rawToken),
      expires: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
    },
  });

  const verifyUrl = `${process.env.AUTH_URL || "http://localhost:3000"}/verify-email?token=${rawToken}&email=${encodeURIComponent(email)}`;
  await sendVerificationEmail(email, verifyUrl);

  return user;
}

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!user || !user.passwordHash) return null;
  if (!user.emailVerified) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    displayName: getPublicDisplayName(user),
  };
}

export async function verifyEmail(rawToken: string, email: string) {
  if (!rawToken || !email) {
    throw new Error("Invalid verification link");
  }

  const hashed = hashToken(rawToken);
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email.trim().toLowerCase(), token: hashed } },
  });

  if (!record || record.expires < new Date()) {
    throw new Error("Verification link is invalid or has expired");
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: record.identifier, token: record.token } },
  });
}

export async function requestPasswordReset(email: string) {
  const normalized = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });

  // Enumeration-safe: silently no-op if the account doesn't exist.
  if (!user) return;

  const rawToken = generateToken();
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: hashToken(rawToken),
      expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
    },
  });

  const resetUrl = `${process.env.AUTH_URL || "http://localhost:3000"}/reset-password/${rawToken}`;
  await sendPasswordResetEmail(normalized, resetUrl);
}

export async function resetPassword(rawToken: string, newPassword: string) {
  if (!newPassword || newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const hashed = hashToken(rawToken);
  const record = await prisma.passwordResetToken.findUnique({ where: { token: hashed } });

  if (!record || record.expiresAt < new Date()) {
    throw new Error("Reset link is invalid or has expired");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.deleteMany({ where: { userId: record.userId } });
}
