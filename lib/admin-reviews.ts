import { prisma } from "./prisma";

export interface AdminReviewSearchParams {
  search?: string;
  visibility?: string;
  limit?: number;
  offset?: number;
}

export async function getAdminReviews(params: AdminReviewSearchParams) {
  const { search, visibility, limit = 20, offset = 0 } = params;

  const where: Record<string, unknown> = {};

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
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      select: {
        id: true,
        workerRole: true,
        countryFrom: true,
        ratingSalary: true,
        ratingOt: true,
        ratingHousing: true,
        reviewText: true,
        isVisible: true,
        createdAt: true,
        factory: {
          select: { name: true },
        },
        organization: {
          select: { name: true },
        },
      },
    }),
    prisma.review.count({ where }),
  ]);

  const data = reviews?.map((r) => ({
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
