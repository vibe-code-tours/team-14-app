import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import type { UserStatus } from "@/src/generated/prisma/enums";

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export interface AdminUserSearchParams {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export async function getAdminUsers(params: AdminUserSearchParams) {
  const { search, status, limit = 20, offset = 0 } = params;

  const where: Record<string, unknown> = {
    isAdmin: false,
  };

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { fullName: { contains: search, mode: "insensitive" } },
      { nickname: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && ["active", "blocked"].includes(status)) {
    where.status = status as UserStatus;
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { id: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        email: true,
        fullName: true,
        nickname: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total, limit, offset };
}

export async function getAdminAdmins(params: { search?: string; limit?: number; offset?: number }) {
  const { search, limit = 20, offset = 0 } = params;

  const where: Record<string, unknown> = {
    isAdmin: true,
  };

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { fullName: { contains: search, mode: "insensitive" } },
      { nickname: { contains: search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { id: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        email: true,
        fullName: true,
        nickname: true,
        role: true,
        isSuperAdmin: true,
        status: true,
        emailVerified: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total, limit, offset };
}

export async function updateUserStatus(id: number, status: UserStatus) {
  return prisma.user.update({
    where: { id },
    data: { status },
  });
}

export async function updateUserAdminStatus(id: number, isAdmin: boolean) {
  return prisma.user.update({
    where: { id },
    data: {
      isAdmin,
      role: isAdmin ? "administrator" : "user",
    },
  });
}

export async function createAdmin(input: {
  email: string;
  fullName: string;
  nickname?: string;
}) {
  const email = input.email.trim().toLowerCase();

  const existing = await prisma.user.findFirst({
    where: { email, isAdmin: true },
  });
  if (existing) {
    throw new Error("An admin account with this email already exists");
  }

  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName: input.fullName,
      nickname: input.nickname || null,
      isAdmin: true,
      isSuperAdmin: false,
      role: "administrator",
      emailVerified: new Date(),
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      nickname: true,
      isAdmin: true,
      isSuperAdmin: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return { user, password };
}
