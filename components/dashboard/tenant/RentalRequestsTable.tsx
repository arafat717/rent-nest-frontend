"use client";

import Link from "next/link";
import Image from "next/image";
import { CreditCard, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { useGetMyRentalRequestsQuery } from "@/redux/api/rentalApi";

interface RentalRequestsTableProps {
  limit?: number;
}

export function RentalRequestsTable({ limit }: RentalRequestsTableProps) {
  const { data, isLoading, isFetching, isError } =
    useGetMyRentalRequestsQuery();
  const showSkeleton = isLoading || isFetching;

  const requests = limit
    ? (data?.data ?? []).slice(0, limit)
    : (data?.data ?? []);

  if (showSkeleton) {
    return (
      <div className="space-y-3">
        {Array.from({ length: limit ?? 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 py-10 text-center text-sm text-destructive">
        Couldn&apos;t load your requests. Please try again.
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/80 bg-muted/30 py-12 text-center">
        <p className="text-base font-semibold text-foreground">
          No rental requests yet
        </p>
        <p className="text-sm text-muted-foreground">
          Browse properties and send your first request.
        </p>
        <Button asChild size="sm" className="mt-1">
          <Link href="/properties">Browse Properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      <Table className="min-w-full">
        <TableHeader className="bg-muted/60">
          <TableRow>
            <TableHead className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Property
            </TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Move-in Date
            </TableHead>
            <TableHead className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="px-4 py-3 text-right text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id} className="group hover:bg-primary/5">
              <TableCell className="px-4 py-3.5">
                <Link
                  href={`/properties/${request.property.id}`}
                  className="flex items-center gap-3 transition-colors hover:text-primary"
                >
                  <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted shadow-sm">
                    <Image
                      src={
                        request.property.images?.[0] ??
                        "/placeholder-property.jpg"
                      }
                      alt={request.property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="line-clamp-1 font-medium text-foreground">
                    {request.property.title}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="px-4 py-3.5 text-sm text-muted-foreground">
                {new Date(request.moveInDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="px-4 py-3.5">
                <StatusBadge status={request.status} />
              </TableCell>
              <TableCell className="px-4 py-3.5 text-right">
                {request.status === "APPROVED" && (
                  <Button
                    size="sm"
                    asChild
                    className="bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    <Link href={`/dashboard/tenant/requests/${request.id}/pay`}>
                      <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                      Pay Now
                    </Link>
                  </Button>
                )}
                {request.status === "ACTIVE" && !request.hasReview && (
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="border-border bg-background hover:bg-muted"
                  >
                    <Link
                      href={`/dashboard/tenant/requests/${request.id}/review`}
                    >
                      <Star className="mr-1.5 h-3.5 w-3.5" />
                      Leave Review
                    </Link>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
