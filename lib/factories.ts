import { prisma } from "./prisma";

export interface FactorySearchParams {
  search?: string;
  province?: string;
  district?: string;
  region?: string;
  workersMin?: number;
  workersMax?: number;
  sort?: string;
  limit?: number;
  offset?: number;
}

export async function searchFactories(params: FactorySearchParams) {
  const {
    search,
    province,
    district,
    region,
    workersMin,
    workersMax,
    sort = "id_desc",
    limit = 20,
    offset = 0,
  } = params;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { operator: { contains: search, mode: "insensitive" } },
    ];
  }

  if (province) {
    where.province = province;
  }

  if (district) {
    where.district = district;
  }

  // Region filtering requires province lookup
  if (region) {
    const regionProvinces = await getRegionProvinces(region);
    if (regionProvinces.length > 0) {
      where.province = { in: regionProvinces };
    }
  }

  if (workersMin !== undefined) {
    where.workers = { ...((where.workers as object) || {}), gte: workersMin };
  }

  if (workersMax !== undefined) {
    where.workers = { ...((where.workers as object) || {}), lte: workersMax };
  }

  // Exclude factories with empty names
  where.name = { not: "" };

  const orderBy = getOrderBy(sort);

  const [data, total] = await Promise.all([
    prisma.factory.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
      select: {
        id: true,
        regNumber: true,
        name: true,
        operator: true,
        businessActivity: true,
        district: true,
        province: true,
        workers: true,
        phone: true,
        type: true,
      },
    }),
    prisma.factory.count({ where }),
  ]);

  return { data, total, limit, offset };
}

export async function getFactoryById(id: number) {
  return prisma.factory.findUnique({
    where: { id },
  });
}

export async function getFactoryReviews(factoryId: number) {
  const [reviews, stats] = await Promise.all([
    prisma.review.findMany({
      where: { factoryId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        workerRole: true,
        countryFrom: true,
        ratingSalary: true,
        ratingOt: true,
        ratingHousing: true,
        reviewText: true,
        createdAt: true,
      },
    }),
    prisma.review.aggregate({
      where: { factoryId },
      _count: true,
      _avg: {
        ratingSalary: true,
        ratingOt: true,
        ratingHousing: true,
      },
    }),
  ]);

  const avgOverall =
    stats._avg.ratingSalary && stats._avg.ratingOt && stats._avg.ratingHousing
      ? (stats._avg.ratingSalary + stats._avg.ratingOt + stats._avg.ratingHousing) / 3
      : null;

  return {
    data: reviews,
    stats: {
      count: stats._count,
      avgSalary: stats._avg.ratingSalary,
      avgOt: stats._avg.ratingOt,
      avgHousing: stats._avg.ratingHousing,
      avgOverall: avgOverall ? Math.round(avgOverall * 10) / 10 : null,
    },
  };
}

export async function getProvinces() {
  const provinces = await prisma.factory.findMany({
    select: { province: true },
    distinct: ["province"],
    where: { province: { not: null } },
    orderBy: { province: "asc" },
  });

  return provinces.map((p: { province: string | null }) => p.province).filter(Boolean) as string[];
}

export async function getRegions() {
  return [
    { id: "Bangkok_and_Central", name: "Bangkok & Central" },
    { id: "Northern", name: "Northern" },
    { id: "Northeastern", name: "Northeastern" },
    { id: "Eastern", name: "Eastern" },
    { id: "Western", name: "Western" },
    { id: "Southern", name: "Southern" },
  ];
}

