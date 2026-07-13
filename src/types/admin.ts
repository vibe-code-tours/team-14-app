export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
}

export interface AdminStats {
  totalFactories: number;
  pendingFactories: number;
  totalReviews: number;
  visibleReviews: number;
}

export interface AdminFactory {
  id: number;
  regNumber: string | null;
  name: string;
  operator: string | null;
  district: string | null;
  province: string | null;
  workers: number | null;
  country: string;
  type: string | null;
  image: string | null;
  status: "pending" | "approved" | "declined";
  createdAt: Date;
  user: {
    id: string;
    fullName: string;
    nickname: string | null;
  } | null;
}

export interface AdminReview {
  id: number;
  workerRole: string;
  countryFrom: string;
  ratingSalary: number;
  ratingOt: number;
  ratingHousing: number;
  reviewText: string;
  isVisible: boolean;
  createdAt: Date;
  factoryName: string | null;
  organizationName: string | null;
  user: {
    id: string;
    fullName: string;
    nickname: string | null;
  } | null;
}

export interface FactoryFormData {
  name: string;
  regNumber: string;
  operator: string;
  businessActivity: string;
  houseNumber: string;
  village: string;
  soi: string;
  road: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  phone: string;
  type: string;
  workers: string;
  country: string;
  status: "pending" | "approved" | "declined";
}
