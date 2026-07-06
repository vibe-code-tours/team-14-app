import { NextResponse } from "next/server";
import { getProvinces } from "@/lib/factories";

export async function GET() {
  try {
    const provinces = await getProvinces();
    return NextResponse.json({ data: provinces });
  } catch (error) {
    console.error("Error getting provinces:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
