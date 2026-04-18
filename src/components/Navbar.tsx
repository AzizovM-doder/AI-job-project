'use client';

import { useAuth } from '@/hooks/useAuth';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Briefcase, Home, MessageSquare,
  Globe, Sun, Moon, User, LogOut, ChevronDown, Bell, Network, Search, Menu, Building2
} from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useNotificationQueries } from '@/hooks/queries/useNotificationQueries';
import { useMessageQueries } from '@/hooks/queries/useMessageQueries';
import { useState } from 'react';
import NotificationDropdown from './notifications/NotificationDropdown';
import MobileDrawer from './MobileDrawer';

const NavLink = ({ href, icon: Icon, label, pathname, badge }: {
  href: string; icon: React.ElementType; label: string; pathname: string; badge?: number;
}) => {
  const isActive = pathname === href || pathname.startsWith(href + '/');
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            'group relative flex items-center justify-center min-w-[64px] h-[52px] transition-all',
            isActive
              ? 'text-foreground border-b-2 border-foreground'
              : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-muted-foreground/30'
          )}
        >
          <div className="relative">
            <Icon className={cn("size-5 transition-transform group-active:scale-95")} strokeWidth={isActive ? 2.5 : 2} />
            {badge !== undefined && badge > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] flex items-center justify-center bg-destructive text-[10px] font-bold text-destructive-foreground rounded-full px-1 border-2 border-background">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="font-bold">
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { useGetNotificationsPaged } = useNotificationQueries();
  const { useGetConversations } = useMessageQueries();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const t = useTranslations('Nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  // Badge data
  const { data: notificationsPaged } = useGetNotificationsPaged({ userId: user?.userId ? Number(user.userId) : 0, PageSize: 10 });
  const unreadNotifications = notificationsPaged?.items.filter(n => !n.isRead).length || 0;

  const { data: conversations } = useGetConversations();
  const unreadMessages = conversations?.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0) || 0;

  const changeLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath || `/${newLocale}`);
  };

  const navLinks = [
    { href: `/${locale}/feed`, icon: Home, label: t('feed'), badge: 0 },
    { href: `/${locale}/networking`, icon: Network, label: 'Network', badge: 0 },
    { href: `/${locale}/organizations`, icon: Building2, label: 'Organizations', badge: 0 },
    { href: `/${locale}/jobs`, icon: Briefcase, label: t('jobs'), badge: 0 },
    { href: `/${locale}/messages`, icon: MessageSquare, label: t('messages'), badge: unreadMessages },
  ];

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 h-14 md:h-[52px] flex items-center justify-between gap-4">

          {/* Logo & Search */}
          <div className="flex items-center gap-2 flex-1 max-w-[400px]">
            <Link href={`/${locale}`} className="flex items-center group shrink-0">
              <div className="size-8 rounded-sm bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-black text-lg">ai</span>
              </div>
            </Link>

            <form onSubmit={handleSearch} className="relative hidden sm:block flex-1 group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, people..."
                className="w-full bg-muted/50 h-[34px] pl-10 pr-4 rounded-md text-sm border border-transparent focus:border-primary/20 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/70"
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0 lg:gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} pathname={pathname} />
            ))}

            {user && <NotificationDropdown userId={Number(user.userId)} />}

            {/* User Menu Desktop */}
            <div className="flex items-center border-l ml-4 pl-4 gap-1 h-[52px]">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex flex-col items-center justify-center min-w-[64px] h-[52px] group hover:text-foreground text-muted-foreground transition-colors">
                      <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border shadow-sm group-hover:border-primary/50 transition-colors">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt="Me" className="size-full object-cover" />
                        ) : (
                          <User className="size-4" />
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 mt-1">
                        <span className="text-[0.65rem] font-bold leading-[1] uppercase tracking-tighter">Me</span>
                        <ChevronDown className="size-3 opacity-60" />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-1 shadow-2xl rounded-xl">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-bold truncate">{user.fullName || user.userName}</p>
                      <p className="text-[11px] text-muted-foreground truncate uppercase tracking-wider">{user.role}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/${locale}/profile`)} className="rounded-lg">
                      <User className="mr-2 size-4" /> View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(user.role === 'Organization' ? `/${locale}/organization/dashboard` : `/${locale}/candidate/dashboard`)} className="rounded-lg">
                      <Home className="mr-2 size-4" /> Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="rounded-lg">
                        {theme === 'dark' ? <Moon className="mr-2 size-4" /> : <Sun className="mr-2 size-4" />}
                        <span>Appearance</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="rounded-xl shadow-xl">
                        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="rounded-lg">
                        <Globe className="mr-2 size-4" />
                        <span>Language</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="rounded-xl shadow-xl">
                        <DropdownMenuItem onClick={() => changeLocale('en')}>English</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeLocale('ru')}>Русский</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeLocale('tj')}>Тоҷикӣ</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive rounded-lg">
                      <LogOut className="mr-2 size-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2 px-2">
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/login`)}>Join Now</Button>
                  <Button variant="default" size="sm" onClick={() => router.push(`/${locale}/register`)} className="font-bold">Sign In</Button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full"
                  onClick={() => router.push(`/${locale}/notifications`)}
                >
                  <Bell className="size-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 size-2 bg-destructive rounded-full border border-background" />
                  )}
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Menu className="size-6" />
            </Button>
          </div>
        </div>

        <MobileDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          user={user}
          logout={logout}
          navLinks={[...navLinks, { href: `/${locale}/notifications`, icon: Bell, label: 'Notifications', badge: unreadNotifications }]}
          pathname={pathname}
        />
      </header>
    </TooltipProvider>
  );
}
