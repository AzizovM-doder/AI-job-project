'use client';

import { useAuthStore } from '@/store/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { User, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useProfileQueries } from '@/hooks/queries/useProfileQueries';
import { Skeleton } from '@/components/ui/skeleton';

export default function FeedIdentityCard() {
  const { user } = useAuthStore();
  const locale = useLocale();
  const { useGetProfileByUserId } = useProfileQueries();

  const { data: profile, isLoading } = useGetProfileByUserId(parseInt(user?.userId || '0'));

  if (!user) return null;

  return (
    <Card className="overflow-hidden shadow-sm border-gray-200 bg-white rounded-xl">
      <div className="h-14 bg-gray-200 relative">
        {profile?.backgroundPhotoUrl && (
          <img src={profile.backgroundPhotoUrl} alt="Banner" className="size-full object-cover" />
        )}
      </div>
      <CardContent className="px-3 pb-4">
        <div className="flex flex-col items-center -mt-8 mb-4">
          <div className="size-16 rounded-full bg-white border-2 border-white overflow-hidden shadow-sm">
            {profile?.photoUrl || user.avatarUrl ? (
              <img src={profile?.photoUrl || user.avatarUrl!} alt={user.fullName || 'User'} className="size-full object-cover" />
            ) : (
              <div className="size-full bg-gray-100 flex items-center justify-center text-gray-400">
                <User className="size-8" strokeWidth={1.5} />
              </div>
            )}
          </div>
          <Link
            href={`/${locale}/profile`}
            className="mt-3 text-base font-bold text-gray-900 hover:underline decoration-2 flex items-center gap-1"
          >
            {user.fullName || user.userName}
            {user.role === 'Organization' && <ShieldCheck className="size-3.5 text-blue-600" />}
          </Link>

          {isLoading ? (
            <Skeleton className="h-3 w-32 mt-2 bg-gray-100" />
          ) : (
            <p className="text-xs text-gray-500 mt-1 text-center line-clamp-2 px-2 font-medium">
              {profile?.headline || user.role}
            </p>
          )}
        </div>

        <div className="border-t border-gray-100 pt-3 space-y-3 mt-2">
          <div className="flex justify-between text-[11px] group cursor-pointer font-bold">
            <span className="text-gray-500 group-hover:text-primary transition-colors">Connections</span>
            <span className="text-blue-600">--</span>
          </div>
          <div className="flex justify-between text-[11px] group cursor-pointer font-bold">
            <span className="text-gray-500 group-hover:text-primary transition-colors">Profile views</span>
            <span className="text-blue-600">--</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
