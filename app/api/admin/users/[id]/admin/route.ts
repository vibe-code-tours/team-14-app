import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { updateUserAdminStatus } from "@/lib/admin-users";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const { isAdmin } = await request.json();

    if (typeof isAdmin !== "boolean") {
      return NextResponse.json(
        { error: "Invalid isAdmin value" },
        { status: 400 }
      );
    }

    const user = await updateUserAdminStatus(parseInt(id), isAdmin);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating admin status:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
