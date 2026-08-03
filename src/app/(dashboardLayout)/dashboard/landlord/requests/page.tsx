import { RequestsTable } from "@/components/dashboard/Landlord/RequestsTable";

export default function LandlordRequestsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-background via-background to-primary/5 p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.4)] sm:p-6">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Requests
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Rental requests
          </h1>
          <p className="text-sm text-muted-foreground">
            Approve or reject incoming requests from tenants.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm sm:p-5">
        <RequestsTable />
      </div>
    </div>
  );
}
