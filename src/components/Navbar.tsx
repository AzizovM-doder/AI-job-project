'use client';

import { useAuth } from '@/hooks/useAuth';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Briefcase, Home, MessageSquare,
  Globe, Sun, Moon, User, LogOut, ChevronDown, Bell, Network, Terminal,
  Orbit,
  Cpu,
  type LucideIcon,
  Search,
  Sparkles
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTerminalBoot } from '@/components/ThemeProvider';
import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useNotificationQueries } from '@/hooks/queries/useNotificationQueries';
import { useMessageQueries } from '@/hooks/queries/useMessageQueries';
import { useOrganizationQueries } from '@/hooks/queries/useOrganizationQueries';
import { useState, useEffect } from 'react';
import NotificationDropdown from './notifications/NotificationDropdown';
import MobileDrawer from './MobileDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import { Space_Grotesk } from 'next/font/google';
import OrganizationSwitcher from './organization/OrganizationSwitcher';
import GlobalSearch from './GlobalSearch';
import { toast } from 'sonner';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

const NavLink = ({ href, icon: Icon, label, pathname, badge, mounted }: {
  href: string; icon: LucideIcon; label: string; pathname: string; badge?: number; mounted: boolean;
}) => {
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative flex items-center h-12 rounded-xl transition-all duration-500 overflow-hidden px-4 gap-0',
        isActive
          ? 'bg-primary/10 text-primary border border-primary/20'
          : 'text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent'
      )}
    >
      <Icon
        className={cn("size-4.5 shrink-0 transition-transform duration-500 group-active:scale-90")}
        strokeWidth={isActive ? 2.5 : 2}
      />

      <AnimatePresence initial={false}>
        {(isHovered || isActive) && (
          <motion.div
            initial={{ width: 0, opacity: 0, marginLeft: 0 }}
            animate={{
              width: "auto",
              opacity: 1,
              marginLeft: 10,
              transition: {
                width: { type: "spring", stiffness: 120, damping: 20 },
                opacity: { duration: 0.2, delay: 0.05 }
              }
            }}
            exit={{
              width: 0,
              opacity: 0,
              marginLeft: 0,
              transition: {
                width: { type: "spring", stiffness: 120, damping: 20 },
                opacity: { duration: 0.1 }
              }
            }}
            className="overflow-hidden whitespace-nowrap"
          >
            <span className="text-[10px] font-heading font-black uppercase tracking-[0.1em]">
              {label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {badge !== undefined && badge > 0 && (
        <span className="absolute top-2 right-2 min-w-[14px] h-[14px] flex items-center justify-center bg-primary text-[7px] font-black text-primary-foreground rounded-full px-1 border border-background shadow-lg shadow-primary/20">
          {badge > 9 ? '9+' : badge}
        </span>
      )}

      {isActive && mounted && !isHovered && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute inset-0 rounded-xl bg-primary/5 -z-10"
          transition={{ type: "spring", stiffness: 150, damping: 25 }}
        />
      )}
    </Link>
  );
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { useGetNotificationsPaged } = useNotificationQueries();
  const { useGetConversations } = useMessageQueries();
  const { useGetMyOrganizations } = useOrganizationQueries();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const t = useTranslations('Nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const { triggerTerminalBoot } = useTerminalBoot();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: notificationsPaged } = useGetNotificationsPaged({
    userId: user?.userId ? Number(user.userId) : 0,
    PageSize: 10
  });
  const unreadNotifications = notificationsPaged?.items.filter(n => !n.isRead).length || 0;

  const { data: conversations } = useGetConversations();
  const unreadMessages = conversations?.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0) || 0;

  const { data: orgData } = useGetMyOrganizations();
  const organizationList = Array.isArray(orgData) ? orgData : orgData ? [orgData] : [];
  const organization = organizationList[0];

  const springConfig = { type: "spring", stiffness: 100, damping: 20 };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err: any) {
      toast.error("Extraction Failed", { description: "Signal interference during logout protocol." });
    }
  };

  const navLinks = [
    { href: `/${locale}/feed`, icon: Home, label: t('feed') || "Baseline", badge: 0 },
    { href: `/${locale}/networking`, icon: Network, label: "Crew", badge: 0 },
    { href: `/${locale}/jobs`, icon: Briefcase, label: "Missions", badge: 0 },
    { href: `/${locale}/messages`, icon: MessageSquare, label: "Comms", badge: unreadMessages },
    { href: `/${locale}/ai`, icon: Sparkles, label: "Synthetics", badge: 0 },
  ];

  const displayName = organization?.name
    ? `${organization.name} (${user?.fullName || user?.userName})`
    : (user?.fullName || user?.userName || "New Crew Member");

  return (
    <TooltipProvider>
      <div className="fixed top-0 left-0 right-0 z-[9999] flex justify-center p-4 pointer-events-none sm:p-6">
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={mounted ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 25 }}
          className={cn(
            "pointer-events-auto flex items-center justify-between w-full max-w-7xl h-18 px-5 rounded-[2rem] transition-all duration-700",
            "backdrop-blur-[60px] border border-white/5 shadow-2xl relative",
            scrolled ? "bg-background/40 scale-[0.99] border-white/10" : "bg-black/20"
          )}
        >
          {/* Subtle top light hint */}
          <div className="absolute top-0 left-1/4 w-32 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <Link href={`/${locale}`} className="flex items-center gap-3 group/logo shrink-0 outline-none">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 15 }}
              transition={springConfig}
              className="size-10 rounded-[1rem] bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.4)] group-hover/logo:shadow-[0_0_40px_rgba(var(--primary),0.6)] transition-all relative text-white"
            >
              <Orbit className="size-6 z-10" />
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity" />
            </motion.div>
            <div className="flex flex-col">
              <span className={cn(spaceGrotesk.className, "text-lg font-black tracking-tighter uppercase leading-none text-foreground")}>
                Mars Job
              </span>
              <span className="text-[7px] font-bold tracking-[0.4em] uppercase text-primary/70 leading-none mt-1.5 italic flex items-center gap-1">
                Sector 7 <div className="size-1 rounded-full bg-primary animate-pulse" /> Uplink
              </span>
            </div>
          </Link>

          {/* Central Expando Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] rounded-2xl p-1 border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} pathname={pathname} mounted={mounted} />
            ))}
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            {user?.role === 'Organization' && <OrganizationSwitcher />}

            <div className="hidden sm:flex items-center gap-2 p-1 bg-white/[0.03] rounded-2xl border border-white/5">
              <GlobalSearch />
              {user && <NotificationDropdown userId={Number(user.userId)} />}
            </div>

            {user ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 pl-1.5 pr-4 h-12 rounded-2xl glass-card transition-all group overflow-hidden outline-none border-white/5 active:bg-white/[0.05]"
                  >
                    <div className="size-9 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20 shadow-inner group-hover:scale-105 transition-transform z-10">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="size-full object-cover" />
                      ) : (
                        <User className="size-4.5 text-primary" />
                      )}
                    </div>
                    <div className="flex flex-col items-start hidden sm:flex z-10 max-w-[140px] overflow-hidden">
                      <span className="text-[10px] font-heading font-black uppercase tracking-tight truncate w-full group-hover:text-primary transition-colors">{displayName}</span>
                      <span className="text-[7px] font-bold text-primary opacity-50 uppercase tracking-[0.15em]">
                        {user.role === 'Organization' ? 'MISSION CMDR' : 'EXP ENGINEER'}
                      </span>
                    </div>
                    <ChevronDown className="size-3.5 opacity-30 group-hover:translate-y-0.5 transition-all z-10 group-hover:opacity-100" />
                  </motion.button>
                </DropdownMenuTrigger>

                <DropdownMenuPortal>
                  <DropdownMenuContent align="end" className="w-[300px] mt-4 p-2 glass backdrop-blur-[80px] rounded-[2.5rem] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-[10000] animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-5 py-6 mb-2 bg-white/[0.03] rounded-[2rem] border border-white/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:rotate-12 transition-transform">
                        <Terminal className="size-10 text-primary" />
                      </div>
                      <p className="text-xs font-heading font-black truncate uppercase tracking-normal relative z-10 text-primary-foreground/90">{displayName}</p>
                      <div className="flex items-center gap-2 mt-2 relative z-10">
                        <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                        <p className="text-[9px] text-primary font-black uppercase tracking-[0.3em] opacity-80">{user.role}</p>
                      </div>
                    </div>

                    <DropdownMenuItem
                      onClick={() => router.push(`/${locale}/profile`)}
                      className="rounded-xl h-12 gap-4 px-4 focus:bg-white/5 focus:text-primary group cursor-pointer transition-all outline-none border border-transparent focus:border-white/5"
                    >
                      <User className="size-4.5 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      <span className="text-[10px] font-heading font-black uppercase tracking-widest">Dossier / XP</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push(user.role === 'Organization' ? `/${locale}/organization/dashboard` : `/${locale}/candidate/dashboard`)}
                      className="rounded-xl h-12 gap-4 px-4 focus:bg-white/5 focus:text-primary group cursor-pointer transition-all outline-none border border-transparent focus:border-white/5"
                    >
                      <Home className="size-4.5 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      <span className="text-[10px] font-heading font-black uppercase tracking-widest">Command Center</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-white/5 my-2 mx-2" />

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="rounded-xl h-12 gap-4 px-4 focus:bg-white/5 outline-none cursor-pointer">
                        <Cpu className="size-4.5 opacity-40" /> <span className="text-[10px] font-heading font-black uppercase tracking-widest">Interface Skin</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="w-56 rounded-[2rem] glass backdrop-blur-[60px] border-white/5 shadow-3xl p-2 z-[10001] animate-in slide-in-from-left-2">
                          <DropdownMenuItem onClick={() => setTheme('light')} className="rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:bg-white/10">Day Sector</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTheme('dark')} className="rounded-xl h-10 px-4 text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none focus:bg-white/10">Deep Space</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={triggerTerminalBoot}
                            className="bg-primary/10 text-primary font-black uppercase tracking-widest rounded-xl h-12 px-4 mt-2 hover:bg-primary/20 transition-all cursor-pointer outline-none"
                          >
                            <Terminal className="mr-3 size-4" />
                            Rover Console
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="rounded-xl h-12 gap-4 px-4 focus:bg-white/5 outline-none cursor-pointer">
                        <Globe className="size-4.5 opacity-40" /> <span className="text-[10px] font-heading font-black uppercase tracking-widest">Signal Freq</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="w-48 rounded-[2rem] glass backdrop-blur-[60px] border-white/5 shadow-3xl p-2 z-[10001] animate-in slide-in-from-left-2">
                          <DropdownMenuItem onClick={() => router.push(pathname.replace(`/${locale}`, '/en'))} className="rounded-xl h-10 px-4 text-[10px] font-black uppercase cursor-pointer outline-none focus:bg-white/10">EN / Earth</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(pathname.replace(`/${locale}`, '/ru'))} className="rounded-xl h-10 px-4 text-[10px] font-black uppercase cursor-pointer outline-none focus:bg-white/10">RU / Sector</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(pathname.replace(`/${locale}`, '/tj'))} className="rounded-xl h-10 px-4 text-[10px] font-black uppercase cursor-pointer outline-none focus:bg-white/10">TJ / Colony</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator className="bg-white/5 my-2 mx-2" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-xl h-12 gap-4 px-4 group cursor-pointer outline-none transition-all"
                    >
                      <LogOut className="size-4.5 group-hover:-translate-x-1 transition-transform" />
                      <span className="text-[10px] font-heading font-black uppercase tracking-[0.2em]">Eject Link</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/${locale}/login`)}
                  className="h-10 px-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-colors hidden sm:flex border-none"
                >
                  Sign In
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    onClick={() => router.push(`/${locale}/register`)}
                    className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] font-heading font-black uppercase tracking-[0.2em] rounded-xl px-7 shadow-lg shadow-primary/20 relative overflow-hidden group border-none"
                  >
                    <span className="relative z-10">Join Crew</span>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/10 group-hover:h-full transition-all" />
                  </Button>
                </motion.div>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden size-10 rounded-xl bg-white/[0.03] border border-white/5"
              onClick={() => setIsDrawerOpen(true)}
            >
              <div className="flex flex-col gap-1 items-center group">
                <div className="w-4 h-0.5 bg-foreground rounded-full group-hover:w-5 transition-all" />
                <div className="w-4 h-0.5 bg-primary rounded-full translate-x-0.5 group-hover:translate-x-0 transition-all" />
                <div className="w-4 h-0.5 bg-foreground rounded-full group-hover:w-5 transition-all" />
              </div>
            </Button>
          </div>
        </motion.header>
      </div>

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={user}
        logout={logout}
        navLinks={navLinks}
        pathname={pathname}
      />

      {/* Dynamic bottom subtle gradient separator */}
      <div className="h-24 relative overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>
    </TooltipProvider>
  );
}
