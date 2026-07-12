import { NextRequest, NextResponse } from "next/server";
import { getAdminFactoryById, updateFactory } from "@/lib/admin-factories";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const factory = await getAdminFactoryById(parseInt(id));
    if (!factory) {
      return NextResponse.json({ error: "Factory not found" }, { status: 404 });
    }
    return NextResponse.json(factory);
  } catch (error) {
    console.error("Error getting factory:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const factory = await updateFactory(parseInt(id), body);
    return NextResponse.json(factory);
  } catch (error) {
    console.error("Error updating factory:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
