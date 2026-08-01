"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyGridSkeleton } from "@/components/property/PropertyGridSkeleton";
import { useGetFeaturedPropertiesQuery } from "@/redux/api/propertyApi";

export function FeaturedProperties() {
  const { data, isLoading, isFetching, isError } =
    useGetFeaturedPropertiesQuery();
  const showSkeleton = isLoading || isFetching;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Featured Properties</h2>
        <Button variant="outline" asChild>
          <Link href="/properties">View All</Link>
        </Button>
      </div>

      {showSkeleton && <PropertyGridSkeleton count={6} />}

      {!showSkeleton && isError && (
        <p className="text-center text-muted-foreground">
          Couldn&apos;t load properties right now. Please try again later.
        </p>
      )}

      {!showSkeleton && !isError && (
        <PropertyGrid properties={data?.data ?? []} />
      )}
    </section>
  );
}
