import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertiesTable } from "@/components/dashboard/Landlord/PropertiesTable";

export default function LandlordPropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Properties</h1>
          <p className="text-sm text-muted-foreground">
            Manage your listings and availability
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/landlord/properties/new">
            <PlusCircle className="mr-1.5 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>
      <PropertiesTable />
    </div>
  );
}
