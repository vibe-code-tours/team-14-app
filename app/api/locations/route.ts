import { NextRequest, NextResponse } from "next/server";
import {
  REGIONS,
  getProvincesByRegion,
  getAllProvinces,
  getDistrictsByProvince,
} from "@/lib/locations";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  try {
    switch (type) {
      case "regions": {
        return NextResponse.json({ data: REGIONS });
      }

      case "provinces": {
        const region = searchParams.get("region");
        const provinces = region
          ? getProvincesByRegion(region)
          : getAllProvinces();
        return NextResponse.json({ data: provinces });
      }

      case "districts": {
        const province = searchParams.get("province");
        if (!province) {
          return NextResponse.json(
            { error: "Province parameter is required" },
            { status: 400 }
          );
        }
        const districts = getDistrictsByProvince(province);
        if (!districts) {
          return NextResponse.json(
            { error: "Province not found" },
            { status: 404 }
          );
        }
        return NextResponse.json({ data: districts });
      }

      default:
        return NextResponse.json(
          {
            error: "Invalid type parameter. Use: regions, provinces, or districts",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in locations API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
