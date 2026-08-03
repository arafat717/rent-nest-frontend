"use client";

import Link from "next/link";
import { ArrowUpRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OverviewCards } from "@/components/dashboard/Landlord/OverviewCards";
import { RequestsTable } from "@/components/dashboard/Landlord/RequestsTable";

export default function LandlordDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-background via-background to-primary/5 p-5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.4)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Portfolio
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Landlord overview
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your properties, track demand, and respond to requests
                faster.
              </p>
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="group h-11 rounded-xl bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
          >
            <Link
              href="/dashboard/landlord/properties/new"
              className="inline-flex items-center"
            >
              <PlusCircle className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              Add Property
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

        <RequestsTable limit={5} />
      </div>
    </div>
  );
}
