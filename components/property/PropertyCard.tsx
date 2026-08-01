"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, MapPin, Ruler } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Property } from "@/src/types/property";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const coverImage = property.images?.[0] ?? "/placeholder-property.jpg";

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="group overflow-hidden pt-0 transition-shadow hover:shadow-lg">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={coverImage}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!property.isAvailable && (
            <Badge variant="destructive" className="absolute left-2 top-2">
              Rented
            </Badge>
          )}
          <Badge className="absolute right-2 top-2 bg-background text-foreground">
            {property.propertyType}
          </Badge>
        </div>

        <CardContent className="space-y-2 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="line-clamp-1 font-semibold">{property.title}</h3>
            <span className="whitespace-nowrap font-semibold text-primary">
              ${property.price.toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground">
                /mo
              </span>
            </span>
          </div>

          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">
              {property.location}, {property.city}
            </span>
          </p>
        </CardContent>

        <CardFooter className="flex items-center gap-4 border-t pt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" /> {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" /> {property.bathrooms}
          </span>
          {property.areaSqft && (
            <span className="flex items-center gap-1">
              <Ruler className="h-4 w-4" /> {property.areaSqft} sqft
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
