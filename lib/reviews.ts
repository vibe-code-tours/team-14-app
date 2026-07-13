import { prisma } from "./prisma";

export interface CreateReviewInput {
  factoryId?: number;
  organizationId?: number;
  userId?: number;
  workerRole: string;
  countryFrom: string;
  ratingSalary: number;
  ratingOt: number;
  ratingHousing: number;
  reviewText: string;
}

export async function createReview(input: CreateReviewInput) {
  // Validate that exactly one ID is provided
  if ((!input.factoryId && !input.organizationId) || (input.factoryId && input.organizationId)) {
    throw new Error("Review must be linked to either a factory or an organization");
  }

  // Validate ratings
  const ratings = [input.ratingSalary, input.ratingOt, input.ratingHousing];
  if (!ratings.every((r) => r >= 1 && r <= 5)) {
    throw new Error("Ratings must be between 1 and 5");
  }

  // Verify the linked entity exists
  if (input.factoryId) {
    const factory = await prisma.factory.findUnique({ where: { id: input.factoryId } });
    if (!factory) throw new Error("Factory not found");
  }

  if (input.organizationId) {
    const org = await prisma.suggestedOrganization.findUnique({
      where: { id: input.organizationId },
    });
    if (!org) throw new Error("Organization not found");
  }

  return prisma.review.create({
    data: {
      factoryId: input.factoryId || null,
      organizationId: input.organizationId || null,
      userId: input.userId || null,
      isVisible: false,
      workerRole: input.workerRole.trim(),
      countryFrom: input.countryFrom.trim(),
      ratingSalary: input.ratingSalary,
      ratingOt: input.ratingOt,
      ratingHousing: input.ratingHousing,
      reviewText: input.reviewText.trim(),
    },
    select: {
      id: true,
      createdAt: true,
    },
  });
}

export async function getReviewsByOrganization(organizationId: number) {
  const [reviews, stats] = await Promise.all([
    prisma.review.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        workerRole: true,
        countryFrom: true,
        ratingSalary: true,
        ratingOt: true,
        ratingHousing: true,
        reviewText: true,
        createdAt: true,
      },
    }),
    prisma.review.aggregate({
      where: { organizationId },
      _count: true,
      _avg: {
        ratingSalary: true,
        ratingOt: true,
        ratingHousing: true,
      },
    }),
  ]);

  const avgOverall =
    stats._avg.ratingSalary && stats._avg.ratingOt && stats._avg.ratingHousing
      ? (stats._avg.ratingSalary + stats._avg.ratingOt + stats._avg.ratingHousing) / 3
      : null;

  return {
    data: reviews,
    stats: {
      count: stats._count,
      avgSalary: stats._avg.ratingSalary,
      avgOt: stats._avg.ratingOt,
      avgHousing: stats._avg.ratingHousing,
      avgOverall: avgOverall ? Math.round(avgOverall * 10) / 10 : null,
    },
  };
}
