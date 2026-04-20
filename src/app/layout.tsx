import "./[locale]/globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/Providers";
import { ThemeProvider } from "@/components/ThemeProvider";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={cn("h-full", spaceGrotesk.variable, inter.variable)}
      suppressHydrationWarning
    >
      <body className={cn(
        "min-h-screen flex flex-col font-sans overflow-x-hidden text-[0.9375rem] leading-normal antialiased",
        "selection:bg-primary/30 selection:text-foreground"
      )}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <MarsBackgroundWrapped />
            {children}
          </ThemeProvider>
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
