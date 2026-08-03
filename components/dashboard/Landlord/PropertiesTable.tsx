/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  useGetLandlordPropertiesQuery,
  useDeletePropertyMutation,
  useUpdatePropertyMutation,
} from "@/redux/api/landlordApi";

export function PropertiesTable() {
  const { data, isLoading, isFetching, isError } =
    useGetLandlordPropertiesQuery();
  const [deleteProperty] = useDeletePropertyMutation();
  const [updateProperty] = useUpdatePropertyMutation();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const showSkeleton = isLoading || isFetching;
  const properties = data?.data ?? [];
  console.log("properties", properties);
  const handleStatusChange = async (
    id: string,
    status: "AVAILABLE" | "UNAVAILABLE" | "RENTED",
  ) => {
    const toastId = toast.loading("Updating status...");
    try {
      await updateProperty({ id, payload: { status } }).unwrap();
      toast.success("Status updated", { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || "Couldn't update status", {
        id: toastId,
      });
    }
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const toastId = toast.loading("Deleting property...");
    try {
      await deleteProperty(deleteTarget).unwrap();
      toast.success("Property deleted", { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || "Couldn't delete property", {
        id: toastId,
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  if (showSkeleton) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        Couldn&apos;t load your properties.
      </p>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-12 text-center">
        <p className="font-medium">No properties listed yet</p>
        <Button size="sm" asChild>
          <Link href="/dashboard/landlord/properties/new">
            Add Your First Property
          </Link>
        </Button>
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
              <TableHead>Price</TableHead>
              {/* <TableHead>Requests</TableHead> */}
              <TableHead>Available</TableHead>
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
                    <div>
                      <p className="line-clamp-1 font-medium">
                        {property.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {property.location}, {property.city}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>${property.price.toLocaleString()}/mo</TableCell>
                {/* <TableCell>
                  {property.activeRequestsCount > 0 ? (
                    <Badge>{property.activeRequestsCount} pending</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell> */}
                <TableCell>{property.status}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/properties/${property.id}`}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/landlord/properties/${property.id}/edit`}
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteTarget(property.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this property?</AlertDialogTitle>
            <AlertDialogDescription>
              This can&apos;t be undone. Any pending requests for this property
              will also be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
