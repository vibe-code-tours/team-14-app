import { NextRequest, NextResponse } from "next/server";
import { searchOrganizations } from "@/lib/suggestions";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const params = {
    search: searchParams.get("search") || undefined,
    country: searchParams.get("country") || undefined,
  };

  try {
    const data = await searchOrganizations(params);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error searching organizations:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
