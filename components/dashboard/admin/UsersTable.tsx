/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Search, MoreHorizontal, Ban, CheckCircle2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Pagination } from "@/components/shared/Pagination";
import {
  useGetAdminUsersQuery,
  useUpdateUserStatusMutation,
} from "@/redux/api/adminApi";
import { AccountStatus, AdminUser, UserQueryParams } from "@/src/types/admin";

export function UsersTable() {
  const [search, setSearch] = useState("");
  const [params, setParams] = useState<UserQueryParams>({
    search: "",
    role: "ALL",
    page: 1,
    limit: 10,
  });
  const [banTarget, setBanTarget] = useState<AdminUser | null>(null);

  const { data, isLoading, isFetching, isError } =
    useGetAdminUsersQuery(params);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();

  const showSkeleton = isLoading || isFetching;
  const users = data?.data ?? [];
  console.log("users", users);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setParams((prev: any) => ({ ...prev, search, page: 1 }));
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleConfirmBanToggle = async () => {
    if (!banTarget) return;

    const nextStatus: AccountStatus =
      banTarget.status === "ACTIVE" ? "BANNED" : "ACTIVE";

    const toastId = toast.loading(
      nextStatus === "BANNED" ? "Banning user..." : "Unbanning user...",
    );

    try {
      await updateStatus({
        id: banTarget.id,
        status: nextStatus,
      }).unwrap();

      toast.success(nextStatus === "BANNED" ? "User banned" : "User unbanned", {
        id: toastId,
      });
    } catch (error: any) {
      console.error("Status update error:", error);

      toast.error(error?.data?.message || "Couldn't update user status", {
        id: toastId,
      });
    } finally {
      setBanTarget(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select
          value={params.role ?? "ALL"}
          onValueChange={(value) =>
            setParams((prev: any) => ({
              ...prev,
              role: value as UserQueryParams["role"],
              page: 1,
            }))
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="TENANT">Tenant</SelectItem>
            <SelectItem value="LANDLORD">Landlord</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showSkeleton && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-md" />
          ))}
        </div>
      )}

      {!showSkeleton && isError && (
        <p className="py-12 text-center text-muted-foreground">
          Couldn&apos;t load users.
        </p>
      )}

      {!showSkeleton && !isError && users.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No users found.
        </p>
      )}

      {!showSkeleton && !isError && users.length > 0 && (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.role.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "ACTIVE" ? "secondary" : "destructive"
                        }
                      >
                        {user.status === "ACTIVE" ? "Active" : "Banned"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className={
                              user.accountStatus === "ACTIVE"
                                ? "text-destructive"
                                : ""
                            }
                            onClick={() => setBanTarget(user)}
                          >
                            {user.status === "ACTIVE" ? (
                              <>
                                <Ban className="mr-2 h-4 w-4" /> Ban User
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Unban
                                User
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            page={params.page ?? 1}
            totalPages={data?.meta?.totalPages ?? 1}
            onPageChange={(page) =>
              setParams((prev: any) => ({ ...prev, page }))
            }
          />
        </>
      )}

      <AlertDialog
        open={!!banTarget}
        onOpenChange={(open) => !open && setBanTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {banTarget?.status === "ACTIVE"
                ? "Ban this user?"
                : "Unban this user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {banTarget?.status === "ACTIVE"
                ? `${banTarget?.name} will lose access to the platform immediately.`
                : `${banTarget?.name} will regain access to the platform.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBanToggle}
              disabled={isUpdating}
            >
              {banTarget?.status === "ACTIVE" ? "Ban" : "Unban"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
