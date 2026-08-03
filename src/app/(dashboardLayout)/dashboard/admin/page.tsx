import { OverviewCards } from "@/components/dashboard/admin/OverviewCards";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-background via-background to-violet-500/5 p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.4)] sm:p-6">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
            Operations
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Admin overview
            </h1>
            <p className="text-sm text-muted-foreground">
              Platform-wide stats and health at a glance.
            </p>
          </div>
        </div>
      </div>

      <OverviewCards />
    </div>
  );
}
