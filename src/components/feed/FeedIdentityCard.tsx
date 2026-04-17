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
    <Card className="overflow-hidden shadow-sm border-border/60">
      <div className="h-14 bg-gradient-to-r from-primary/20 to-accent/20 relative">
        {profile?.backgroundPhotoUrl && (
          <img src={profile.backgroundPhotoUrl} alt="Banner" className="size-full object-cover opacity-50" />
        )}
      </div>
      <CardContent className="px-3 pb-4">
        <div className="flex flex-col items-center -mt-8 mb-4">
          <div className="size-16 rounded-full bg-background border-2 border-background overflow-hidden shadow-sm shadow-black/10">
            {profile?.photoUrl || user.avatarUrl ? (
              <img src={profile?.photoUrl || user.avatarUrl!} alt={user.fullName || 'User'} className="size-full object-cover" />
            ) : (
              <div className="size-full bg-muted flex items-center justify-center text-muted-foreground/60">
                <User className="size-8" strokeWidth={1.5} />
              </div>
            )}
          </div>
          <Link
            href={`/${locale}/profile`}
            className="mt-3 text-base font-bold hover:underline decoration-1 flex items-center gap-1"
          >
            {user.fullName || user.userName}
            {user.role === 'Organization' && <ShieldCheck className="size-3.5 text-primary" />}
          </Link>

          {isLoading ? (
            <Skeleton className="h-3 w-32 mt-2" />
          ) : (
            <p className="text-xs text-muted-foreground mt-1 text-center line-clamp-2 px-2">
              {profile?.headline || user.role}
            </p>
          )}
        </div>

        <div className="border-t pt-3 space-y-2 mt-2">
          <div className="flex justify-between text-xs group cursor-pointer">
            <span className="text-muted-foreground font-medium group-hover:text-primary transition-colors">Connections</span>
            <span className="text-primary font-bold">--</span>
          </div>
          <div className="flex justify-between text-xs group cursor-pointer">
            <span className="text-muted-foreground font-medium group-hover:text-primary transition-colors">Experience</span>
            <span className="text-primary font-bold">{profile?.experienceYears || 0}y</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
