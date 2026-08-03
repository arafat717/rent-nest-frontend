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
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 py-10 text-center text-sm text-destructive">
        Couldn&apos;t load your properties.
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/80 bg-muted/30 py-12 text-center">
        <p className="text-base font-semibold text-foreground">
          No properties listed yet
        </p>
        <Button size="sm" asChild className="mt-1">
          <Link href="/dashboard/landlord/properties/new">
            Add Your First Property
          </Link>
        </Button>
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
                Price
              </TableHead>
              <TableHead className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Requests
              </TableHead>
              <TableHead className="px-4 py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Available
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id} className="group hover:bg-primary/5">
                <TableCell className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted shadow-sm">
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
                      <p className="line-clamp-1 font-medium text-foreground">
                        {property.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {property.location}, {property.city}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3.5 text-sm font-medium text-foreground">
                  ${property.price.toLocaleString()}/mo
                </TableCell>
                <TableCell className="px-4 py-3.5">
                  {property.activeRequestsCount > 0 ? (
                    <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                      {property.activeRequestsCount} pending
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="px-4 py-3.5">
                  <Select
                    value={property.status}
                    onValueChange={(value) =>
                      handleStatusChange(
                        property.id,
                        value as "AVAILABLE" | "UNAVAILABLE" | "RENTED",
                      )
                    }
                  >
                    <SelectTrigger className="h-9 w-32 rounded-lg border-border/70 bg-background/80 shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AVAILABLE">Available</SelectItem>
                      <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                      <SelectItem value="RENTED">Rented</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="px-4 py-3.5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-lg border border-border/60 bg-background/80 hover:bg-muted"
                      >
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
