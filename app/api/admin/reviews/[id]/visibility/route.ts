import { NextRequest, NextResponse } from "next/server";
import { toggleReviewVisibility } from "@/lib/admin-reviews";
import { getAdminSession } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const result = await toggleReviewVisibility(parseInt(id));
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error toggling review visibility:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
