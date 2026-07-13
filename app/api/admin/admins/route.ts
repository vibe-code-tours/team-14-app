import { NextRequest, NextResponse } from "next/server";
import { getAdminAdmins, createAdmin } from "@/lib/admin-users";
import { getAdminSession } from "@/lib/admin-auth";
import { sendAdminCredentialsEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;

  const params = {
    search: searchParams.get("search") || undefined,
    limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20,
    offset: searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0,
  };

  try {
    const result = await getAdminAdmins(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { email, fullName, nickname } = await request.json();

    if (!email || !fullName) {
      return NextResponse.json(
        { error: "Email and full name are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const result = await createAdmin({ email, fullName, nickname });

    const loginUrl = `${process.env.AUTH_URL || "http://localhost:3000"}/admin/login`;
    await sendAdminCredentialsEmail(email, fullName, result.password, loginUrl);

    return NextResponse.json({
      message: "Admin created successfully",
      user: result.user,
      password: result.password,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    const status = message.includes("already exists") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
