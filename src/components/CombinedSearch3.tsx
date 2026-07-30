'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { REGIONS, getProvincesForRegion, PROVINCE_DISTRICTS, getThaiProvince } from '@/src/lib/selectionMappings';

interface CombinedSearch3Props {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  selectedProvince: string;
  onProvinceChange: (province: string) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  placeholder: string;
}

export default function CombinedSearch3({
  searchQuery,
  onSearchQueryChange,
  selectedRegion,
  onRegionChange,
  selectedProvince,
  onProvinceChange,
  selectedDistrict,
  onDistrictChange,
  placeholder,
}: CombinedSearch3Props) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();

  const handleSearchClick = () => {
    setOpenDropdown(null);
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedRegion) params.set('region', selectedRegion);
    if (selectedProvince) params.set('province', selectedProvince);
    if (selectedDistrict) params.set('district', selectedDistrict);
    router.push(`/factories?${params.toString()}`);
  };

  const provinces = selectedRegion ? getProvincesForRegion(selectedRegion) : [];
  const districts = selectedProvince && PROVINCE_DISTRICTS[selectedProvince] ? PROVINCE_DISTRICTS[selectedProvince] : [];

  const regionName = REGIONS.find(r => r.value === selectedRegion)?.englishName || (selectedRegion === '' ? 'All Regions' : selectedRegion);

  const handleRegionSelect = (value: string) => {
    onRegionChange(value);
    onProvinceChange('');
    onDistrictChange('');
    setOpenDropdown(null);
  };

  const handleProvinceSelect = (englishName: string) => {
    onProvinceChange(englishName);
    onDistrictChange('');
    setOpenDropdown(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative mt-2">
        <div className="flex gap-0 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus-within:ring-2 focus:ring-emerald-500 transition shadow-inner">
          {/* Region filter */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'region' ? null : 'region')}
              className="flex items-center gap-1 px-3 py-4 text-sm text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition whitespace-nowrap"
            >
              <span className="max-w-[80px] truncate">{regionName}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {openDropdown === 'region' && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20 min-w-[180px] max-h-[300px] overflow-y-auto">
                {REGIONS.map(r => (
                  <div
                    key={r.value}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 ${selectedRegion === r.value ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}`}
                    onClick={() => handleRegionSelect(r.value)}
                  >
                    {r.englishName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Province filter */}
          <div className="relative">
            <button
              onClick={() => {
                if (!selectedRegion) return;
                setOpenDropdown(openDropdown === 'province' ? null : 'province');
              }}
              className={`flex items-center gap-1 px-3 py-4 text-sm border-r border-slate-200 dark:border-slate-600 transition whitespace-nowrap ${!selectedRegion ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              <span className="max-w-[100px] truncate">{selectedProvince || 'Province'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {openDropdown === 'province' && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20 min-w-[200px] max-h-[300px] overflow-y-auto">
                <div
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 ${selectedProvince === '' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}`}
                  onClick={() => handleProvinceSelect('')}
                >
                  All Provinces
                </div>
                {provinces.map(p => (
                  <div
                    key={p.englishName}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 ${selectedProvince === p.englishName ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}`}
                    onClick={() => handleProvinceSelect(p.englishName)}
                  >
                    {p.englishName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* District filter */}
          <div className="relative">
            <button
              onClick={() => {
                if (!selectedProvince) return;
                setOpenDropdown(openDropdown === 'district' ? null : 'district');
              }}
              className={`flex items-center gap-1 px-3 py-4 text-sm border-r border-slate-200 dark:border-slate-600 transition whitespace-nowrap ${!selectedProvince ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              <span className="max-w-[100px] truncate">{selectedDistrict || 'District'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {openDropdown === 'district' && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20 min-w-[200px] max-h-[300px] overflow-y-auto">
                <div
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 ${selectedDistrict === '' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}`}
                  onClick={() => { onDistrictChange(''); setOpenDropdown(null); }}
                >
                  All Districts
                </div>
                {districts.map(d => (
                  <div
                    key={d}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 ${selectedDistrict === d ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}`}
                    onClick={() => { onDistrictChange(d); setOpenDropdown(null); }}
                  >
                    {d}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearchClick(); }}
            placeholder={placeholder}
            className="flex-1 min-w-0 px-4 py-4 bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />

          {/* Search button */}
          <button
            className="px-4 bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center"
            type="button"
            onClick={handleSearchClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
