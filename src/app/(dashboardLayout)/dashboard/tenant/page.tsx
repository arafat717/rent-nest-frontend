"use client";

import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OverviewCards } from "@/components/dashboard/tenant/OverviewCards";
import { RentalRequestsTable } from "@/components/dashboard/tenant/RentalRequestsTable";

export default function TenantDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-background via-background to-emerald-500/5 p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.4)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
              My rentals
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Here&apos;s an overview of your rental activity and requests.
              </p>
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="group h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/25"
          >
            <Link href="/properties" className="inline-flex items-center">
              <Building2 className="mr-2 h-4 w-4" />
              Browse Properties
              <ArrowUpRight className="ml-2 h-4 w-4 opacity-70" />
            </Link>
          </Button>
        </div>
      </div>

      <OverviewCards />

      <div className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Activity
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">
              Recent requests
            </h2>
          </div>
        </div>
        <RentalRequestsTable limit={5} />
      </div>
    </div>
  );
}
