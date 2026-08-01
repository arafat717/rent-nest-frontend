"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OverviewCards } from "@/components/dashboard/Landlord/OverviewCards";
import { RentalRequestsTable } from "@/components/dashboard/Landlord/RentalRequestTable";
export default function LandlordDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Landlord Overview</h1>
          <p className="text-sm text-muted-foreground">
            Manage your properties and rental requests
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/landlord/properties/new">
            <PlusCircle className="mr-1.5 h-4 w-4" />
            Add Property
          </Link>
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
