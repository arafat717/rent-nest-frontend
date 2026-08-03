import { PropertiesModerationTable } from "@/components/dashboard/admin/PropertiesModerationTable";

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Properties</h1>
        <p className="text-sm text-muted-foreground">
          Moderate listings across the platform
        </p>
      </div>
      <PropertiesModerationTable />
    </div>
  );
}
