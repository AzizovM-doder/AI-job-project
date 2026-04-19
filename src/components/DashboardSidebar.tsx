"use client";

import { useAuth } from '@/hooks/useAuth';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  User, Briefcase, MessageSquare, Home, 
  Settings, LogOut, Shield, ChevronRight,
  TrendingUp, Award, Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Nav');

  const links = [
    { href: `/${locale}/feed`, icon: Home, label: 'Feed' },
    { href: `/${locale}/networking`, icon: Users, label: 'Crew' },
    { href: `/${locale}/jobs`, icon: Briefcase, label: 'Missions' },
    { href: `/${locale}/messages`, icon: MessageSquare, label: 'Comms' },
  ];

  return (
    <div className="flex flex-col space-y-8">
      {/* Profile Card */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="relative group p-6 rounded-2xl glass-card overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-2 opacity-20">
          <Orbit className="size-12 text-primary" />
        </div>
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="size-20 rounded-full bg-primary/20 border-2 border-primary/40 p-1 group-hover:border-primary transition-colors">
            <div className="size-full rounded-full bg-black/40 overflow-hidden">
               {user?.avatarUrl ? (
                 <img src={user.avatarUrl} alt="Me" className="size-full object-cover" />
               ) : (
                 <User className="size-full p-4 text-primary" />
               )}
            </div>
          </div>
          <div>
            <h3 className={cn(spaceGrotesk.className, "text-xl font-bold text-white")}>
              {user?.fullName || user?.userName}
            </h3>
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-1 italic">
              Level {user?.role === 'Organization' ? 'Alpha' : 'Delta'} Observer
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
          <div className="text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Rank</p>
            <p className="text-sm font-bold text-white mt-1">#422</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Rel</p>
            <p className="text-sm font-bold text-white mt-1">98%</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <motion.div
                whileHover={{ x: 5 }}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl transition-all group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <link.icon className="size-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">{link.label}</span>
                </div>
                {isActive && <ChevronRight className="size-4" />}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Tertiary Actions */}
      <div className="pt-8 space-y-4">
        <button 
          onClick={() => router.push(`/${locale}/profile`)}
          className="flex items-center gap-4 px-4 text-white/40 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <Settings className="size-4" />
          Settings
        </button>
        <button 
          onClick={logout}
          className="flex items-center gap-4 px-4 text-white/40 hover:text-destructive transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <LogOut className="size-4" />
          Eject Mission
        </button>
      </div>
    </div>
  );
}

// Helper icons
function Orbit({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0" />
      <path d="M5 5l1.5 1.5" />
      <path d="M17.5 17.5L19 19" />
      <path d="M19 5l-1.5 1.5" />
      <path d="M6.5 17.5L5 19" />
    </svg>
  );
}
