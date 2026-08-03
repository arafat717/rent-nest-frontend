"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLandlordPropertyByIdQuery } from "@/redux/api/landlordApi";
import { PropertyForm } from "@/components/dashboard/Landlord/PropertyForm";

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isFetching } = useGetLandlordPropertyByIdQuery(id);
  const showSkeleton = isLoading || isFetching;

  if (showSkeleton) {
    return (
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-background via-background to-primary/5 p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.4)] sm:p-6">
          <Skeleton className="h-7 w-36 rounded-full" />
          <Skeleton className="mt-4 h-8 w-56" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-8">
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const property = data?.data;
  if (!property) {
    return (
      <div className="mx-auto max-w-5xl rounded-2xl border border-dashed border-border/80 bg-muted/30 py-12 text-center">
        <p className="text-base font-medium text-foreground">
          Property not found.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          The listing you are trying to edit is unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-background via-background to-primary/5 p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.4)] sm:p-6">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Edit listing
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Update property details
          </h1>
          <p className="text-sm text-muted-foreground">
            Keep your listing accurate and attractive for potential tenants.
          </p>
        </div>
      </div>

      <PropertyForm
        propertyId={property.id}
        defaultValues={{
          title: property.title,
          description: property.description,
          type: property.type,
          price: property.price,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          areaSqft: property.areaSqft,
          location: property.location,
          city: property.city,
          address: property.address,
          amenities: property.amenities,
          images: property.images.length ? property.images : [""],
          categoryId: property.categoryId,
        }}
      />
    </div>
  );
}
