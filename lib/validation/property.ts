import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  location: z.string().min(2, "Location is required"),
  city: z.string().min(2, "City is required"),
  propertyType: z.enum(["APARTMENT", "HOUSE", "STUDIO", "CONDO", "ROOM"]),
  bedrooms: z.coerce.number().min(0, "Can't be negative"),
  bathrooms: z.coerce.number().min(0, "Can't be negative"),
  areaSqft: z.coerce.number().nonnegative().optional(),
  amenities: z.array(z.string()),
  images: z
    .array(
      z.union([
        z.string().url("Each image must be a valid URL"),
        z.literal(""),
      ]),
    )
    .min(1, "Add at least one image"),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
