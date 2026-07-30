import 'dotenv/config';
import { PrismaClient } from './src/generated/prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import * as xlsx from 'xlsx';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const COLUMN_MAP: Record<string, string> = {
  'Factory_Reg_Number': 'regNumber',
  'Factory_Name': 'name',
  'Operator': 'operator',
  'Business_Activity': 'businessActivity',
  'House_Number': 'houseNumber',
  'Village': 'village',
  'Soi': 'soi',
  'Road': 'road',
  'Subdistrict': 'subdistrict',
  'District': 'district',
  'Province': 'province',
  'Postal_Code': 'postalCode',
  'Phone': 'phone',
  'Type': 'type',
  'Capital_Baht': 'capitalBaht',
  'Workers': 'workers',
  'Horsepower': 'horsepower',
  'TSIC': 'tsic',
  'Old_Reg_Number': 'oldRegNumber',
};

function toPrismaFactory(row: any) {
  const factoryData: any = {};
  for (const [xlsHeader, prismaField] of Object.entries(COLUMN_MAP)) {
    if (row[xlsHeader] !== undefined && row[xlsHeader] !== null) {
      let value = row[xlsHeader];
      if (['workers', 'capitalBaht', 'horsepower'].includes(prismaField)) {
        value = Number(value);
        if (isNaN(value)) {
          value = null;
        }
      }
      factoryData[prismaField] = value;
    }
  }
  factoryData.country = 'Thailand';
  factoryData.status = 'approved';
  if (!factoryData.name || String(factoryData.name).trim() === '') return null;
  return factoryData;
}

async function run() {
  const filePath = 'prisma/all_reginon/2_Northern/50_Chiang_Mai/1_Mueangchiangmai.xls';
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { defval: null });
  
  const factoryData = toPrismaFactory(data[0]);
  console.log('Mapped data:', factoryData);
  
  if (factoryData) {
    const created = await prisma.factory.upsert({
      where: { regNumber: String(factoryData.regNumber) },
      update: factoryData,
      create: factoryData,
    });
    console.log('Saved to DB:', created.name, created.province);
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());