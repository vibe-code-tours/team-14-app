import { NextRequest, NextResponse } from "next/server";
import { getPendingSuggestions } from "@/lib/suggestions";
import { verifyAdminAuth } from "@/lib/admin";

export async function GET(request: NextRequest) {
  // Verify admin authentication
  if (!verifyAdminAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") || undefined;

  try {
    const data = await getPendingSuggestions(status);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error getting suggestions:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
