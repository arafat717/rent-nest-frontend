"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("location", query);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative flex min-h-[480px] items-center justify-center bg-gradient-to-b from-primary/10 to-background px-4 text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Find & List Rental Properties with Ease
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse thousands of verified rentals or list your property in minutes.
        </p>

        <div className="mx-auto flex max-w-md items-center gap-2 rounded-lg border bg-background p-2 shadow-sm">
          <Search className="ml-2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by city or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="border-none shadow-none focus-visible:ring-0"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      </div>
    </section>
  );
}
