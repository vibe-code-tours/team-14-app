import Link from "next/link";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import { Card, CardContent } from "@/src/components/Card";
import { RegisterForm } from "@/src/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-md mx-auto p-4 mt-12 w-full">
        <Card>
          <CardContent>
            <h1 className="text-2xl font-bold mb-6 text-center">Create an account</h1>
            <RegisterForm />
            <p className="text-sm text-gray-500 text-center mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-600 hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
