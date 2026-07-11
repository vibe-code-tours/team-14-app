import { NextRequest, NextResponse } from "next/server";
import { searchFactories, createPublicFactory } from "@/lib/factories";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const params = {
    search: searchParams.get("search") || undefined,
    province: searchParams.get("province") || undefined,
    district: searchParams.get("district") || undefined,
    region: searchParams.get("region") || undefined,
    workersMin: searchParams.get("workers_min")
      ? parseInt(searchParams.get("workers_min")!)
      : undefined,
    workersMax: searchParams.get("workers_max")
      ? parseInt(searchParams.get("workers_max")!)
      : undefined,
    sort: searchParams.get("sort") || undefined,
    limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20,
    offset: searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0,
  };

  try {
    const result = await searchFactories(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error searching factories:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Factory name is required" },
        { status: 400 }
      );
    }

    const factory = await createPublicFactory({
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
    });

    return NextResponse.json(factory, { status: 201 });
  } catch (error) {
    console.error("Error creating factory:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
