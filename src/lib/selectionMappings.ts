// Region to provinces mapping (English)
import regionsData from '@/province_districts_english.json';

// Reverse map: English province -> Thai province
import provinceMapping from '@/province_mapping.json';

export type RegionData = {
  region: string;
  englishName: string;
  provinces: {
    englishName: string;
    thaiName: string;
    districts: string[];
  }[];
};

const regions: RegionData[] = [
  { region: 'กทม_และภาคกลาง', englishName: 'Bangkok and Central', provinces: [] },
  { region: 'ภาคเหนือ', englishName: 'Northern', provinces: [] },
  { region: 'ภาคตะวันออกเฉียงเหนือ', englishName: 'Northeastern', provinces: [] },
  { region: 'ภาคตะวันออก', englishName: 'Eastern', provinces: [] },
  { region: 'ภาคตะวันตก', englishName: 'Western', provinces: [] },
  { region: 'ภาคใต้', englishName: 'Southern', provinces: [] },
];

// Build full region->province->district tree with Thai mapping
const regionToFolderMap: Record<string, string> = {
  'กทม_และภาคกลาง': 'Bangkok_and_Central',
  'ภาคเหนือ': 'Northern',
  'ภาคตะวันออกเฉียงเหนือ': 'Northeastern',
  'ภาคตะวันออก': 'Eastern',
  'ภาคตะวันตก': 'Western',
  'ภาคใต้': 'Southern',
};

// Map English province names to their correct folder prefixes (from all_reginon)
// This is needed to look up districts

