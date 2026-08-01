export interface Landlord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export type PropertyType = "APARTMENT" | "HOUSE" | "STUDIO" | "CONDO" | "ROOM";

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  areaSqft?: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  landlord: Landlord;
  createdAt: string;
}

export interface PropertyFilters {
  location?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType | "ALL";
  amenities?: string[];
  page?: number;
  limit?: number;
  sort?: "newest" | "price_asc" | "price_desc";
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PropertyListResponse {
  success: boolean;
  data: Property[];
  meta: Meta;
}

export interface PropertyResponse {
  success: boolean;
  data: Property;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