async function getRegionProvinces(region: string): Promise<string[]> {
  // This uses the province_districts.json mapping
  // For now, return empty - we'll implement the full mapping later
  const PROVINCE_REGION: Record<string, string> = {
    // Bangkok & Central
    กรุงเทพมหานคร: "Bangkok_and_Central",
    สมุทรปราการ: "Bangkok_and_Central",
    นนทบุรี: "Bangkok_and_Central",
    ปทุมธานี: "Bangkok_and_Central",
    พระนครศรีอยุธยา: "Bangkok_and_Central",
    อ่างทอง: "Bangkok_and_Central",
    ลพบุรี: "Bangkok_and_Central",
    สิงห์บุรี: "Bangkok_and_Central",
    ชัยนาท: "Bangkok_and_Central",
    สระบุรี: "Bangkok_and_Central",
    นครนายก: "Bangkok_and_Central",
    นครสวรรค์: "Bangkok_and_Central",
    อุทัยธานี: "Bangkok_and_Central",
    กำแพงเพชร: "Bangkok_and_Central",
    สุโขทัย: "Bangkok_and_Central",
    พิษณุโลก: "Bangkok_and_Central",
    พิจิตร: "Bangkok_and_Central",
    เพชรบูรณ์: "Bangkok_and_Central",
    สุพรรณบุรี: "Bangkok_and_Central",
    นครปฐม: "Bangkok_and_Central",
    สมุทรสาคร: "Bangkok_and_Central",
    สมุทรสงคราม: "Bangkok_and_Central",
    // Northern
    เชียงใหม่: "Northern",
    ลำพูน: "Northern",
    ลำปาง: "Northern",
    อุตรดิตถ์: "Northern",
    แพร่: "Northern",
    น่าน: "Northern",
    พะเยา: "Northern",
    เชียงราย: "Northern",
    แม่ฮ่องสอน: "Northern",
    // Northeastern
    นครราชสีมา: "Northeastern",
    บุรีรัมย์: "Northeastern",
    สุรินทร์: "Northeastern",
    ศรีสะเกษ: "Northeastern",
    อุบลราชธานี: "Northeastern",
    ยโสธร: "Northeastern",
    ชัยภูมิ: "Northeastern",
    อำนาจเจริญ: "Northeastern",
    บึงกาฬ: "Northeastern",
    หนองบัวลำภู: "Northeastern",
    ขอนแก่น: "Northeastern",
    อุดรธานี: "Northeastern",
    เลย: "Northeastern",
    หนองคาย: "Northeastern",
    มหาสารคาม: "Northeastern",
    ร้อยเอ็ด: "Northeastern",
    กาฬสินธุ์: "Northeastern",
    สกลนคร: "Northeastern",
    นครพนม: "Northeastern",
    มุกดาหาร: "Northeastern",
    // Eastern
    ชลบุรี: "Eastern",
    ระยอง: "Eastern",
    จันทบุรี: "Eastern",
    ตราด: "Eastern",
    ฉะเชิงเทรา: "Eastern",
    ปราจีนบุรี: "Eastern",
    สระแก้ว: "Eastern",
    // Western
    ตาก: "Western",
    ราชบุรี: "Western",
    กาญจนบุรี: "Western",
    เพชรบุรี: "Western",
    ประจวบคีรีขันธ์: "Western",
    // Southern
    นครศรีธรรมราช: "Southern",
    กระบี่: "Southern",
    พังงา: "Southern",
    ภูเก็ต: "Southern",
    สุราษฎร์ธานี: "Southern",
    ระนอง: "Southern",
    ชุมพร: "Southern",
    สงขลา: "Southern",
    สตูล: "Southern",
    ตรัง: "Southern",
    พัทลุง: "Southern",
    ปัตตานี: "Southern",
    ยะลา: "Southern",
    นราธิวาส: "Southern",
  };

  return Object.entries(PROVINCE_REGION)
    .filter(([, r]) => r === region)
    .map(([province]) => province);
}

export async function createPublicFactory(data: {
  name: string;
  regNumber?: string;
  operator?: string;
  businessActivity?: string;
  houseNumber?: string;
  village?: string;
  soi?: string;
  road?: string;
  subdistrict?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
  type?: string;
  workers?: number;
  country?: string;
}) {
  return prisma.factory.create({
    data: {
      name: data.name,
      regNumber: data.regNumber || null,
      operator: data.operator || null,
      businessActivity: data.businessActivity || null,
      houseNumber: data.houseNumber || null,
      village: data.village || null,
      soi: data.soi || null,
      road: data.road || null,
      subdistrict: data.subdistrict || null,
      district: data.district || null,
      province: data.province || null,
      postalCode: data.postalCode || null,
      phone: data.phone || null,
      type: data.type || null,
      workers: data.workers || null,
      country: data.country || "Thailand",
      status: "pending",
    },
  });
}

function getOrderBy(sort: string) {
  const sortOptions: Record<string, object> = {
    name_asc: { name: "asc" },
    name_desc: { name: "desc" },
    workers_asc: { workers: "asc" },
    workers_desc: { workers: "desc" },
    id_desc: { id: "desc" },
    newest: { id: "desc" },
  };

  return sortOptions[sort] || sortOptions.id_desc;
}
