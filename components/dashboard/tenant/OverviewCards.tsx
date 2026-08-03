"use client";

import { ClipboardList, CreditCard, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyRentalRequestsQuery } from "@/redux/api/rentalApi";

export function OverviewCards() {
  const { data, isLoading, isFetching } = useGetMyRentalRequestsQuery();
  const showSkeleton = isLoading || isFetching;
  const requests = data?.data ?? [];

  const stats = [
    {
      label: "Total Requests",
      value: requests.length,
      icon: ClipboardList,
    },
    {
      label: "Pending",
      value: requests.filter((r) => r.status === "PENDING").length,
      icon: Clock,
    },
    {
      label: "Active Rentals",
      value: requests.filter((r) => r.status === "ACTIVE").length,
      icon: CheckCircle2,
    },
    {
      label: "Awaiting Payment",
      value: requests.filter((r) => r.status === "APPROVED").length,
      icon: CreditCard,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.label}
            className="group relative overflow-hidden border-0 bg-gradient-to-br from-white via-card to-muted/40 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-26px_rgba(15,23,42,0.5)] dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/80"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent opacity-80" />
            <CardContent className="relative flex items-center justify-between p-5 sm:p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                {showSkeleton ? (
                  <Skeleton className="mt-1 h-8 w-12 rounded-md" />
                ) : (
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                )}
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/10 dark:text-emerald-300">
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
