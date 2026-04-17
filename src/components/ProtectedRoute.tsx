'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('Candidate' | 'Organization')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore();
  const role = user?.role;
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  // Use a stable string representation for the allowedRoles dependency
  const rolesString = JSON.stringify(allowedRoles);

  useEffect(() => {
    // Safety: don't redirect if we are already on auth pages
    const isAuthPage = pathname.includes('/login') || pathname.includes('/register');
    
    if (!isLoading && !isAuthPage) {
      if (!user) {
        router.replace(`/${locale}/login`);
      } else if (allowedRoles && role && !allowedRoles.includes(role)) {
        router.replace(`/${locale}/unauthorized`);
      }
    }
  }, [user, role, isLoading, rolesString, router, locale, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-primary text-xl animate-pulse tracking-[0.5em] font-bold uppercase">
          LOADING_SYSTEM_RESOURCES...
        </div>
      </div>
    );
  }

  // If on login/register, just render children (the form)
  const isAuthPage = pathname.includes('/login') || pathname.includes('/register');
  if (isAuthPage) return <>{children}</>;

  if (!user || (allowedRoles && role && !allowedRoles.includes(role))) {
    return null;
  }

  return <>{children}</>;
}