// We'll build this dynamically by scanning the folders
// Province names in English for the dropdown
export const REGION_PROVINCES: Record<string, { englishName: string; thaiName: string }[]> = {
  'กทม_และภาคกลาง': [
    { englishName: 'Bangkok', thaiName: 'กรุงเทพมหานคร' },
    { englishName: 'Samut Prakan', thaiName: 'สมุทรปราการ' },
    { englishName: 'Nonthaburi', thaiName: 'นนทบุรี' },
    { englishName: 'Pathum Thani', thaiName: 'ปทุมธานี' },
    { englishName: 'Phra Nakhon Si Ayutthaya', thaiName: 'พระนครศรีอยุธยา' },
    { englishName: 'Ang Thong', thaiName: 'อ่างทอง' },
    { englishName: 'Lopburi', thaiName: 'ลพบุรี' },
    { englishName: 'Sing Buri', thaiName: 'สิงห์บุรี' },
    { englishName: 'Chai Nat', thaiName: 'ชัยนาท' },
    { englishName: 'Saraburi', thaiName: 'สระบุรี' },
    { englishName: 'Nakhon Nayok', thaiName: 'นครนายก' },
    { englishName: 'Nakhon Sawan', thaiName: 'นครสวรรค์' },
    { englishName: 'Uthai Thani', thaiName: 'อุทัยธานี' },
    { englishName: 'Kamphaeng Phet', thaiName: 'กำแพงเพชร' },
    { englishName: 'Sukhothai', thaiName: 'สุโขทัย' },
    { englishName: 'Phitsanulok', thaiName: 'พิษณุโลก' },
    { englishName: 'Phichit', thaiName: 'พิจิตร' },
    { englishName: 'Phetchabun', thaiName: 'เพชรบูรณ์' },
    { englishName: 'Suphan Buri', thaiName: 'สุพรรณบุรี' },
    { englishName: 'Nakhon Pathom', thaiName: 'นครปฐม' },
    { englishName: 'Samut Sakhon', thaiName: 'สมุทรสาคร' },
    { englishName: 'Samut Songkhram', thaiName: 'สมุทรสงคราม' },
  ],
  'ภาคเหนือ': [
    { englishName: 'Chiang Mai', thaiName: 'เชียงใหม่' },
    { englishName: 'Lamphun', thaiName: 'ลำพูน' },
    { englishName: 'Lampang', thaiName: 'ลำปาง' },
    { englishName: 'Uttaradit', thaiName: 'อุตรดิตถ์' },
    { englishName: 'Phrae', thaiName: 'แพร่' },
    { englishName: 'Nan', thaiName: 'น่าน' },
    { englishName: 'Phayao', thaiName: 'พะเยา' },
    { englishName: 'Chiang Rai', thaiName: 'เชียงราย' },
    { englishName: 'Mae Hong Son', thaiName: 'แม่ฮ่องสอน' },
  ],
  'ภาคตะวันออกเฉียงเหนือ': [
    { englishName: 'Nakhon Ratchasima', thaiName: 'นครราชสีมา' },
    { englishName: 'Buri Ram', thaiName: 'บุรีรัมย์' },
    { englishName: 'Surin', thaiName: 'สุรินทร์' },
    { englishName: 'Si Sa Ket', thaiName: 'ศรีสะเกษ' },
    { englishName: 'Ubon Ratchathani', thaiName: 'อุบลราชธานี' },
    { englishName: 'Yasothon', thaiName: 'ยโสธร' },
    { englishName: 'Chaiyaphum', thaiName: 'ชัยภูมิ' },
    { englishName: 'Amnat Charoen', thaiName: 'อำนาจเจริญ' },
    { englishName: 'Bueng Kan', thaiName: 'บึงกาฬ' },
    { englishName: 'Nong Bua Lam Phu', thaiName: 'หนองบัวลำภู' },
    { englishName: 'Khon Kaen', thaiName: 'ขอนแก่น' },
    { englishName: 'Udon Thani', thaiName: 'อุดรธานี' },
    { englishName: 'Loei', thaiName: 'เลย' },
    { englishName: 'Nong Khai', thaiName: 'หนองคาย' },
    { englishName: 'Maha Sarakham', thaiName: 'มหาสารคาม' },
    { englishName: 'Roi Et', thaiName: 'ร้อยเอ็ด' },
    { englishName: 'Kalasin', thaiName: 'กาฬสินธุ์' },
    { englishName: 'Sakon Nakhon', thaiName: 'สกลนคร' },
    { englishName: 'Nakhon Phanom', thaiName: 'นครพนม' },
    { englishName: 'Mukdahan', thaiName: 'มุกดาหาร' },
  ],
  'ภาคตะวันออก': [
    { englishName: 'Chon Buri', thaiName: 'ชลบุรี' },
    { englishName: 'Rayong', thaiName: 'ระยอง' },
    { englishName: 'Chanthaburi', thaiName: 'จันทบุรี' },
    { englishName: 'Trat', thaiName: 'ตราด' },
    { englishName: 'Chachoengsao', thaiName: 'ฉะเชิงเทรา' },
    { englishName: 'Prachin Buri', thaiName: 'ปราจีนบุรี' },
    { englishName: 'Sa Kaeo', thaiName: 'สระแก้ว' },
  ],
  'ภาคตะวันตก': [
    { englishName: 'Tak', thaiName: 'ตาก' },
    { englishName: 'Ratchaburi', thaiName: 'ราชบุรี' },
    { englishName: 'Kanchanaburi', thaiName: 'กาญจนบุรี' },
    { englishName: 'Phetchaburi', thaiName: 'เพชรบุรี' },
    { englishName: 'Prachuap Khiri Khan', thaiName: 'ประจวบคีรีขันธ์' },
  ],
  'ภาคใต้': [
    { englishName: 'Nakhon Si Thammarat', thaiName: 'นครศรีธรรมราช' },
    { englishName: 'Krabi', thaiName: 'กระบี่' },
    { englishName: 'Phang Nga', thaiName: 'พังงา' },
    { englishName: 'Phuket', thaiName: 'ภูเก็ต' },
    { englishName: 'Surat Thani', thaiName: 'สุราษฎร์ธานี' },
    { englishName: 'Ranong', thaiName: 'ระนอง' },
    { englishName: 'Chumphon', thaiName: 'ชุมพร' },
    { englishName: 'Songkhla', thaiName: 'สงขลา' },
    { englishName: 'Satun', thaiName: 'สตูล' },
    { englishName: 'Trang', thaiName: 'ตรัง' },
    { englishName: 'Phatthalung', thaiName: 'พัทลุง' },
    { englishName: 'Pattani', thaiName: 'ปัตตานี' },
    { englishName: 'Yala', thaiName: 'ยะลา' },
    { englishName: 'Narathiwat', thaiName: 'นราธิวาส' },
  ],
};

// Full district mapping from the JSON file
// Import districts
import districtData from '@/province_districts_english.json';

export const PROVINCE_DISTRICTS: Record<string, string[]> = districtData as Record<string, string[]>;

// Reverse maps for API calls
export function getThaiProvince(englishName: string): string {
  return (provinceMapping as Record<string, string>)[englishName] || englishName;
}

export function getDistrictForApi(districtEnglish: string): string {
  // The API likely expects the Thai district name
  // We'll use the English name for now since we don't have a reverse map
  return districtEnglish;
}

// Helper to get all provinces for a region (for dropdown)
export function getProvincesForRegion(regionCode: string): { englishName: string; thaiName: string }[] {
  return REGION_PROVINCES[regionCode] || [];
}

export const REGIONS = [
  { value: '', englishName: 'All Regions' },
  { value: 'กทม_และภาคกลาง', englishName: 'Bangkok and Central' },
  { value: 'ภาคเหนือ', englishName: 'Northern' },
  { value: 'ภาคตะวันออกเฉียงเหนือ', englishName: 'Northeastern' },
  { value: 'ภาคตะวันออก', englishName: 'Eastern' },
  { value: 'ภาคตะวันตก', englishName: 'Western' },
  { value: 'ภาคใต้', englishName: 'Southern' },
];