import { NextRequest, NextResponse } from "next/server";
import { createSuggestion } from "@/lib/suggestions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, country, city } = body;

    // Validation
    if (!name?.trim() || !country?.trim()) {
      return NextResponse.json({ error: "Name and country are required" }, { status: 400 });
    }

    if (!["factory", "agency"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const result = await createSuggestion({ name, type, country, city });

    return NextResponse.json({ message: "Suggestion submitted", data: result }, { status: 201 });
  } catch (error) {
    console.error("Error creating suggestion:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
