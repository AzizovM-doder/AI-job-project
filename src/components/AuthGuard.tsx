'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types/auth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const { locale } = useParams();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  // Derive authorization status directly during render to avoid cascading renders
  const isAuthorized = isAuthenticated && (!allowedRoles || (user && allowedRoles.includes(user.role)));

  useEffect(() => {
    // Wait for hydration/rehydration from persisted store
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
    } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push(`/${locale}/unauthorized`);
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, router, locale]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
