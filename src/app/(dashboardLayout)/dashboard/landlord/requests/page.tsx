import { RequestsTable } from "@/components/dashboard/Landlord/RequestsTable";


export default function LandlordRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Rental Requests</h1>
        <p className="text-sm text-muted-foreground">
          Approve or reject incoming requests from tenants
        </p>
      </div>
      <RequestsTable />
    </div>
  );
}
