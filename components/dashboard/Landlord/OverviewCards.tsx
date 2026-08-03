"use client";

import { Building2, ClipboardList, DollarSign, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLandlordStatsQuery } from "@/redux/api/landlordApi";

export function OverviewCards() {
  const { data, isLoading, isFetching } = useGetLandlordStatsQuery();
  const showSkeleton = isLoading || isFetching;
  const stats = data?.data;

  const cards = [
    {
      label: "Total Properties",
      value: stats?.totalProperties ?? 0,
      icon: Building2,
    },
    {
      label: "Active Requests",
      value: stats?.activeRequests ?? 0,
      icon: ClipboardList,
    },
    { label: "Occupied", value: stats?.occupiedProperties ?? 0, icon: Home },
    {
      label: "Total Earnings",
      value: `$${(stats?.totalEarnings ?? 0).toLocaleString()}`,
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
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-80" />
            <CardContent className="relative flex items-center justify-between p-5 sm:p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </p>
                {showSkeleton ? (
                  <Skeleton className="mt-1 h-8 w-20 rounded-md" />
                ) : (
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {card.value}
                  </p>
                )}
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10">
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
