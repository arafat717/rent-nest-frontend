import { Category, PropertyFilters, PropertyListResponse, PropertyResponse } from "@/src/types/property";
import { baseApi } from "./baseApi";


const buildQueryParams = (filters: PropertyFilters) => {
  const params = new URLSearchParams();

  if (filters.location) params.append("location", filters.location);
  if (filters.city) params.append("city", filters.city);
  if (filters.minPrice !== undefined) params.append("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.append("maxPrice", String(filters.maxPrice));
  if (filters.propertyType && filters.propertyType !== "ALL") {
    params.append("propertyType", filters.propertyType);
  }
  if (filters.amenities?.length) {
    params.append("amenities", filters.amenities.join(","));
  }
  if (filters.sort) params.append("sort", filters.sort);
  params.append("page", String(filters.page ?? 1));
  params.append("limit", String(filters.limit ?? 12));

  return params.toString();
};

export const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query<PropertyListResponse, PropertyFilters | void>({
      query: (filters) => `/properties?${buildQueryParams(filters ?? {})}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Property" as const, id })),
              { type: "Property" as const, id: "LIST" },
            ]
          : [{ type: "Property" as const, id: "LIST" }],
    }),

    getFeaturedProperties: builder.query<PropertyListResponse, void>({
      query: () => `/properties?limit=6&sort=newest`,
      providesTags: [{ type: "Property", id: "FEATURED" }],
    }),

    getPropertyById: builder.query<PropertyResponse, string>({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: "Property", id }],
    }),

    getCategories: builder.query<{ success: boolean; data: Category[] }, void>({
      query: () => `/categories`,
    }),
  }),
});

export const {
  useGetPropertiesQuery,
  useGetFeaturedPropertiesQuery,
  useGetPropertyByIdQuery,
  useGetCategoriesQuery,
} = propertyApi;