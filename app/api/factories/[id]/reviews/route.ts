import { NextRequest, NextResponse } from "next/server";
import { getFactoryReviews } from "@/lib/factories";
import { createReview } from "@/lib/reviews";
import { auth } from "@/auth";

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
    const body = await request.json();
    const { worker_role, country_from, rating_salary, rating_ot, rating_housing, review_text } = body;

    // Validation
    if (!worker_role?.trim() || !country_from?.trim() || !review_text?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (![rating_salary, rating_ot, rating_housing].every((r) => r >= 1 && r <= 5)) {
      return NextResponse.json({ error: "Ratings must be 1-5" }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id) : undefined;

    const result = await createReview({
      factoryId: parseInt(id),
      userId,
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
