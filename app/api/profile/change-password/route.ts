import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { changePassword } from "@/lib/users";

export async function PUT(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    await changePassword(Number(session.user.id), currentPassword, newPassword);

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Server error";
    const status = message.includes("incorrect") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
