import { NextRequest, NextResponse } from "next/server";
import { getAdminFactories, createFactory } from "@/lib/admin-factories";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;

  try {
    const data = await getAdminFactories({
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
      limit: parseInt(searchParams.get("limit") || "20"),
      offset: parseInt(searchParams.get("offset") || "0"),
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting factories:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Factory name is required" },
        { status: 400 }
      );
    }

    const factory = await createFactory({
      name: body.name,
      regNumber: body.regNumber,
      operator: body.operator,
      businessActivity: body.businessActivity,
      houseNumber: body.houseNumber,
      village: body.village,
      soi: body.soi,
      road: body.road,
      subdistrict: body.subdistrict,
      district: body.district,
      province: body.province,
      postalCode: body.postalCode,
      phone: body.phone,
      type: body.type,
      workers: body.workers,
      country: body.country,
      status: body.status,
      image: body.image,
    });

    return NextResponse.json(factory, { status: 201 });
  } catch (error) {
    console.error("Error creating factory:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
