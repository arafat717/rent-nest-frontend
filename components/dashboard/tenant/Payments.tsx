"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyPaymentsQuery } from "@/redux/api/rentalApi";

export default function TenantPaymentsPage() {
  const { data, isLoading, isFetching, isError } = useGetMyPaymentsQuery();
  const showSkeleton = isLoading || isFetching;
  const payments = data?.data ?? [];

  return (
    <div className="space-y-6 mt-5">
      <div>
        <h1 className="text-2xl font-bold">Payment History</h1>
        <p className="text-sm text-muted-foreground">
          All payments you&apos;ve made through RentNest
        </p>
      </div>

      {showSkeleton && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-md" />
          ))}
        </div>
      )}

      {!showSkeleton && isError && (
        <p className="py-12 text-center text-muted-foreground">
          Couldn&apos;t load payment history.
        </p>
      )}

      {!showSkeleton && !isError && payments.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No payments yet.
        </p>
      )}

      {!showSkeleton && !isError && payments.length > 0 && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.property.title}
                  </TableCell>
                  <TableCell>${payment.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === "PAID" ? "default" : "secondary"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
