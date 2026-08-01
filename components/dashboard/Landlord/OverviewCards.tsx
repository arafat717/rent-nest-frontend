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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                {showSkeleton ? (
                  <Skeleton className="mt-1 h-7 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{card.value}</p>
                )}
              </div>
              <Icon className="h-8 w-8 text-primary/60" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
