"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterSidebar } from "@/components/property/FilterSidebar";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyGridSkeleton } from "@/components/property/PropertyGridSkeleton";
import { Pagination } from "@/components/shared/Pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPropertiesQuery } from "@/redux/api/propertyApi";
import { PropertyFilters } from "@/src/types/property";
function filtersFromParams(params: URLSearchParams): PropertyFilters {
  return {
    location: params.get("location") ?? undefined,
    city: params.get("city") ?? undefined,
    minPrice: params.get("minPrice")
      ? Number(params.get("minPrice"))
      : undefined,
    maxPrice: params.get("maxPrice")
      ? Number(params.get("maxPrice"))
      : undefined,
    propertyType:
      (params.get("propertyType") as PropertyFilters["propertyType"]) ?? "ALL",
    amenities: params.get("amenities")?.split(",").filter(Boolean),
    sort: (params.get("sort") as PropertyFilters["sort"]) ?? "newest",
    page: params.get("page") ? Number(params.get("page")) : 1,
    limit: 12,
  };
}

function paramsFromFilters(filters: PropertyFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.location) params.set("location", filters.location);
  if (filters.city) params.set("city", filters.city);
  if (filters.minPrice !== undefined)
    params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined)
    params.set("maxPrice", String(filters.maxPrice));
  if (filters.propertyType && filters.propertyType !== "ALL") {
    params.set("propertyType", filters.propertyType);
  }
  if (filters.amenities?.length)
    params.set("amenities", filters.amenities.join(","));
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page && filters.page > 1)
    params.set("page", String(filters.page));
  return params;
}

export default function PropertiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<PropertyFilters>(() =>
    filtersFromParams(new URLSearchParams(searchParams.toString())),
  );

  const { data, isLoading, isFetching, isError } =
    useGetPropertiesQuery(filters);
  const showSkeleton = isLoading || isFetching;

  useEffect(() => {
    const params = paramsFromFilters(filters);
    router.replace(`/properties?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleReset = () => {
    setFilters({ propertyType: "ALL", sort: "newest", page: 1, limit: 12 });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Browse Properties</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          onReset={handleReset}
        />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {data?.meta?.total ?? 0} properties found
            </p>

            <Select
              value={filters.sort ?? "newest"}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  sort: value as PropertyFilters["sort"],
                  page: 1,
                })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showSkeleton && <PropertyGridSkeleton count={9} />}

          {!showSkeleton && isError && (
            <p className="py-20 text-center text-muted-foreground">
              Something went wrong loading properties. Please try again.
            </p>
          )}

          {!showSkeleton && !isError && (
            <>
              <PropertyGrid properties={data?.data ?? []} />
              <Pagination
                page={filters.page ?? 1}
                totalPages={data?.meta?.totalPages ?? 1}
                onPageChange={(page) => setFilters({ ...filters, page })}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
