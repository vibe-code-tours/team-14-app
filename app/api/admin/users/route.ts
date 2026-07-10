import { NextRequest, NextResponse } from "next/server";
import { getAdminUsers } from "@/lib/admin-users";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;

  const params = {
    search: searchParams.get("search") || undefined,
    status: searchParams.get("status") || undefined,
    limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20,
    offset: searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0,
  };

  try {
    const result = await getAdminUsers(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
