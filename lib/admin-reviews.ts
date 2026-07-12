import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export interface AdminReviewSearchParams {
  search?: string;
  visibility?: string;
  limit?: number;
  offset?: number;
}

const adminReviewSelect = {
  id: true,
  workerRole: true,
  countryFrom: true,
  ratingSalary: true,
  ratingOt: true,
  ratingHousing: true,
  reviewText: true,
  isVisible: true,
  createdAt: true,
  factory: { select: { name: true } },
  organization: { select: { name: true } },
  user: { select: { id: true, fullName: true, nickname: true } },
} satisfies Prisma.ReviewSelect;

type AdminReviewPayload = Prisma.ReviewGetPayload<{ select: typeof adminReviewSelect }>;

export async function getAdminReviews(params: AdminReviewSearchParams) {
  const { search, visibility, limit = 20, offset = 0 } = params;

  const where: Prisma.ReviewWhereInput = {};

  if (search) {
    where.OR = [
      { workerRole: { contains: search, mode: "insensitive" } },
      { reviewText: { contains: search, mode: "insensitive" } },
      { factory: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (visibility === "visible") {
    where.isVisible = true;
  } else if (visibility === "hidden") {
    where.isVisible = false;
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { id: "desc" },
      take: limit,
      skip: offset,
      select: adminReviewSelect,
    }),
    prisma.review.count({ where }),
  ]);

  const data = reviews?.map((r: AdminReviewPayload) => ({
    id: r.id,
    workerRole: r.workerRole,
    countryFrom: r.countryFrom,
    ratingSalary: r.ratingSalary,
    ratingOt: r.ratingOt,
    ratingHousing: r.ratingHousing,
    reviewText: r.reviewText,
    isVisible: r.isVisible,
    createdAt: r.createdAt,
    factoryName: r.factory?.name ?? null,
    organizationName: r.organization?.name ?? null,
    user: r.user ?? null,
  }));

  return { data, total, limit, offset };
}

export async function toggleReviewVisibility(id: number) {
  const review = await prisma.review.findUnique({
    where: { id },
    select: { isVisible: true },
  });

  if (!review) throw new Error("Review not found");

  return prisma.review.update({
    where: { id },
    data: { isVisible: !review.isVisible },
    select: { id: true, isVisible: true },
  });
}
