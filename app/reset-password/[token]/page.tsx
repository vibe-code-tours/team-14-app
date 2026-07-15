import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { Card, CardContent } from "@/src/components/Card";
import { ConfirmResetForm } from "@/src/components/ResetPasswordForm";

export default async function ConfirmResetPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-md mx-auto p-4 mt-12 w-full">
        <Card>
          <CardContent>
            <h1 className="text-2xl font-bold mb-6 text-center text-slate-800 dark:text-slate-100">Choose a new password</h1>
            <ConfirmResetForm token={token} />
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
