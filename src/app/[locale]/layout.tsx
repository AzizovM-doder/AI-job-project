import "./globals.css";
import { cn } from "@/lib/utils";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Providers from "@/components/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavigationWrapper from "@/components/NavigationWrapper";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import MarsBackgroundWrapped from "@/components/MarsBackgroundWrapped";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MARS JOB | RED PLANET NETWORK",
  description: "The premium professional network for the Martian era.",
  icons: {
    icon: "/logo.png",
  }
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
      className={cn("h-full", spaceGrotesk.variable, inter.variable)}
      suppressHydrationWarning
    >
      <body className={cn(
        "min-h-screen flex flex-col font-sans overflow-x-hidden text-[0.9375rem] leading-normal antialiased",
        "selection:bg-primary/30 selection:text-foreground"
      )}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <MarsBackgroundWrapped />
          <Providers>
            <NextIntlClientProvider locale={locale}>
              <NavigationWrapper>
                <main className="flex-1 w-full relative z-10">
                  <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 lg:py-12">
                    {children}
                  </div>
                </main>
              </NavigationWrapper>
            </NextIntlClientProvider>
          </Providers>
        </ThemeProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
