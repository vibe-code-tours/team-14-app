import Link from "next/link";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { Card, CardContent } from "@/src/components/Card";
import { RequestResetForm } from "@/src/components/ResetPasswordForm";

export default function RequestResetPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-md mx-auto p-4 mt-12 w-full">
        <Card>
          <CardContent>
            <h1 className="text-2xl font-bold mb-6 text-center">Reset your password</h1>
            <RequestResetForm />
            <p className="text-sm text-gray-500 text-center mt-6">
              <Link href="/demo" className="text-emerald-600 hover:underline">
                Try demo accounts →
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
