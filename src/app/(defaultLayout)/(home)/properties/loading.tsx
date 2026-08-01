import { PropertyGridSkeleton } from "@/components/property/PropertyGridSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <div className="h-96 rounded-lg border bg-muted/30" />
        <PropertyGridSkeleton count={9} />
      </div>
    </main>
  );
}
