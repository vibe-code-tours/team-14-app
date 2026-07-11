import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { changeAdminPassword } from "@/lib/admin-profile";

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    await changeAdminPassword(session.user.email, currentPassword, newPassword);
    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Server error";
    const status = message.includes("incorrect") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
