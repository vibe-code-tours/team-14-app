import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Load province-districts mapping
let provinceDistricts: Record<string, string[]> | null = null;

async function loadProvinceDistricts() {
  if (provinceDistricts) return provinceDistricts;

  try {
    const filePath = path.join(process.cwd(), "province_districts.json");
    const data = await fs.readFile(filePath, "utf-8");
    provinceDistricts = JSON.parse(data);
    return provinceDistricts;
  } catch (error) {
    console.error("Error loading province_districts.json:", error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ province: string }> }
) {
  const { province } = await params;

  try {
    const districtData = await loadProvinceDistricts();

    if (!districtData) {
      return NextResponse.json({ error: "District data not available" }, { status: 500 });
    }

    const districts = districtData[province];

    if (!districts) {
      return NextResponse.json({ error: "Province not found" }, { status: 404 });
    }

    return NextResponse.json({ data: districts });
  } catch (error) {
    console.error("Error getting districts:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
