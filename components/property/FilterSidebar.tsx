/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyFilters, PropertyType } from "@/src/types/property";

const PROPERTY_TYPES: { label: string; value: PropertyType | "ALL" }[] = [
  { label: "All Types", value: "ALL" },
  { label: "Apartment", value: "APARTMENT" },
  { label: "House", value: "HOUSE" },
  { label: "Studio", value: "STUDIO" },
  { label: "Condo", value: "CONDO" },
  { label: "Room", value: "ROOM" },
];

const AMENITIES_LIST = [
  "Parking",
  "WiFi",
  "Air Conditioning",
  "Furnished",
  "Pet Friendly",
  "Swimming Pool",
  "Gym",
  "Security",
];

const MAX_PRICE = 100000;
const SLIDER_STEP = 500;

// Formats 2500 -> "2.5k", 25000 -> "25k", 100000 -> "100k"
const formatPrice = (value: number) =>
  value >= 1000
    ? `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`
    : `${value}`;

interface FilterSidebarProps {
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
  onReset: () => void;
}

export function FilterSidebar({
  filters,
  onChange,
  onReset,
}: FilterSidebarProps) {
  const [location, setLocation] = useState(filters.location ?? "");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice ?? 0,
    filters.maxPrice ?? MAX_PRICE,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (location !== (filters.location ?? "")) {
        onChange({ ...filters, location: location || undefined, page: 1 });
      }
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const handlePriceCommit = (value: number[]) => {
    onChange({ ...filters, minPrice: value[0], maxPrice: value[1], page: 1 });
  };

  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities ?? [];
    const next = current.includes(amenity)
      ? current.filter((a:any) => a !== amenity)
      : [...current, amenity];
    onChange({ ...filters, amenities: next, page: 1 });
  };

  return (
    <aside className="space-y-6 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setLocation("");
            setPriceRange([0, MAX_PRICE]);
            onReset();
          }}
        >
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="Search by area or city"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Property Type</Label>
        <Select
          value={filters.propertyType ?? "ALL"}
          onValueChange={(value) =>
            onChange({
              ...filters,
              propertyType: value as PropertyType | "ALL",
              page: 1,
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Price Range</Label>
          <span className="text-sm text-muted-foreground">
            ${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}
          </span>
        </div>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={SLIDER_STEP}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          onValueCommit={handlePriceCommit}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$0</span>
          <span>${formatPrice(MAX_PRICE)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Amenities</Label>
        <div className="space-y-2">
          {AMENITIES_LIST.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2">
              <Checkbox
                id={amenity}
                checked={(filters.amenities ?? []).includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <Label htmlFor={amenity} className="cursor-pointer font-normal">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
