import { RentalRequestsTable } from "@/components/dashboard/tenant/RentalRequestsTable";

export default function TenantRequestsPage() {
  return (
    <div className="space-y-6 mt-5">
      <div>
        <h1 className="text-2xl font-bold">My Rental Requests</h1>
        <p className="text-sm text-muted-foreground">
          Track the status of every request you&apos;ve sent
        </p>
      </div>
      <RentalRequestsTable />
    </div>
  );
}
