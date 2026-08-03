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
      sub: stats ? `${stats.totalTenants} tenants · ${stats.totalLandlords} landlords` : "",
      icon: Users,
    },
    { label: "Total Properties", value: stats?.totalProperties ?? 0, icon: Building2 },
    { label: "Pending Requests", value: stats?.pendingRequests ?? 0, icon: ClipboardList },
    {
      label: "Total Revenue",
      value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <Icon className="h-5 w-5 text-primary/60" />
              </div>
              {showSkeleton ? (
                <Skeleton className="mt-2 h-7 w-16" />
              ) : (
                <p className="mt-1 text-2xl font-bold">{card.value}</p>
              )}
              {card.sub && !showSkeleton && (
                <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}