"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConfirmPaymentMutation } from "@/redux/api/rentalApi";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [confirmPayment] = useConfirmPaymentMutation();
  const [status, setStatus] = useState<"confirming" | "success" | "error">(
    "confirming",
  );

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    confirmPayment({ sessionId })
      .unwrap()
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (status === "confirming") {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
        <h1 className="text-xl font-semibold">Confirming your payment...</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This will just take a moment.
        </p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <XCircle className="mb-4 h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-bold">Couldn&apos;t confirm payment</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          We couldn&apos;t verify this payment. If you were charged, contact
          support with your reference below.
        </p>
        {sessionId && (
          <p className="mt-1 text-xs text-muted-foreground">
            Reference: {sessionId}
          </p>
        )}
        <Button className="mt-6" asChild>
          <Link href="/dashboard/tenant/requests">Back to Requests</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <CheckCircle2 className="mb-4 h-16 w-16 text-green-500" />
      <h1 className="text-2xl font-bold">Payment Successful!</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Your payment has been confirmed. The landlord has been notified and your
        rental is now active.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/dashboard/tenant/requests">View My Requests</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </main>
  );
}
