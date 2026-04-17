'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Globe, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

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

  const changeLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath || `/${newLocale}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[70] w-[280px] bg-background border-l shadow-2xl md:hidden flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-black text-xl text-primary tracking-tighter">AI-JOB</span>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="size-6" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto py-6">
              {user && (
                <div className="px-6 mb-8">
                  <div 
                    className="flex items-center gap-4 p-3 bg-muted/40 rounded-2xl border border-border/40"
                    onClick={() => { router.push(`/${locale}/profile`); onClose(); }}
                  >
                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Me" className="size-full object-cover" />
                      ) : (
                        <User className="size-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-tight">{user.fullName || user.userName}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{user.role}</p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="space-y-1 px-3">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                  return (
                    <button
                      key={link.href}
                      onClick={() => { router.push(link.href); onClose(); }}
                      className={cn(
                        "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
                        isActive 
                          ? "bg-primary/10 text-primary font-bold" 
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="size-5" />
                      <span className="text-sm">{link.label}</span>
                      {link.badge > 0 && (
                        <span className="ml-auto bg-destructive text-destructive-foreground size-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                          {link.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 px-6 space-y-6">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Appearance</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['light', 'dark', 'system'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={cn(
                          "py-2 text-[10px] rounded-lg border capitalize font-bold transition-all",
                          theme === t ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 hover:bg-muted border-transparent"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Language</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['en', 'ru', 'tj'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => changeLocale(lang)}
                        className={cn(
                          "py-2 text-[10px] rounded-lg border uppercase font-bold transition-all",
                          locale === lang ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 hover:bg-muted border-transparent"
                        )}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {user && (
              <div className="p-4 border-t">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                  onClick={() => { logout(); onClose(); }}
                >
                  <LogOut className="mr-3 size-5" /> Sign Out
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
