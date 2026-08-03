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
        Couldn&apos;t load requests.
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/30 py-12 text-center text-muted-foreground">
        <p className="text-base font-medium text-foreground">
          No rental requests yet.
        </p>
        <p className="mt-1 text-sm">New enquiries will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <Table className="min-w-full">
          <TableHeader className="bg-muted/60">
            <TableRow>
              <TableHead className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Property
              </TableHead>
              <TableHead className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Tenant
              </TableHead>
              <TableHead className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Move-in Date
              </TableHead>
              <TableHead className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Actions
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
                <TableCell className="px-4 py-3.5 text-sm text-foreground">
                  {request.tenant.name}
                </TableCell>
                <TableCell className="px-4 py-3.5 text-sm text-muted-foreground">
                  {new Date(request.moveInDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="px-4 py-3.5">
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell className="px-4 py-3.5 text-right">
                  {request.status === "PENDING" && (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border bg-background text-foreground hover:bg-muted"
                        onClick={() => setRejectTarget(request.id)}
                      >
                        <X className="mr-1 h-3.5 w-3.5" /> Reject
                      </Button>
                      <Button
                        size="sm"
                        className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-500"
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
