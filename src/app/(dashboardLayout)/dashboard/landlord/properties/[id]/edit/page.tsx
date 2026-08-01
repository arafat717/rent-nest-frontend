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
      <div className="mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const property = data?.data;
  if (!property) {
    return (
      <p className="text-center text-muted-foreground">Property not found.</p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Property</h1>
        <p className="text-sm text-muted-foreground">
          Update your listing details
        </p>
      </div>
      <PropertyForm
        propertyId={property.id}
        defaultValues={{
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          city: property.city,
          propertyType: property.propertyType,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          areaSqft: property.areaSqft,
          amenities: property.amenities,
          images: property.images.length ? property.images : [""],
        }}
      />
    </div>
  );
}
