import { prisma } from "./prisma";
import type { UserStatus } from "@prisma/client";

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
