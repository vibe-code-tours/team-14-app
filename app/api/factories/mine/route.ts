import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getFactoriesByUserId } from "@/lib/factories";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const searchParams = request.nextUrl.searchParams;

    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20;
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0;

    const result = await getFactoriesByUserId(userId, limit, offset);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error getting user factories:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
