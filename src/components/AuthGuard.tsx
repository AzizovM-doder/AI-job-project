'use client';

import { useEffect, useState } from 'react';
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
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    // Wait for hydration/rehydration
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push(`/${locale}/unauthorized`);
      return;
    }

    setIsAuthorized(true);
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
