"use client";

import { useParams } from "next/navigation";
import { Bed, Bath, Ruler, MapPin, CheckCircle2 } from "lucide-react";
import { useGetPropertyByIdQuery } from "@/redux/api/propertyApi";
import { ImageGallery } from "@/components/property/ImageGallery";
import { RequestToRentDialog } from "@/components/property/RequestToRentDialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { PropertyDetailsSkeleton } from "@/components/property/PropertyDetailsSkeleton";

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isFetching, isError } = useGetPropertyByIdQuery(id);
  const showSkeleton = isLoading || isFetching;

  if (showSkeleton) return <PropertyDetailsSkeleton />;

  if (isError || !data?.data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        Property not found.
      </div>
    );
  }

  const property = data.data;

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <ImageGallery images={property.images} title={property.title} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant={property.status === "AVAILABLE" ? "default" : property.status === "RENTED" ? "secondary" : "destructive"}>
                {property.status }
              </Badge>
              <Badge variant="outline">{property.type}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <p className="mt-1 flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {property.location}, {property.city}
            </p>
          </div>

          <div className="flex gap-6 rounded-lg border p-4">
            <span className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-primary" /> {property.bedrooms} Beds
            </span>
            <span className="flex items-center gap-2">
              <Bath className="h-5 w-5 text-primary" /> {property.bathrooms}{" "}
              Baths
            </span>
            {property.areaSqft && (
              <span className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" /> {property.areaSqft}{" "}
                sqft
              </span>
            )}
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">Description</h2>
            <p className="whitespace-pre-line text-muted-foreground">
              {property.description}
            </p>
          </div>

          {property.amenities?.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-semibold">Amenities</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="flex items-center gap-2 text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit space-y-4 rounded-lg border p-4">
          <div>
            <span className="text-2xl font-bold text-primary">
              ${property.price.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground"> / month</span>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={property.landlord.avatar} />
              <AvatarFallback>
                {property.landlord.name?.[0] ?? "L"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{property.landlord.name}</p>
              <p className="text-sm text-muted-foreground">Property Owner</p>
            </div>
          </div>

          <RequestToRentDialog
            propertyId={property.id}
            disabled={property.status !== "AVAILABLE"}
          />
        </aside>
      </div>
    </main>
  );
}
