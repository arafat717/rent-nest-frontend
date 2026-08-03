"use client";

import { Users, Building2, ClipboardList, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminStatsQuery } from "@/redux/api/adminApi";

export function OverviewCards() {
  const { data, isLoading, isFetching } = useGetAdminStatsQuery();
  const showSkeleton = isLoading || isFetching;
  const stats = data?.data;

  const cards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      sub: stats
        ? `${stats.totalTenants} tenants · ${stats.totalLandlords} landlords`
        : "",
      icon: Users,
    },
    {
      label: "Total Properties",
      value: stats?.totalProperties ?? 0,
      icon: Building2,
    },
    {
      label: "Pending Requests",
      value: stats?.pendingRequests ?? 0,
      icon: ClipboardList,
    },
    {
      label: "Total Revenue",
      value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.label}
            className="group relative overflow-hidden border-0 bg-gradient-to-br from-white via-card to-muted/40 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-26px_rgba(15,23,42,0.5)] dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/80"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent opacity-80" />
            <CardContent className="relative p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </p>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 ring-1 ring-violet-500/10 dark:text-violet-300">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              {showSkeleton ? (
                <Skeleton className="mt-4 h-8 w-20 rounded-md" />
              ) : (
                <p className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                  {card.value}
                </p>
              )}

              {card.sub && !showSkeleton && (
                <p className="mt-2 text-xs text-muted-foreground">{card.sub}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
