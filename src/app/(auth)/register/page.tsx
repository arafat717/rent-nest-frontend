import { RegisterForm } from "@/components/module/Auth/SingUp";


export default function RegisterPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Join RentNest as a tenant or landlord
          </p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
