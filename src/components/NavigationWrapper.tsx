'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocale } from 'next-intl';

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();

  // Strictly define auth paths to hide navigation
  const isAuthPage = 
    pathname === `/${locale}/login` || 
    pathname === `/${locale}/register` ||
    pathname.startsWith(`/${locale}/login/`) ||
    pathname.startsWith(`/${locale}/register/`);

  if (isAuthPage) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </>
  );
}
