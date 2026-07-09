import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { Card, CardContent } from "@/src/components/Card";
import { RequestResetForm } from "@/src/components/ResetPasswordForm";

export default function RequestResetPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-md mx-auto p-4 mt-12 w-full">
        <Card>
          <CardContent>
            <h1 className="text-2xl font-bold mb-6 text-center">Reset your password</h1>
            <RequestResetForm />
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
