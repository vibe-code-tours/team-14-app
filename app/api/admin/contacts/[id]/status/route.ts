import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const messageId = parseInt(id);

  if (isNaN(messageId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !["unread", "read", "replied"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.contactMessage.update({
      where: { id: messageId },
      data: { status },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Error updating contact message:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const messageId = parseInt(id);

  if (isNaN(messageId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.contactMessage.delete({
      where: { id: messageId },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
