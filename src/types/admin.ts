import { UserRole } from "./auth";
import { PropertyType } from "./property";
import { RentalStatus } from "./rental";

export type AccountStatus = "ACTIVE" | "BANNED" | "";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: AccountStatus;
  accountStatus: AccountStatus;
  createdAt: string;
  propertiesCount?: number;
  rentalRequestsCount?: number;
}

export interface AdminStats {
  totalUsers: number;
  totalTenants: number;
  totalLandlords: number;
  totalProperties: number;
  pendingRequests: number;
  totalRevenue: number;
}

export interface AdminProperty {
  id: string;
  title: string;
  images: string[];
  price: number;
  location: string;
  city: string;
  type: PropertyType;
  status: "AVAILABLE" | "UNAVAILABLE" | "RENTED";
  landlord: { id: string; name: string; email: string };
  createdAt: string;
}

export interface AdminRentalRequest {
  id: string;
  property: { id: string; title: string };
  tenant: { id: string; name: string; email: string };
  landlord: { id: string; name: string; email: string };
  status: RentalStatus;
  createdAt: string;
}

export interface UserQueryParams {
  search?: string;
  role?: UserRole | "ALL";
  page?: number;
  limit?: number;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
