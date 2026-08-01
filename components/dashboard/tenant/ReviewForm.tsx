/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useGetRentalRequestByIdQuery,
  useCreateReviewMutation,
} from "@/redux/api/rentalApi";

export function ReviewForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isFetching } = useGetRentalRequestByIdQuery(id);
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const showSkeleton = isLoading || isFetching;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    const toastId = toast.loading("Submitting your review...");

    try {
      await createReview({
        rentalRequestId: id,
        propertyId: data!.data.property.id,
        rating,
        comment,
      }).unwrap();

      toast.success("Thanks for your review!", { id: toastId });
      router.push("/dashboard/tenant/requests");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Couldn't submit your review. Try again.",
        { id: toastId },
      );
    }
  };

  if (showSkeleton) {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const request = data?.data;
  if (!request) {
    return (
      <p className="text-center text-muted-foreground">Request not found.</p>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leave a Review</h1>
        <p className="text-sm text-muted-foreground">
          How was your experience at {request.property.title}?
        </p>
      </div>

      <div className="flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <Star
              className={cn(
                "h-8 w-8 transition-colors",
                (hoverRating || rating) >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground",
              )}
            />
          </button>
        ))}
      </div>

      <Textarea
        placeholder="Share details about your stay..."
        value={comment}
        onChange={(e:any) => setComment(e.target.value)}
        rows={5}
      />

      <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
}
