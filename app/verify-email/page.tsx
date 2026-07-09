import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { Card, CardContent } from "@/src/components/Card";
import { VerifyEmailStatus } from "@/src/components/VerifyEmailStatus";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token, email } = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-md mx-auto p-4 mt-12 w-full">
        <Card>
          <CardContent>
            <h1 className="text-2xl font-bold mb-6 text-center">Email verification</h1>
            {token && email ? (
              <VerifyEmailStatus token={token} email={email} />
            ) : (
              <p className="text-red-600">Missing verification token.</p>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
