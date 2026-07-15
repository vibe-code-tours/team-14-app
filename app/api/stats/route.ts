import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Count active users (excluding blocked users)
    const activeUsers = await prisma.user.count({
      where: {
        status: "active",
      },
    });

    // Count approved factories (partners)
    const approvedFactories = await prisma.factory.count({
      where: {
        status: "approved",
      },
    });

    // Count visible reviews
    const visibleReviews = await prisma.review.count({
      where: {
        isVisible: true,
      },
    });

    // Calculate satisfaction rate from visible reviews
    const reviewStats = await prisma.review.aggregate({
      where: {
        isVisible: true,
      },
      _avg: {
        ratingSalary: true,
        ratingOt: true,
        ratingHousing: true,
      },
    });

    let satisfactionRate = 0;
    if (reviewStats._avg.ratingSalary && reviewStats._avg.ratingOt && reviewStats._avg.ratingHousing) {
      const avgOverall =
        (reviewStats._avg.ratingSalary + reviewStats._avg.ratingOt + reviewStats._avg.ratingHousing) / 3;
      // Convert 1-5 rating to percentage (1 = 0%, 5 = 100%)
      satisfactionRate = Math.round(((avgOverall - 1) / 4) * 100);
    }

    return NextResponse.json({
      activeUsers,
      partners: approvedFactories,
      satisfactionRate,
      reviews: visibleReviews,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
