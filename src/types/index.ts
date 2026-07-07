// Database types (matching Prisma schema)

export type OrganizationType = "factory" | "agency";
export type SuggestionStatus = "pending" | "approved" | "rejected";

export interface Factory {
  id: number;
  regNumber: string | null;
  name: string;
  operator: string | null;
  businessActivity: string | null;
  houseNumber: string | null;
  village: string | null;
  soi: string | null;
  road: string | null;
  subdistrict: string | null;
  district: string | null;
  province: string | null;
  postalCode: string | null;
  phone: string | null;
  type: string | null;
  capitalBaht: number | null;
  workers: number | null;
  horsepower: number | null;
  tsic: string | null;
  country: string;
  createdAt: Date;
}

export interface SuggestedOrganization {
  id: number;
  name: string;
  type: OrganizationType;
  country: string;
  city: string | null;
  status: SuggestionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: number;
  organizationId: number | null;
  factoryId: number | null;
  workerRole: string;
  countryFrom: string;
  ratingSalary: number;
  ratingOt: number;
  ratingHousing: number;
  reviewText: string;
  createdAt: Date;
}

// API response types

export interface ReviewStats {
  count: number;
  avgSalary: number | null;
  avgOt: number | null;
  avgHousing: number | null;
  avgOverall: number | null;
}

export interface FactorySearchParams {
  search?: string;
  province?: string;
  district?: string;
  region?: string;
  workersMin?: number;
  workersMax?: number;
  sort?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface Region {
  id: string;
  name: string;
}
