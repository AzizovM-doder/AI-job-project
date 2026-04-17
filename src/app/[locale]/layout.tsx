import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Providers from "@/components/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";


const inter = Inter({
  variable: "--font-sans",
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
      className={cn("h-full", "antialiased", inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col font-sans overflow-x-hidden text-[0.9375rem] leading-normal">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Providers>
            <NextIntlClientProvider locale={locale}>
              <Navbar />
              <main className="flex-1 w-full">
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
