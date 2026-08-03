/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Building2, MapPin, Plus, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useGetCategoriesQuery } from "@/redux/api/propertyApi";
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
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();

  const isEditing = !!propertyId;
  const isSubmitting = isCreating || isUpdating;
  const categories = categoriesData?.data ?? [];

  const form = useForm<PropertyFormValues>({
    defaultValues: {
      title: "",
      description: "",
      type: "APARTMENT",
      price: 0,
      bedrooms: 1,
      bathrooms: 1,
      areaSqft: undefined,
      location: "",
      city: "",
      address: "",
      amenities: [],
      images: [""],
      categoryId: "",
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
    <Card className="overflow-hidden border-0 bg-card/80 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.45)] backdrop-blur-sm">
      <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-primary/40" />
      <CardContent className="p-5 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Property details
                  </p>
                  <h2 className="text-lg font-semibold text-foreground">
                    {isEditing ? "Edit listing" : "Create listing"}
                  </h2>
                </div>
              </div>

              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 rounded-xl border-border/70 bg-background/80 shadow-sm focus-visible:ring-primary/30"
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
                      <FormLabel className="text-sm font-medium">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={5}
                          className="resize-none rounded-xl border-border/70 bg-background/80 shadow-sm focus-visible:ring-primary/30"
                          placeholder="Describe the property..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-300">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Listing setup
                    </p>
                    <h3 className="text-base font-semibold text-foreground">
                      Category and type
                    </h3>
                  </div>
                </div>

                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Category
                        </FormLabel>
                        {isLoadingCategories ? (
                          <Skeleton className="h-11 w-full rounded-xl" />
                        ) : (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 rounded-xl border-border/70 bg-background/80 shadow-sm">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Property type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? "APARTMENT"}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl border-border/70 bg-background/80 shadow-sm">
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
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Location
                    </p>
                    <h3 className="text-base font-semibold text-foreground">
                      Address and city
                    </h3>
                  </div>
                </div>

                <div className="space-y-5">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Location / Area
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-11 rounded-xl border-border/70 bg-background/80 shadow-sm focus-visible:ring-primary/30"
                            placeholder="Gulshan 2"
                            {...field}
                          />
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
                        <FormLabel className="text-sm font-medium">
                          City
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-11 rounded-xl border-border/70 bg-background/80 shadow-sm focus-visible:ring-primary/30"
                            placeholder="Dhaka"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300">
                  <span className="text-base font-bold">$</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Pricing
                  </p>
                  <h3 className="text-base font-semibold text-foreground">
                    Rent and size
                  </h3>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Monthly rent ($)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          className="h-11 rounded-xl border-border/70 bg-background/80 shadow-sm focus-visible:ring-primary/30"
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
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Bedrooms
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          className="h-11 rounded-xl border-border/70 bg-background/80 shadow-sm focus-visible:ring-primary/30"
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
                      <FormLabel className="text-sm font-medium">
                        Bathrooms
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          className="h-11 rounded-xl border-border/70 bg-background/80 shadow-sm focus-visible:ring-primary/30"
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
                      <FormLabel className="text-sm font-medium">
                        Area (sqft)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          className="h-11 rounded-xl border-border/70 bg-background/80 shadow-sm focus-visible:ring-primary/30"
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
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 sm:p-5">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Full address
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 rounded-xl border-border/70 bg-background/80 shadow-sm focus-visible:ring-primary/30"
                        placeholder="House 12, Road 5, Gulshan 2, Dhaka 1212"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 sm:p-5">
              <FormField
                control={form.control}
                name="amenities"
                render={({ field }) => {
                  const selectedAmenities = field.value ?? [];

                  return (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Amenities
                      </FormLabel>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                        {AMENITIES_LIST.map((amenity) => (
                          <div
                            key={amenity}
                            className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2.5 shadow-sm"
                          >
                            <Checkbox
                              id={amenity}
                              checked={selectedAmenities.includes(amenity)}
                              onCheckedChange={(checked) => {
                                field.onChange(
                                  checked
                                    ? [...selectedAmenities, amenity]
                                    : selectedAmenities.filter(
                                        (a) => a !== amenity,
                                      ),
                                );
                              }}
                            />
                            <Label
                              htmlFor={amenity}
                              className="cursor-pointer select-none text-sm font-normal text-foreground"
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
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 sm:p-5">
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
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <FormLabel className="text-sm font-medium">
                          Image URLs
                        </FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addOne}
                          className="h-8 rounded-lg border-border/70 bg-background/80"
                        >
                          <Plus className="mr-1.5 h-3.5 w-3.5" />
                          Add image
                        </Button>
                      </div>

                      <div className="space-y-2.5">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="flex gap-2">
                            <FormControl>
                              <Input
                                className="h-11 rounded-xl border-border/70 bg-background/80 shadow-sm focus-visible:ring-primary/30"
                                placeholder="https://example.com/photo.jpg"
                                value={url}
                                onChange={(e) =>
                                  updateAt(index, e.target.value)
                                }
                              />
                            </FormControl>
                            {imageUrls.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeAt(index)}
                                className="h-11 w-11 rounded-xl border border-border/70 bg-background/80"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                size="lg"
                className="min-w-[220px] rounded-xl bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isEditing
                    ? "Saving..."
                    : "Creating..."
                  : isEditing
                    ? "Save Changes"
                    : "List Property"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
