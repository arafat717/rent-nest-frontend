import { OverviewCards } from "@/components/dashboard/admin/OverviewCards";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide stats and health
        </p>
      </div>
      <OverviewCards />
    </div>
  );
}
