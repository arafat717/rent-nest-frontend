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
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-background via-background to-emerald-500/5 p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.4)] sm:p-6">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
            Billing
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Payment history
          </h1>
          <p className="text-sm text-muted-foreground">
            All payments you&apos;ve made through RentNest.
          </p>
        </div>
      </div>

      {showSkeleton && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!showSkeleton && isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 py-10 text-center text-sm text-destructive">
          Couldn&apos;t load payment history.
        </div>
      )}

      {!showSkeleton && !isError && payments.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 py-12 text-center text-muted-foreground">
          <p className="text-base font-semibold text-foreground">
            No payments yet.
          </p>
          <p className="mt-1 text-sm">
            Your completed payments will appear here.
          </p>
        </div>
      )}

      {!showSkeleton && !isError && payments.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
          <Table className="min-w-full">
            <TableHeader className="bg-muted/60">
              <TableRow>
                <TableHead className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Property
                </TableHead>
                <TableHead className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Amount
                </TableHead>
                <TableHead className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id} className="group hover:bg-primary/5">
                  <TableCell className="px-4 py-3.5 font-medium text-foreground">
                    {payment?.property?.title}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-sm font-medium text-foreground">
                    ${payment.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <Badge
                      className={
                        payment.status === "PAID"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-500/30 dark:bg-slate-500/10 dark:text-slate-300"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-sm text-muted-foreground">
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
