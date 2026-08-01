"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OverviewCards } from "@/components/dashboard/tenant/OverviewCards";
import { RentalRequestsTable } from "@/components/dashboard/tenant/RentalRequestsTable";

export default function TenantDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s an overview of your rentals
          </p>
        </div>
        <Button asChild>
          <Link href="/properties">Browse Properties</Link>
        </Button>
      </div>

      <OverviewCards />

      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Requests</h2>
        <RentalRequestsTable limit={5} />
      </div>
      
    </div>
  );
}
