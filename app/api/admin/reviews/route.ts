import { NextRequest, NextResponse } from "next/server";
import { getAdminReviews } from "@/lib/admin-reviews";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;

  try {
    const data = await getAdminReviews({
      search: searchParams.get("search") || undefined,
      visibility: searchParams.get("visibility") || undefined,
      limit: parseInt(searchParams.get("limit") || "20"),
      offset: parseInt(searchParams.get("offset") || "0"),
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting reviews:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
