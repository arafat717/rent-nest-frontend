import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum(["APARTMENT", "HOUSE", "STUDIO", "CONDO", "ROOM"]),
  price: z.coerce.number().positive("Price must be greater than 0"),
  bedrooms: z.coerce.number().min(0, "Can't be negative"),
  bathrooms: z.coerce.number().min(0, "Can't be negative"),
  areaSqft: z.coerce.number().positive().optional(),
  location: z.string().min(2, "Location is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Full address is required"),
  amenities: z.array(z.string()),
  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .min(1, "Add at least one image"),
  categoryId: z.string().min(1, "Please select a category"),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
