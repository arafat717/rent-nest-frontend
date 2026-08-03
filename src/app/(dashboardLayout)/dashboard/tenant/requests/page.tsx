import { RentalRequestsTable } from "@/components/dashboard/tenant/RentalRequestsTable";

export default function TenantRequestsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-background via-background to-emerald-500/5 p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.4)] sm:p-6">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
            Activity
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My rental requests
          </h1>
          <p className="text-sm text-muted-foreground">
            Track the status of every request you&apos;ve sent.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm sm:p-5">
        <RentalRequestsTable />
      </div>
    </div>
  );
}
