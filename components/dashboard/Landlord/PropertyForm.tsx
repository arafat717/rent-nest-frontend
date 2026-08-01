/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
} from "@/redux/api/landlordApi";
import { PropertyFormValues, propertySchema } from "@/lib/validation/property";

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

interface PropertyFormProps {
  propertyId?: string;
  defaultValues?: Partial<PropertyFormValues>;
}

export function PropertyForm({ propertyId, defaultValues }: PropertyFormProps) {
  const router = useRouter();
  const [createProperty, { isLoading: isCreating }] =
    useCreatePropertyMutation();
  const [updateProperty, { isLoading: isUpdating }] =
    useUpdatePropertyMutation();
  const isEditing = !!propertyId;
  const isSubmitting = isCreating || isUpdating;

  const form = useForm<PropertyFormValues>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      location: "",
      city: "",
      propertyType: "APARTMENT",
      bedrooms: 1,
      bathrooms: 1,
      areaSqft: undefined,
      amenities: [],
      images: [""],
      ...defaultValues,
    } as PropertyFormValues,
  });

  const onSubmit = async (values: PropertyFormValues) => {
    const result = propertySchema.safeParse(values);

    if (!result.success) {
      const firstError = result.error.issues[0];
      const fieldPath = firstError.path[0];
      const message = firstError.message;

      if (fieldPath && typeof fieldPath === "string") {
        form.setError(fieldPath as keyof PropertyFormValues, {
          type: "manual",
          message,
        });
      }

      toast.error(message);
      return;
    }

    const cleanedImages = result.data.images.filter((url) => url.trim() !== "");
    const payload = { ...result.data, images: cleanedImages };

    const toastId = toast.loading(
      isEditing ? "Updating property..." : "Creating property...",
    );

    try {
      if (isEditing) {
        await updateProperty({ id: propertyId, payload }).unwrap();
        toast.success("Property updated!", { id: toastId });
      } else {
        await createProperty(payload).unwrap();
        toast.success("Property listed successfully!", { id: toastId });
      }
      router.push("/dashboard/landlord/properties");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Something went wrong. Please try again.",
        { id: toastId },
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Cozy 2-Bedroom Apartment in Gulshan"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Describe the property..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location / Area</FormLabel>
                <FormControl>
                  <Input placeholder="Gulshan 2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Dhaka" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Rent ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value as number | undefined}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? 0
                          : Number(event.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? "APARTMENT"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="APARTMENT">Apartment</SelectItem>
                    <SelectItem value="HOUSE">House</SelectItem>
                    <SelectItem value="STUDIO">Studio</SelectItem>
                    <SelectItem value="CONDO">Condo</SelectItem>
                    <SelectItem value="ROOM">Room</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value as number | undefined}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? 0
                          : Number(event.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value as number | undefined}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? 0
                          : Number(event.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="areaSqft"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area (sqft)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value as number | undefined}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? 0
                          : Number(event.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => {
            const selectedAmenities = field.value ?? [];

            return (
              <FormItem>
                <FormLabel>Amenities</FormLabel>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {AMENITIES_LIST.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={(checked) => {
                          field.onChange(
                            checked
                              ? [...selectedAmenities, amenity]
                              : selectedAmenities.filter((a) => a !== amenity),
                          );
                        }}
                      />
                      <Label
                        htmlFor={amenity}
                        className="cursor-pointer font-normal"
                      >
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Images — managed as plain array state, not useFieldArray.
            useFieldArray requires an array of OBJECTS (needs a stable `id`
            per row); `images` is string[], which its generic constraint
            can't match — that's the source of the "does not satisfy
            constraint 'never'" error. */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => {
            const imageUrls = field.value?.length ? field.value : [""];

            const updateAt = (index: number, value: string) => {
              const next = [...imageUrls];
              next[index] = value;
              field.onChange(next);
            };

            const removeAt = (index: number) => {
              field.onChange(imageUrls.filter((_, i) => i !== index));
            };

            const addOne = () => {
              field.onChange([...imageUrls, ""]);
            };

            return (
              <FormItem>
                <FormLabel>Image URLs</FormLabel>
                <div className="space-y-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder="https://example.com/photo.jpg"
                          value={url}
                          onChange={(e) => updateAt(index, e.target.value)}
                        />
                      </FormControl>
                      {imageUrls.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAt(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOne}
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add Image
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
              ? "Save Changes"
              : "List Property"}
        </Button>
      </form>
    </Form>
  );
}
