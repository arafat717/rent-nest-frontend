import { PropertyForm } from "@/components/dashboard/Landlord/PropertyForm";


export default function NewPropertyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">List a New Property</h1>
        <p className="text-sm text-muted-foreground">
          Fill in the details tenants will see
        </p>
      </div>
      <PropertyForm />
    </div>
  );
}
