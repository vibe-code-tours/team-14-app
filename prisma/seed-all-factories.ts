import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'xlsx';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });
const regionsPath = path.join(__dirname, 'all_reginon');

// --- Column Mapping Configuration ---
// Maps Excel column headers (English) to Prisma model fields.
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
// --- End Configuration ---

function toPrismaFactory(row: any) {
  const factoryData: any = {};
  for (const [xlsHeader, prismaField] of Object.entries(COLUMN_MAP)) {
    if (row[xlsHeader] !== undefined && row[xlsHeader] !== null) {
      let value = row[xlsHeader];
      // Convert to number if the field expects it
      if (['workers', 'capitalBaht', 'horsepower'].includes(prismaField)) {
        value = Number(value);
        if (isNaN(value)) {
          value = null;
        }
      }
      factoryData[prismaField] = value;
    }
  }

  // Add default values
  factoryData.country = 'Thailand';
  factoryData.status = 'approved'; // Auto-approve all imported factories

  // Ensure required 'name' field exists
  if (!factoryData.name || String(factoryData.name).trim() === '') {
    return null;
  }

  return factoryData;
}

async function seedFile(filePath: string) {
  console.log(`  - Processing file: ${path.basename(filePath)}`);
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // Use `defval: null` to avoid empty strings for blank cells
    const data = xlsx.utils.sheet_to_json(sheet, { defval: null });

    let createdCount = 0;
    for (const row of data) {
      const factoryData = toPrismaFactory(row);

      if (!factoryData || !factoryData.regNumber) {
        continue; // Skip rows without a name or registration number
      }

      try {
        await prisma.factory.upsert({
          where: { regNumber: String(factoryData.regNumber) },
          update: factoryData,
          create: factoryData,
        });
        createdCount++;
      } catch (e: any) {
        if (e.code === 'P2002') {
          // Unique constraint failed, already exists. This is expected with upsert but good to be aware of.
        } else {
          console.error(`    - Error processing row for regNumber ${factoryData.regNumber}:`, e.message);
        }
      }
    }
    console.log(`    - Found ${data.length} rows. Upserted ${createdCount} factories.`);
  } catch (error) {
    console.error(`  - Failed to process file ${filePath}:`, error);
  }
}

async function main() {
  console.log('🌱 Starting comprehensive factory seeding...');

  // 1. Delete all existing factories to ensure a clean slate
  console.log('🗑️ Deleting all existing factories...');
  await prisma.factory.deleteMany({});
  console.log('✅ Existing factories deleted.');

  // 2. Walk through all region/province/district directories
  const regionDirs = fs.readdirSync(regionsPath, { withFileTypes: true });

  for (const regionDir of regionDirs) {
    if (!regionDir.isDirectory()) continue;
    console.log(`\n➡️ Processing Region: ${regionDir.name}`);
    const provinceDirsPath = path.join(regionsPath, regionDir.name);
    const provinceDirs = fs.readdirSync(provinceDirsPath, { withFileTypes: true });

    for (const provinceDir of provinceDirs) {
      if (!provinceDir.isDirectory()) continue;
      const districtFilesPath = path.join(provinceDirsPath, provinceDir.name);
      const districtFiles = fs.readdirSync(districtFilesPath, { withFileTypes: true });

      for (const districtFile of districtFiles) {
        if (districtFile.isFile() && (districtFile.name.endsWith('.xls') || districtFile.name.endsWith('.xlsx'))) {
          await seedFile(path.join(districtFilesPath, districtFile.name));
        }
      }
    }
  }

  console.log('\n✅ Comprehensive factory seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ An error occurred during the seeding process:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });