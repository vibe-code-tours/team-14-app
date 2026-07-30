"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

interface CascadingLocationFilterProps {
  onFilterChange: (filters: {
    region?: string;
    province?: string;
    district?: string;
  }) => void;
}

interface LocationData {
  regions: string[];
  provinces: Record<string, string[]>;
  districts: Record<string, { en: string; th: string }[]>;
}

export function CascadingLocationFilter({
  onFilterChange,
}: CascadingLocationFilterProps) {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const { language, t } = useLanguage();

  const [locationData, setLocationData] = useState<LocationData>({
    regions: [],
    provinces: {},
    districts: {},
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load regions on mount
  useEffect(() => {
    async function loadRegions() {
      try {
        const res = await fetch("/api/locations?type=regions");
        const data = await res.json();
        setLocationData((prev) => ({
          ...prev,
          regions: data.data?.map((r: { id: string }) => r.id) || [],
        }));
      } catch (error) {
        console.error("Error loading regions:", error);
      }
    }
    loadRegions();
  }, []);

  // Load provinces when region changes
  const loadProvinces = useCallback(
    async (region: string) => {
      if (locationData.provinces[region]) return;

      try {
        const res = await fetch(
          `/api/locations?type=provinces&region=${encodeURIComponent(region)}`
        );
        const data = await res.json();
        setLocationData((prev) => ({
          ...prev,
          provinces: {
            ...prev.provinces,
            [region]: data.data || [],
          },
        }));
      } catch (error) {
        console.error("Error loading provinces:", error);
      }
    },
    [locationData.provinces]
  );

  // Load districts when province changes
  const loadDistricts = useCallback(
    async (province: string) => {
      if (locationData.districts[province]) return;

      try {
        const res = await fetch(
          `/api/locations?type=districts&province=${encodeURIComponent(
            province
          )}`
        );
        const data = await res.json();
        setLocationData((prev) => ({
          ...prev,
          districts: {
            ...prev.districts,
            [province]: data.data || [],
          },
        }));
      } catch (error) {
        console.error("Error loading districts:", error);
      }
    },
    [locationData.districts]
  );

  // Handle region selection
  const handleRegionSelect = async (region: string) => {
    setLoading(true);
    setSelectedRegion(region);
    setSelectedProvince("");
    setSelectedDistrict("");
    setOpenDropdown(null);

    await loadProvinces(region);

    onFilterChange({ region });
    setLoading(false);
  };

  // Handle province selection
  const handleProvinceSelect = async (province: string) => {
    setLoading(true);
    setSelectedProvince(province);
    setSelectedDistrict("");
    setOpenDropdown(null);

    await loadDistricts(province);

    onFilterChange({ region: selectedRegion, province });
    setLoading(false);
  };

  // Handle district selection
  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    setOpenDropdown(null);
    onFilterChange({
      region: selectedRegion,
      province: selectedProvince,
      district,
    });
  };

  // Clear all selections
  const handleClear = () => {
    setSelectedRegion("");
    setSelectedProvince("");
    setSelectedDistrict("");
    onFilterChange({});
  };

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasSelection = selectedRegion || selectedProvince || selectedDistrict;

  // Get available options for each level
  const availableProvinces =
    selectedRegion && locationData.provinces[selectedRegion]
      ? locationData.provinces[selectedRegion]
      : [];

  const availableDistricts =
    selectedProvince && locationData.districts[selectedProvince]
      ? locationData.districts[selectedProvince]
      : [];
      
  const selectedDistrictObject =
    selectedDistrict && availableDistricts
      ? availableDistricts.find((d) => d.en === selectedDistrict)
      : null;

  const dropdownButtonClass =
    "rounded border border-slate-200 dark:border-slate-600 py-1 px-1.5 text-center flex items-center text-sm transition-all text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500";

  const dropdownMenuClass =
    "min-w-[150px] overflow-hidden absolute left-0 w-full mt-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md shadow-lg z-10";

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {/* Region Dropdown */}
        <div className="relative">
          <button
            type="button"
            className={dropdownButtonClass}
            onClick={() =>
              setOpenDropdown(openDropdown === "region" ? null : "region")
            }
          >
            <span className="text-ellipsis overflow-hidden max-w-[100px]">
              {selectedRegion
                ? selectedRegion.replace(/_/g, " ")
                : t("region") || "Region"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4 ml-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          {openDropdown === "region" && (
            <div className={`${dropdownMenuClass} min-w-[180px]`}>
              <ul className="max-h-[200px] overflow-y-auto">
                <li
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm cursor-pointer"
                  onClick={() => handleRegionSelect("")}
                >
                  {t("all_regions") || "All Regions"}
                </li>
                {locationData.regions.map((region) => (
                  <li
                    key={region}
                    className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm cursor-pointer"
                    onClick={() => handleRegionSelect(region)}
                  >
                    {region.replace(/_/g, " ")}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="h-6 border-l border-slate-200 dark:border-slate-600 ml-1" />

        {/* Province Dropdown */}
        <div className="relative">
          <button
            type="button"
            className={`${dropdownButtonClass} ${
              !selectedRegion ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!selectedRegion}
            onClick={() =>
              setOpenDropdown(openDropdown === "province" ? null : "province")
            }
          >
            <span className="text-ellipsis overflow-hidden max-w-[100px]">
              {selectedProvince || (t("province") || "Province")}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4 ml-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          {openDropdown === "province" && selectedRegion && (
            <div className={`${dropdownMenuClass} min-w-[200px]`}>
              <ul className="max-h-[200px] overflow-y-auto">
                <li
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm cursor-pointer"
                  onClick={() => handleProvinceSelect("")}
                >
                  {t("all_provinces") || "All Provinces"}
                </li>
                {availableProvinces.map((province) => (
                  <li
                    key={province}
                    className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm cursor-pointer"
                    onClick={() => handleProvinceSelect(province)}
                  >
                    {province}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="h-6 border-l border-slate-200 dark:border-slate-600 ml-1" />

        {/* District Dropdown */}
        <div className="relative">
          <button
            type="button"
            className={`${dropdownButtonClass} ${
              !selectedProvince ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!selectedProvince}
            onClick={() =>
              setOpenDropdown(openDropdown === "district" ? null : "district")
            }
          >
            <span className="text-ellipsis overflow-hidden max-w-[100px]">
              {selectedDistrictObject
                ? language === "en"
                  ? selectedDistrictObject.en
                  : selectedDistrictObject.th
                : t("district") || "District"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-4 w-4 ml-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          {openDropdown === "district" && selectedProvince && (
            <div className={`${dropdownMenuClass} min-w-[180px]`}>
              <ul className="max-h-[200px] overflow-y-auto">
                <li
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm cursor-pointer"
                  onClick={() => handleDistrictSelect("")}
                >
                  {t("all_districts") || "All Districts"}
                </li>
                {availableDistricts.map((district) => (
                  <li
                    key={district.en}
                    className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm cursor-pointer"
                    onClick={() => handleDistrictSelect(district.en)}
                  >
                    {language === "en" ? district.en : district.th}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Clear Button */}
        {hasSelection && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-2 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 underline transition"
          >
            {t("clear") || "Clear"}
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="text-xs text-slate-400 dark:text-slate-500">
          {t("loading") || "Loading..."}
        </div>
      )}
    </div>
  );
}