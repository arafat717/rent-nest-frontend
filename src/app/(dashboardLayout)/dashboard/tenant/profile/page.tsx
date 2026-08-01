import { Card, CardContent } from "@/components/ui/card";
import { ProfileInfoForm } from "@/components/dashboard/profile/ProfileInfoForm";

export default function TenantProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account information
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <ProfileInfoForm />
        </CardContent>
      </Card>
    </div>
  );
}
