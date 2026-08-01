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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                {showSkeleton ? (
                  <Skeleton className="mt-1 h-7 w-10" />
                ) : (
                  <p className="text-2xl font-bold">{stat.value}</p>
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
