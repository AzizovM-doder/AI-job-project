'use client';

import { useAuthStore } from '@/store/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { User, ShieldCheck, Terminal, Radio } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useProfileQueries } from '@/hooks/queries/useProfileQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function FeedIdentityCard() {
  const { user } = useAuthStore();
  const locale = useLocale();
  const { useGetProfileByUserId } = useProfileQueries();

  const { data: profile, isLoading } = useGetProfileByUserId(parseInt(user?.userId || '0'));

  if (!user) return null;

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="group"
    >
      <Card className="glass-card bg-white/[0.03] backdrop-blur-2xl border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:border-primary/20">
        <div className="h-20 bg-black/40 relative overflow-hidden">
          {profile?.backgroundPhotoUrl && (
            <img 
              src={profile.backgroundPhotoUrl} 
              alt="Banner" 
              className="size-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 right-4 flex items-center gap-1.5">
            <Radio className="size-3 text-emerald-500 animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500/80">LINK_STABLE</span>
          </div>
        </div>

        <CardContent className="px-6 pb-8">
          <div className="flex flex-col items-center -mt-10 mb-6">
            <div className="size-20 rounded-3xl bg-black border-2 z-10 overflow-hidden border-white/10 shadow-3xl group-hover:border-primary/30 transition-all active:scale-95">
              {profile?.photoUrl || (user as any).avatarUrl ? (
                <img 
                  src={profile?.photoUrl || (user as any).avatarUrl!} 
                  alt={user.fullName || 'User'} 
                  className="size-full object-cover" 
                />
              ) : (
                <div className="size-full bg-white/5 flex items-center justify-center text-white/20">
                  <User className="size-10" strokeWidth={1} />
                </div>
              )}
            </div>
            
            <Link
              href={`/${locale}/profile/${user.userId}`}
              className="mt-5 flex flex-col items-center gap-1 group/name"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-heading font-black text-white tracking-tighter uppercase group-hover/name:text-primary transition-colors">
                  {user.fullName || (user as any).userName}
                </span>
                {user.role === 'Organization' && <ShieldCheck className="size-4 text-primary" />}
              </div>
              
              {isLoading ? (
                <Skeleton className="h-3 w-28 bg-white/5 rounded-full" />
              ) : (
                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] italic text-center leading-tight">
                  {profile?.headline || user.role || 'Sector Sentinel'}
                </p>
              )}
            </Link>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/5">
            {[
              { label: 'Network Connections', value: '42', color: 'primary' },
              { label: 'Profile Uplinks', value: '1.2k', color: 'white' }
            ].map((stat, i) => (
              <div key={i} className="flex justify-between items-center group/stat cursor-pointer">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/30 group-hover/stat:text-white/60 transition-colors">
                  {stat.label}
                </span>
                <span className={cn(
                  "text-[11px] font-black transition-colors",
                  stat.color === 'primary' ? 'text-primary' : 'text-white'
                )}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link href={`/${locale}/profile/${user.userId}`}>
              <button className="w-full h-11 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                <Terminal className="size-4 group-hover/btn:scale-110 transition-transform" />
                <span className="text-[10px] font-heading font-black uppercase tracking-[0.2em]">Open Dossier</span>
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
