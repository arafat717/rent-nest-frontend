/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Eye, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Pagination } from "@/components/shared/Pagination";
import {
  useGetAdminPropertiesQuery,
  useDeleteAdminPropertyMutation,
} from "@/redux/api/adminApi";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive"> =
  {
    AVAILABLE: "default",
    RENTED: "secondary",
    UNAVAILABLE: "destructive",
  };

export function PropertiesModerationTable() {
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data, isLoading, isFetching, isError } = useGetAdminPropertiesQuery({
    page,
    limit: 10,
  });
  const [deleteProperty] = useDeleteAdminPropertyMutation();

  const showSkeleton = isLoading || isFetching;
  const properties = data?.data ?? [];
  console.log("properties", properties);
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const toastId = toast.loading("Removing property...");
    try {
      await deleteProperty(deleteTarget).unwrap();
      toast.success("Property removed", { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || "Couldn't remove property", {
        id: toastId,
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  if (showSkeleton) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Couldn&apos;t load properties.
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
              <TableHead>Landlord</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={
                          property.images?.[0] ?? "/placeholder-property.jpg"
                        }
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="line-clamp-1 font-medium">
                      {property.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{property.landlord.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {property.landlord.email}
                  </p>
                </TableCell>
                <TableCell>${property.price.toLocaleString()}/mo</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[property.status] ?? "outline"}>
                    {property.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/properties/${property.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => setDeleteTarget(property.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button> */}
                  </div>
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

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the property from the platform entirely. This
              can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
