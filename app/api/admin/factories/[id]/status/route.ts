import { NextRequest, NextResponse } from "next/server";
import { updateFactoryStatus } from "@/lib/admin-factories";
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

    if (!["pending", "approved", "declined"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const factory = await updateFactoryStatus(parseInt(id), status);
    return NextResponse.json(factory);
  } catch (error) {
    console.error("Error updating factory status:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
