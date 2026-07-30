import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const regionsPath = path.join(process.cwd(), 'prisma', 'all_reginon');
const outputPath = path.join(process.cwd(), 'province_mapping.json');

const provinceMapping = {};

async function generateMapping() {
  const regionDirs = fs.readdirSync(regionsPath, { withFileTypes: true });

  for (const regionDir of regionDirs) {
    if (!regionDir.isDirectory()) continue;
    const provinceDirsPath = path.join(regionsPath, regionDir.name);
    const provinceDirs = fs.readdirSync(provinceDirsPath, { withFileTypes: true });

    for (const provinceDir of provinceDirs) {
      if (!provinceDir.isDirectory()) continue;

      const englishProvince = provinceDir.name.split('_').slice(1).join(' ');
      
      const districtFilesPath = path.join(provinceDirsPath, provinceDir.name);
      const districtFiles = fs.readdirSync(districtFilesPath, { withFileTypes: true });

      let thaiProvince = null;
      for (const districtFile of districtFiles) {
        if (districtFile.isFile() && (districtFile.name.endsWith('.xls') || districtFile.name.endsWith('.xlsx'))) {
            try {
                const workbook = xlsx.readFile(path.join(districtFilesPath, districtFile.name));
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

                if (data.length > 1) {
                    const headers = data[0];
                    const provinceIndex = headers.indexOf('Province');
                    if (provinceIndex !== -1 && data[1][provinceIndex]) {
                        thaiProvince = data[1][provinceIndex].trim();
                        break; // Found it, no need to check other files in this province
                    }
                }
            } catch (e) {
                console.error(`Could not process file ${districtFile.name}:`, e.message);
            }
        }
      }

      if (englishProvince && thaiProvince) {
        provinceMapping[englishProvince] = thaiProvince;
      }
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(provinceMapping, null, 2));
  console.log(`\nGenerated province_mapping.json with ${Object.keys(provinceMapping).length} provinces.`);
}

generateMapping();