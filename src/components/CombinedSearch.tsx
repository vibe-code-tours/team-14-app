'use client';

import { useState, useEffect, useRef } from 'react';

interface CombinedSearchProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  placeholder: string;
}

const CombinedSearch = ({
  searchQuery,
  onSearchQueryChange,
  selectedRegion,
  onRegionChange,
  placeholder,
}: CombinedSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Region data: value is sent to API, name is for display
  const regions = [
    { value: 'กทม_และภาคกลาง', name: 'กทม และภาคกลาง' },
    { value: 'ภาคเหนือ', name: 'ภาคเหนือ' },
    { value: 'ภาคตะวันออกเฉียงเหนือ', name: 'ภาคตะวันออกเฉียงเหนือ' },
    { value: 'ภาคตะวันออก', name: 'ภาคตะวันออก' },
    { value: 'ภาคตะวันตก', name: 'ภาคตะวันตก' },
    { value: 'ภาคใต้', name: 'ภาคใต้' },
  ];

  const displayRegion = regions.find(r => r.value === selectedRegion)?.name || 'ทุกภาค';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRegionSelect = (regionValue: string) => {
    onRegionChange(regionValue);
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative mt-2" ref={dropdownRef}>
        <div className="absolute top-1 left-1 flex items-center h-[calc(100%-0.5rem)]">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded border border-transparent py-1 px-1.5 text-center flex items-center text-sm transition-all text-slate-600 dark:text-slate-300 h-full"
          >
            <span className="text-ellipsis overflow-hidden w-32 text-left">{displayRegion}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <div className="h-6 border-l border-slate-200 dark:border-slate-600 ml-1"></div>
          {isOpen && (
            <div className="min-w-[200px] overflow-hidden absolute left-0 w-full mt-2 top-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-10">
              <ul>
                <li
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm cursor-pointer"
                  onClick={() => handleRegionSelect('')}
                >
                  ทุกภาค
                </li>
                {regions.map((region) => (
                  <li
                    key={region.value}
                    className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm cursor-pointer"
                    onClick={() => handleRegionSelect(region.value)}
                  >
                    {region.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-800 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-700 dark:text-slate-200 text-sm border border-slate-200 dark:border-slate-600 rounded-xl pr-12 pl-40 py-4 transition duration-300 ease focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
          placeholder={placeholder}
        />
        <button
          className="absolute right-1 top-1 rounded-lg bg-slate-800 dark:bg-emerald-600 p-3 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 dark:hover:bg-emerald-500 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CombinedSearch;