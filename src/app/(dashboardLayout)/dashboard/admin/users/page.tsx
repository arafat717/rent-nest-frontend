import { UsersTable } from "@/components/dashboard/admin/UsersTable";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground">
          Search, filter, and moderate platform users
        </p>
      </div>
      <UsersTable />
    </div>
  );
}
