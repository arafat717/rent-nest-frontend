/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetRentalRequestByIdQuery,
  useCreatePaymentMutation,
} from "@/redux/api/rentalApi";

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isFetching } = useGetRentalRequestByIdQuery(id);
  const [createPayment, { isLoading: isCreatingPayment }] =
    useCreatePaymentMutation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const showSkeleton = isLoading || isFetching;

  const handlePay = async () => {
    setIsRedirecting(true);
    const toastId = toast.loading("Setting up secure checkout...");

    try {
      const res = await createPayment({ rentalRequestId: id }).unwrap();
      toast.success("Redirecting to checkout...", { id: toastId });
      window.location.href = res.data.checkoutUrl;
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Couldn't start checkout. Please try again.",
        { id: toastId },
      );
      setIsRedirecting(false);
    }
  };

  if (showSkeleton) {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const request = data?.data;

  if (!request) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Request not found.
      </p>
    );
  }

  if (request.status !== "APPROVED") {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <p className="font-medium">This request isn&apos;t ready for payment</p>
        <p className="text-sm text-muted-foreground">
          Only approved requests can be paid for.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/dashboard/tenant/requests")}
        >
          Back to Requests
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Complete Payment</h1>
        <p className="text-sm text-muted-foreground">
          Secure checkout powered by Stripe
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex gap-3">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
              <Image
                src={
                  request.property.images?.[0] ?? "/placeholder-property.jpg"
                }
                alt={request.property.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{request.property.title}</p>
              <p className="text-sm text-muted-foreground">
                {request.property.location}, {request.property.city}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <span className="text-sm text-muted-foreground">Monthly Rent</span>
            <span className="text-xl font-bold">
              ${request.property.price.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <Button
        className="w-full"
        size="lg"
        onClick={handlePay}
        disabled={isCreatingPayment || isRedirecting}
      >
        {isCreatingPayment || isRedirecting
          ? "Redirecting to Stripe..."
          : `Pay $${request.property.price.toLocaleString()}`}
      </Button>
    </div>
  );
}
