import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';

const regionsPath = path.join(process.cwd(), 'prisma', 'all_reginon');
const outputPath = path.join(process.cwd(), 'district_mapping.json');

const districtMapping = {};

async function generateMapping() {
  const regionDirs = fs.readdirSync(regionsPath, { withFileTypes: true });

  for (const regionDir of regionDirs) {
    if (!regionDir.isDirectory()) continue;
    const provinceDirsPath = path.join(regionsPath, regionDir.name);
    const provinceDirs = fs.readdirSync(provinceDirsPath, { withFileTypes: true });

    for (const provinceDir of provinceDirs) {
      if (!provinceDir.isDirectory()) continue;
      
      const districtFilesPath = path.join(provinceDirsPath, provinceDir.name);
      const districtFiles = fs.readdirSync(districtFilesPath, { withFileTypes: true });

      for (const districtFile of districtFiles) {
        if (districtFile.isFile() && (districtFile.name.endsWith('.xls') || districtFile.name.endsWith('.xlsx'))) {
            const englishDistrict = districtFile.name.split('_').slice(1).join(' ').replace(/\.(xls|xlsx)$/, '');
            let thaiDistrict = null;

            try {
                const workbook = xlsx.readFile(path.join(districtFilesPath, districtFile.name));
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

                if (data.length > 1) {
                    const headers = data[0];
                    const districtIndex = headers.indexOf('District');
                    if (districtIndex !== -1 && data[1] && data[1][districtIndex]) {
                        thaiDistrict = data[1][districtIndex].trim();
                    }
                }
            } catch (e) {
                console.error(`Could not process file ${districtFile.name}:`, e.message);
            }

            if (englishDistrict && thaiDistrict && !districtMapping[englishDistrict]) {
                districtMapping[englishDistrict] = thaiDistrict;
                console.log(`Mapped: ${englishDistrict} -> ${thaiDistrict}`);
            }
        }
      }
    }
  }

  // Handle some specific naming inconsistencies found during testing
  districtMapping["King-amphoebangdi"] = "บางดี";
  districtMapping["King-amphoekapang"] = "กะปาง";

  // Many more manual mappings might be needed if filenames are inconsistent.

  fs.writeFileSync(outputPath, JSON.stringify(districtMapping, null, 2));
  console.log(`\nGenerated district_mapping.json with ${Object.keys(districtMapping).length} districts.`);
}

generateMapping();