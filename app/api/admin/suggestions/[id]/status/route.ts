import { NextRequest, NextResponse } from "next/server";
import { updateSuggestionStatus } from "@/lib/suggestions";
import { getAdminSession } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string } > }
) {
  const session = await getAdminSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const result = await updateSuggestionStatus(parseInt(id), status);

    return NextResponse.json({ message: "Status updated", data: result });
  } catch (error) {
    console.error("Error updating status:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
