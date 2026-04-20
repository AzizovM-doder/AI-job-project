import { cn } from "@/lib/utils";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import NavigationWrapper from "@/components/NavigationWrapper";
import { TerminalBootManager } from "@/components/ThemeProvider";
import MutationToastHandler from "@/components/MutationToastHandler";

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
    <NextIntlClientProvider locale={locale}>
      <MutationToastHandler />
      <TerminalBootManager />
      <NavigationWrapper>
        <main className="flex-1 w-full relative z-10">
          <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 lg:py-12">
            {children}
          </div>
        </main>
      </NavigationWrapper>
    </NextIntlClientProvider>
  );
}
