"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Pagination } from "@/components/shared/Pagination";
import { useGetAdminRequestsQuery } from "@/redux/api/adminApi";

export function RequestsModerationTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError } = useGetAdminRequestsQuery({
    page,
    limit: 10,
  });

  const showSkeleton = isLoading || isFetching;
  const requests = data?.data ?? [];

  if (showSkeleton) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Couldn&apos;t load requests.
      </p>
    );
  }

  if (requests.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No rental requests yet.
      </p>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Landlord</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.property.title}
                </TableCell>
                <TableCell>
                  <p className="text-sm">{request.tenant.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {request.tenant.email}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{request?.landlord?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {request?.landlord?.email}
                  </p>
                </TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell>
                  {new Date(request.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <Pagination
          page={page}
          totalPages={data?.meta?.totalPages ?? 1}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
