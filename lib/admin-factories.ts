import { prisma } from "./prisma";
import type { FactoryStatus } from "@/src/generated/prisma/enums";

export interface AdminFactorySearchParams {
  search?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export async function getAdminFactories(params: AdminFactorySearchParams) {
  const { search, status, limit = 20, offset = 0 } = params;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { operator: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && ["pending", "approved", "declined"].includes(status)) {
    where.status = status as FactoryStatus;
  }

  const [data, total] = await Promise.all([
    prisma.factory.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        regNumber: true,
        name: true,
        operator: true,
        district: true,
        province: true,
        workers: true,
        country: true,
        type: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.factory.count({ where }),
  ]);

  return { data, total, limit, offset };
}

export async function getAdminFactoryById(id: number) {
  return prisma.factory.findUnique({ where: { id } });
}

export async function createFactory(data: {
  name: string;
  regNumber?: string;
  operator?: string;
  businessActivity?: string;
  houseNumber?: string;
  village?: string;
  soi?: string;
  road?: string;
  subdistrict?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
  type?: string;
  workers?: number;
  country?: string;
  status?: FactoryStatus;
}) {
  return prisma.factory.create({
    data: {
      name: data.name,
      regNumber: data.regNumber || null,
      operator: data.operator || null,
      businessActivity: data.businessActivity || null,
      houseNumber: data.houseNumber || null,
      village: data.village || null,
      soi: data.soi || null,
      road: data.road || null,
      subdistrict: data.subdistrict || null,
      district: data.district || null,
      province: data.province || null,
      postalCode: data.postalCode || null,
      phone: data.phone || null,
      type: data.type || null,
      workers: data.workers || null,
      country: data.country || "Thailand",
      status: data.status || "pending",
    },
  });
}

export async function updateFactory(
  id: number,
  data: {
    name?: string;
    regNumber?: string;
    operator?: string;
    businessActivity?: string;
    houseNumber?: string;
    village?: string;
    soi?: string;
    road?: string;
    subdistrict?: string;
    district?: string;
    province?: string;
    postalCode?: string;
    phone?: string;
    type?: string;
    workers?: number;
    country?: string;
    status?: FactoryStatus;
  }
) {
  return prisma.factory.update({
    where: { id },
    data,
  });
}

export async function updateFactoryStatus(
  id: number,
  status: FactoryStatus
) {
  return prisma.factory.update({
    where: { id },
    data: { status },
  });
}

export async function getAdminStats() {
  const [totalFactories, pendingFactories, totalReviews, visibleReviews] =
    await Promise.all([
      prisma.factory.count(),
      prisma.factory.count({ where: { status: "pending" } }),
      prisma.review.count(),
      prisma.review.count({ where: { isVisible: true } }),
    ]);

  return { totalFactories, pendingFactories, totalReviews, visibleReviews };
}
