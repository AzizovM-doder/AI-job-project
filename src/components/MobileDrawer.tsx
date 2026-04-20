'use client';

import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { 
  X, User, Globe, Moon, Sun, 
  LogOut, Orbit, Terminal, 
  ChevronRight, Sparkles, Building2,
  Home, Network, Briefcase, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  logout: () => void;
  navLinks: any[];
  pathname: string;
}

export default function MobileDrawer({ isOpen, onClose, user, logout, navLinks, pathname }: MobileDrawerProps) {
  const locale = useLocale();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const t = useTranslations('Nav');

  const handleNavigation = (href: string) => {
    onClose();
    // Use a small timeout to let the drawer begin closing before navigation
    setTimeout(() => {
      router.push(href);
    }, 100);
  };

  const changeLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath || `/${newLocale}`);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-background/80 backdrop-blur-2xl border-l border-white/10 flex flex-col overflow-hidden">
        {/* Header Design */}
        <div className="relative h-48 flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_100%)] opacity-80" />
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="size-16 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(var(--primary),0.3)] mb-4"
          >
            <Orbit className="size-10 text-white" />
          </motion.div>
          
          <SheetTitle className="text-2xl font-black tracking-tighter uppercase italic text-foreground">
            Mars Job <span className="text-primary">Network</span>
          </SheetTitle>
          <div className="flex items-center gap-2 mt-2">
             <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sector 7 Uplink Active</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 custom-scrollbar">
          {/* Nav Links Section */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-primary/50 uppercase tracking-[0.3em] pl-2 border-l-2 border-primary/20">Navigation Routes</h3>
            <nav className="grid gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavigation(link.href)}
                    className={cn(
                      "group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative overflow-hidden",
                      isActive 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-muted-foreground hover:bg-white/5 border border-transparent"
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="nav-active-mobile"
                        className="absolute inset-0 bg-primary/5 -z-10"
                      />
                    )}
                    <Icon className={cn("size-5 transition-transform group-active:scale-90", isActive && "text-primary")} />
                    <span className={cn("text-xs font-bold uppercase tracking-widest", isActive && "font-black")}>{link.label}</span>
                    {link.badge > 0 && (
                      <span className="ml-auto bg-primary text-primary-foreground text-[8px] font-black size-5 rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                        {link.badge}
                      </span>
                    )}
                    <ChevronRight className={cn("ml-auto size-4 opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 transition-all", isActive && "opacity-40 translate-x-0")} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Section (If logged in) */}
          {user ? (
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-primary/50 uppercase tracking-[0.3em] pl-2 border-l-2 border-primary/20">Personnel Dossier</h3>
              <div 
                className="flex items-center gap-4 p-4 glass-card rounded-[2rem] border-white/5 group active:scale-[0.98] transition-transform"
                onClick={() => handleNavigation(`/${locale}/profile`)}
              >
                <div className="size-14 rounded-2xl bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20 group-hover:border-primary/50 transition-colors">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="size-full object-cover" />
                  ) : (
                    <User className="size-7 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm uppercase tracking-tight truncate">{user.fullName || user.userName}</p>
                  <p className="text-[9px] text-primary font-bold uppercase tracking-widest mt-1 opacity-60">Status: {user.role}</p>
                </div>
                <div className="size-8 rounded-full bg-white/5 flex items-center justify-center">
                  <ChevronRight className="size-4 opacity-40" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
               <h3 className="text-[10px] font-black text-primary/50 uppercase tracking-[0.3em] pl-2 border-l-2 border-primary/20">Unauthorized Access</h3>
               <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full h-14 rounded-[1.5rem] bg-primary font-black uppercase text-xs tracking-widest"
                    onClick={() => handleNavigation(`/${locale}/register`)}
                  >
                    Join Crew
                  </Button>
                  <Button 
                    variant="ghost"
                    className="w-full h-14 rounded-[1.5rem] bg-white/5 font-black uppercase text-xs tracking-widest"
                    onClick={() => handleNavigation(`/${locale}/login`)}
                  >
                    Sign In
                  </Button>
               </div>
            </div>
          )}

          {/* Settings Section */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
               <h3 className="text-[10px] font-black text-primary/50 uppercase tracking-[0.3em]">Signal Freq</h3>
               <div className="flex flex-col gap-2">
                 {['en', 'ru', 'tj'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLocale(lang)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all",
                        locale === lang 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-white/5 text-muted-foreground hover:bg-white/10"
                      )}
                    >
                      {lang === 'en' ? 'Earth' : lang === 'ru' ? 'Sector' : 'Colony'}
                      <span className="opacity-40">{lang.toUpperCase()}</span>
                    </button>
                 ))}
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-[10px] font-black text-primary/50 uppercase tracking-[0.3em]">Interface Skin</h3>
               <div className="flex flex-col gap-2">
                 {[
                   { id: 'light', icon: Sun, label: 'Day' },
                   { id: 'dark', icon: Moon, label: 'Deep' },
                   { id: 'terminal', icon: Terminal, label: 'Rover' }
                 ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all",
                        theme === t.id 
                          ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(var(--primary),0.3)]" 
                          : "bg-white/5 text-muted-foreground hover:bg-white/10"
                      )}
                    >
                      <t.icon className="size-3.5" />
                      {t.label}
                    </button>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {user && (
          <div className="p-6 border-t border-white/5 bg-white/[0.02]">
            <Button 
              variant="ghost" 
              className="w-full h-14 justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-2xl px-6 font-black uppercase text-xs tracking-[0.2em]"
              onClick={() => { logout(); onClose(); }}
            >
              <LogOut className="mr-4 size-5" /> Eject Link
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
