import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/src/contexts/LanguageContext";
import { SessionProvider } from "@/src/components/SessionProvider";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "WorkerVoice | Migrant Worker Reviews",
  description:
    "Find safe workplaces with real reviews from migrant workers in Thailand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">

        <SessionProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
