import { NextRequest, NextResponse } from "next/server";
import { getFactoryReviews } from "@/lib/factories";
import { createReview } from "@/lib/reviews";
import { auth } from "@/auth";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string } > }
) {
  const { id } = await params;

  try {
    const result = await getFactoryReviews(parseInt(id));
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error getting reviews:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string } > }
) {
  const { id } = await params;

  try {
    // Require authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Rate limiting
    const ip = getClientIp(request);
    const userId = session.user.id;
    const rateKey = `review:${userId}:${ip}`;

    const { allowed } = await checkRateLimit(rateKey, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many review submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { worker_role, country_from, rating_salary, rating_ot, rating_housing, review_text } = body;

    // Validation
    if (!worker_role?.trim() || !country_from?.trim() || !review_text?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (![rating_salary, rating_ot, rating_housing].every((r) => r >= 1 && r <= 5)) {
      return NextResponse.json({ error: "Ratings must be 1-5" }, { status: 400 });
    }

    const result = await createReview({
      factoryId: parseInt(id),
      userId: parseInt(userId),
      workerRole: worker_role,
      countryFrom: country_from,
      ratingSalary: rating_salary,
      ratingOt: rating_ot,
      ratingHousing: rating_housing,
      reviewText: review_text,
    });

    return NextResponse.json({ message: "Review submitted", data: result }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
