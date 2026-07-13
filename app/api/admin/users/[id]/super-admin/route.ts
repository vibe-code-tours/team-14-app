import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session?.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { isSuperAdmin } = await request.json();

    if (typeof isSuperAdmin !== "boolean") {
      return NextResponse.json(
        { error: "Invalid isSuperAdmin value" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { isSuperAdmin },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating super admin status:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
