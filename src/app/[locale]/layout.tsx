import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import Providers from "@/src/components/Providers";
import { ThemeProvider } from "@/src/components/ThemeProvider";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import { Toaster } from "@/components/ui/sonner";


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIJOB | TERMINAL ACCESS",
  description: "Advanced Job Search & Networking Platform",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};
 
export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={cn("h-full", "antialiased", geistMono.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col font-mono overflow-x-hidden text-sm">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Providers>
            <NextIntlClientProvider locale={locale}>
              <Navbar />
              <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-5 py-6 sm:py-8">
                {children}
              </main>
              <Footer />
            </NextIntlClientProvider>
          </Providers>
        </ThemeProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}