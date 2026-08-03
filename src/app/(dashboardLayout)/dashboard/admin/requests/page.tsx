import { RequestsModerationTable } from "@/components/dashboard/admin/RequestsModerationTable";

export default function AdminRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Rental Requests</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide view of all rental requests
        </p>
      </div>
      <RequestsModerationTable />
    </div>
  );
}
