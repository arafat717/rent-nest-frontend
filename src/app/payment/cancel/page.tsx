import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <XCircle className="mb-4 h-16 w-16 text-red-500" />
      <h1 className="text-2xl font-bold">Payment Cancelled</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        No charge was made. You can try again anytime from your requests.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/dashboard/tenant/requests">Back to Requests</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </main>
  );
}
