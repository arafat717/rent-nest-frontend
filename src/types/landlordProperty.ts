import { Property } from "./property";


export type PropertyType = "APARTMENT" | "HOUSE" | "STUDIO" | "CONDO" | "ROOM";
export type PropertyStatus = "AVAILABLE" | "RENTED" | "UNAVAILABLE";

export interface CreatePropertyPayload {
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSqft?: number;
  location: string;
  city: string;
  address: string;
  amenities: string[];
  images: string[];
  categoryId: string;
}

export type UpdatePropertyPayload = Partial<CreatePropertyPayload> & {
  status?: PropertyStatus;
};

export interface LandlordProperty extends Omit<Property, "propertyType"> {
  type: PropertyType;
  status: PropertyStatus;
  address: string;
  categoryId: string;
  activeRequestsCount: number;
}
