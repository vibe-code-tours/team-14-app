import { NextRequest, NextResponse } from "next/server";
import { getFactoryById } from "@/lib/factories";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string } > }
) {
  const { id } = await params;

  try {
    const factory = await getFactoryById(parseInt(id));

    if (!factory) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: factory });
  } catch (error) {
    console.error("Error getting factory:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
