import provinceDistricts from '@/province_districts.json';
import provinceMapping from '@/province_mapping.json';
import districtMapping from '@/district_mapping.json';

const provinceMappingRecord = provinceMapping as Record<string, string>;
const districtMappingRecord = districtMapping as Record<string, string>;
const provinceDistrictsRecord = provinceDistricts as Record<string, string[]>;
const thaiToEnglish = Object.fromEntries(Object.entries(provinceMapping).map(([en, th]) => [th, en]));

export function getEnglishProvince(thaiProvince: string): string | undefined {
    return thaiToEnglish[thaiProvince];
}

export function getThaiProvince(englishProvince: string): string | undefined {
    return provinceMappingRecord[englishProvince];
}

export function getThaiDistrict(englishDistrict: string): string | undefined {
    // Handle some known inconsistencies from the filename-to-data mapping
    const overrides: Record<string, string> = {
        "error2": "สุไหงโก-ลก",
        "King-amphoebangdi": "บางดี",
        "King-amphoekapang": "กะปาง"
    };

    if (overrides[englishDistrict]) {
        return overrides[englishDistrict];
    }

    return districtMappingRecord[englishDistrict];
}

export const REGIONS = [
    { id: "Bangkok_and_Central", name: "Bangkok & Central" },
    { id: "Northern", name: "Northern" },
    { id: "Northeastern", name: "Northeastern" },
    { id: "Eastern", name: "Eastern" },
    { id: "Western", name: "Western" },
    { id: "Southern", name: "Southern" },
];

export const PROVINCE_REGION_EN: Record<string, string> = {
    "Bangkok": "Bangkok_and_Central",
    "Samut Prakan": "Bangkok_and_Central",
    "Nonthaburi": "Bangkok_and_Central",
    "Pathum Thani": "Bangkok_and_Central",
    "Phra Nakhon Si Ayutthaya": "Bangkok_and_Central",
    "Ang Thong": "Bangkok_and_Central",
    "Lopburi": "Bangkok_and_Central",
    "Sing Buri": "Bangkok_and_Central",
    "Chai Nat": "Bangkok_and_Central",
    "Saraburi": "Bangkok_and_Central",
    "Nakhon Nayok": "Bangkok_and_Central",
    "Nakhon Sawan": "Bangkok_and_Central",
    "Uthai Thani": "Bangkok_and_Central",
    "Kamphaeng Phet": "Bangkok_and_Central",
    "Sukhothai": "Bangkok_and_Central",
    "Phitsanulok": "Bangkok_and_Central",
    "Phichit": "Bangkok_and_Central",
    "Phetchabun": "Bangkok_and_Central",
    "Suphan Buri": "Bangkok_and_Central",
    "Nakhon Pathom": "Bangkok_and_Central",
    "Samut Sakhon": "Bangkok_and_Central",
    "Samut Songkhram": "Bangkok_and_Central",
    "Chiang Mai": "Northern",
    "Lamphun": "Northern",
    "Lampang": "Northern",
    "Uttaradit": "Northern",
    "Phrae": "Northern",
    "Nan": "Northern",
    "Phayao": "Northern",
    "Chiang Rai": "Northern",
    "Mae Hong Son": "Northern",
    "Nakhon Ratchasima": "Northeastern",
    "Buri Ram": "Northeastern",
    "Surin": "Northeastern",
    "Si Sa Ket": "Northeastern",
    "Ubon Ratchathani": "Northeastern",
    "Yasothon": "Northeastern",
    "Chaiyaphum": "Northeastern",
    "Amnat Charoen": "Northeastern",
    "Bueng Kan": "Northeastern",
    "Nong Bua Lam Phu": "Northeastern",
    "Khon Kaen": "Northeastern",
    "Udon Thani": "Northeastern",
    "Loei": "Northeastern",
    "Nong Khai": "Northeastern",
    "Maha Sarakham": "Northeastern",
    "Roi Et": "Northeastern",
    "Kalasin": "Northeastern",
    "Sakon Nakhon": "Northeastern",
    "Nakhon Phanom": "Northeastern",
    "Mukdahan": "Northeastern",
    "Chon Buri": "Eastern",
    "Rayong": "Eastern",
    "Chanthaburi": "Eastern",
    "Trat": "Eastern",
    "Chachoengsao": "Eastern",
    "Prachin Buri": "Eastern",
    "Sa Kaeo": "Eastern",
    "Tak": "Western",
    "Ratchaburi": "Western",
    "Kanchanaburi": "Western",
    "Phetchaburi": "Western",
    "Prachuap Khiri Khan": "Western",
    "Nakhon Si Thammarat": "Southern",
    "Krabi": "Southern",
    "Phang Nga": "Southern",
    "Phuket": "Southern",
    "Surat Thani": "Southern",
    "Ranong": "Southern",
    "Chumphon": "Southern",
    "Songkhla": "Southern",
    "Satun": "Southern",
    "Trang": "Southern",
    "Phatthalung": "Southern",
    "Pattani": "Southern",
    "Yala": "Southern",
    "Narathiwat": "Southern",
};

export function getProvincesByRegion(region: string): string[] {
    return Object.entries(PROVINCE_REGION_EN)
        .filter(([, r]) => r === region)
        .map(([province]) => province)
        .sort();
}

export function getAllProvinces(): string[] {
    return Object.keys(provinceMapping).sort();
}

export function getDistrictsByProvince(province: string): { en: string; th: string }[] | undefined {
    const englishDistricts = provinceDistrictsRecord[province];
    if (!englishDistricts) {
        return undefined;
    }

    return englishDistricts.map(en => ({
        en: en,
        th: getThaiDistrict(en) || en // Fallback to English name if no Thai mapping exists
    }));
}
