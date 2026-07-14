import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export interface AdminProfile {
  id: number;
  email: string;
  fullName: string;
  nickname: string | null;
  image: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAdminProfile(email: string): Promise<AdminProfile | null> {
  const user = await prisma.user.findFirst({
    where: { email, isAdmin: true },
    select: {
      id: true,
      email: true,
      fullName: true,
      nickname: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function updateAdminProfile(
  email: string,
  data: { fullName?: string; nickname?: string; image?: string | null }
): Promise<AdminProfile> {
  const updateData: Record<string, unknown> = {};

  if (data.fullName !== undefined) {
    updateData.fullName = data.fullName.trim();
  }
  if (data.nickname !== undefined) {
    updateData.nickname = data.nickname?.trim() || null;
  }
  if (data.image !== undefined) {
    updateData.image = data.image;
  }

  const existing = await prisma.user.findFirst({
    where: { email, isAdmin: true },
    select: { id: true },
  });
  if (!existing) throw new Error("Admin not found");

  const user = await prisma.user.update({
    where: { id: existing.id },
    data: updateData,
    select: {
      id: true,
      email: true,
      fullName: true,
      nickname: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function changeAdminPassword(
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  if (!newPassword || newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const user = await prisma.user.findFirst({
    where: { email, isAdmin: true },
    select: { id: true, passwordHash: true },
  });

  if (!user || !user.passwordHash) {
    throw new Error("No password set for this account");
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    throw new Error("Current password is incorrect");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });
}
