import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('admin-theme');if(t==='dark'||(!t&&true)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors">

        <SessionProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
