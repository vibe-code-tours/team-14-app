import { NextRequest, NextResponse } from "next/server";
import { getAdminAdmins } from "@/lib/admin-users";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;

  const params = {
    search: searchParams.get("search") || undefined,
    limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20,
    offset: searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0,
  };

  try {
    const result = await getAdminAdmins(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
