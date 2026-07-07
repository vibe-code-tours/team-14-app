import { NextResponse } from "next/server";
import { getRegions } from "@/lib/factories";

export async function GET() {
  try {
    const regions = await getRegions();
    return NextResponse.json({ data: regions });
  } catch (error) {
    console.error("Error getting regions:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
