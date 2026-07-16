import { NextRequest, NextResponse } from "next/server";
import { searchFactories, createPublicFactory } from "@/lib/factories";
import { auth } from "@/auth";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

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
    // Require authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Rate limiting
    const ip = getClientIp(request);
    const userId = session.user.id;
    const rateKey = `factory:create:${userId}:${ip}`;

    const { allowed } = await checkRateLimit(rateKey, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many factory submissions. Please try again later." },
        { status: 429 }
      );
    }

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
      image: body.image,
      userId: parseInt(userId),
    });

    return NextResponse.json(factory, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    const status = message.includes("already exists") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
