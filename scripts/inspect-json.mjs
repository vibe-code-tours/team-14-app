import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'province_districts.json');
const data = fs.readFileSync(filePath, 'utf-8');
const jsonData = JSON.parse(data);

console.log('Districts for Narathiwat:', jsonData['Narathiwat']);