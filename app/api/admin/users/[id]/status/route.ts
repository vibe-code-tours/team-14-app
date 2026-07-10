import { NextRequest, NextResponse } from "next/server";
import { updateUserStatus } from "@/lib/admin-users";
import { auth } from "@/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { status } = await request.json();

    if (!["active", "blocked"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const user = await updateUserStatus(parseInt(id), status);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
