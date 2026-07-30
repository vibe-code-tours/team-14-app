import { NextRequest, NextResponse } from "next/server";
import { searchFactories, createPublicFactory } from "@/lib/factories";
import { auth } from "@/auth";
import provinceMapping from "@/province_mapping.json";
import districtData from "@/province_districts_english.json";
import districtMapping from "@/district_mapping.json";

const REGION_CODE_MAP: Record<string, string> = {
  "กทม_และภาคกลาง": "Bangkok_and_Central",
  "ภาคเหนือ": "Northern",
  "ภาคตะวันออกเฉียงเหนือ": "Northeastern",
  "ภาคตะวันออก": "Eastern",
  "ภาคตะวันตก": "Western",
  "ภาคใต้": "Southern",
};

function getThaiDistrict(englishDistrict: string, _thaiProvince?: string): string | undefined {
  const thaiName = (districtMapping as Record<string, string>)[englishDistrict];
  if (thaiName) return thaiName;
  return englishDistrict;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const provinceParam = searchParams.get("province") || undefined;
  const districtParam = searchParams.get("district") || undefined;
  const regionParam = searchParams.get("region") || undefined;

  // Convert English province name → Thai for DB query
  const thaiProvince = provinceParam
    ? (provinceMapping as Record<string, string>)[provinceParam]
    : undefined;

  // Convert English district name → Thai
  const thaiDistrict = districtParam
    ? getThaiDistrict(districtParam, thaiProvince || provinceParam)
    : undefined;

  // Map UI region code to API region code
  const mappedRegion = regionParam ? REGION_CODE_MAP[regionParam] || regionParam : undefined;

  const params = {
    search: searchParams.get("search") || undefined,
    province: thaiProvince,
    district: thaiDistrict,
    region: mappedRegion,
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

    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id) : undefined;

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
      userId,
    });

    return NextResponse.json(factory, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    const status = message.includes("already exists") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}