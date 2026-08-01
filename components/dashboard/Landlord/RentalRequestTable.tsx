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
import { useGetLandlordRequestsQuery } from "@/redux/api/landlordApi";

interface RentalRequestsTableProps {
  limit?: number;
}

export function RentalRequestsTable({ limit }: RentalRequestsTableProps) {
  const { data, isLoading, isFetching, isError } =
    useGetLandlordRequestsQuery();
  const showSkeleton = isLoading || isFetching;

  const requests = limit
    ? (data?.data ?? []).slice(0, limit)
    : (data?.data ?? []);

  if (showSkeleton) {
    return (
      <div className="space-y-2">
        {Array.from({ length: limit ?? 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        Couldn&apos;t load your requests. Please try again.
      </p>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-12 text-center">
        <p className="font-medium">No rental requests yet</p>
        <p className="text-sm text-muted-foreground">
          Browse properties and send your first request.
        </p>
        <Button asChild size="sm">
          <Link href="/properties">Browse Properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Move-in Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <Link
                  href={`/properties/${request.property.id}`}
                  className="flex items-center gap-3 hover:underline"
                >
                  <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
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
                  <span className="line-clamp-1 font-medium">
                    {request.property.title}
                  </span>
                </Link>
              </TableCell>
              <TableCell>
                {new Date(request.moveInDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <StatusBadge status={request.status} />
              </TableCell>
              <TableCell className="text-right">
                {request.status === "APPROVED" && (
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/tenant/requests/${request.id}/pay`}>
                      <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                      Pay Now
                    </Link>
                  </Button>
                )}
                {request.status === "ACTIVE" && !request.hasReview && (
                  <Button size="sm" variant="outline" asChild>
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
