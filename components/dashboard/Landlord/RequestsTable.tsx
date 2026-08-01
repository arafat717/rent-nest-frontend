/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useGetLandlordRequestsQuery,
  useUpdateRequestStatusMutation,
} from "@/redux/api/landlordApi";

interface RequestsTableProps {
  limit?: number;
}

export function RequestsTable({ limit }: RequestsTableProps) {
  const { data, isLoading, isFetching, isError } =
    useGetLandlordRequestsQuery();
  const [updateStatus] = useUpdateRequestStatusMutation();
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);

  const showSkeleton = isLoading || isFetching;
  const requests = limit
    ? (data?.data ?? []).slice(0, limit)
    : (data?.data ?? []);

  const handleApprove = async (id: string) => {
    const toastId = toast.loading("Approving request...");
    try {
      await updateStatus({ id, status: "APPROVED" }).unwrap();
      toast.success("Request approved! Tenant can now pay.", { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || "Couldn't approve request", {
        id: toastId,
      });
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    const toastId = toast.loading("Rejecting request...");
    try {
      await updateStatus({ id: rejectTarget, status: "REJECTED" }).unwrap();
      toast.success("Request rejected", { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || "Couldn't reject request", {
        id: toastId,
      });
    } finally {
      setRejectTarget(null);
    }
  };

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
        Couldn&apos;t load requests.
      </p>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
        No rental requests yet.
      </div>
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
              <TableHead>Move-in Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                <TableCell>{request.tenant.name}</TableCell>
                <TableCell>
                  {new Date(request.moveInDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell className="text-right">
                  {request.status === "PENDING" && (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRejectTarget(request.id)}
                      >
                        <X className="mr-1 h-3.5 w-3.5" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                      >
                        <Check className="mr-1 h-3.5 w-3.5" /> Approve
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this request?</AlertDialogTitle>
            <AlertDialogDescription>
              The tenant will be notified that their request was declined.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject}>Reject</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
