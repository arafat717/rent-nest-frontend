import { Property, PropertyType } from "./property";


export interface CreatePropertyPayload {
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
  categoryId?: string;
}

export type UpdatePropertyPayload = Partial<CreatePropertyPayload> & {
  isAvailable?: boolean;
};

export interface LandlordProperty extends Property {
  activeRequestsCount: number;
}

export interface LandlordStats {
  totalProperties: number;
  activeRequests: number;
  totalEarnings: number;
  occupiedProperties: number;
}
