'use client';

import { useAuthStore } from '@/src/store/authStore';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Briefcase, Home, MessageSquare,
  Globe, Sun, Moon, User, LogOut, ChevronDown, Bell, Network, Search
} from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useNotificationQueries } from '@/src/hooks/queries/useNotificationQueries';
import { useMessageQueries } from '@/src/hooks/queries/useMessageQueries';

const NavLink = ({ href, icon: Icon, label, pathname, badge }: {
  href: string; icon: React.ElementType; label: string; pathname: string; badge?: number;
}) => {
  const isActive = pathname === href || pathname.startsWith(href + '/');
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex flex-col items-center justify-center min-w-[64px] h-[52px] border-b-2 transition-all',
        isActive
          ? 'border-foreground text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      )}
    >
      <div className="relative">
        <Icon className={cn("size-6 transition-transform group-active:scale-95")} strokeWidth={isActive ? 2.5 : 2} />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] flex items-center justify-center bg-destructive text-[10px] font-bold text-destructive-foreground rounded-full px-1 border-2 border-background">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      <span className="text-[0.75rem] font-medium leading-[1] mt-1 hidden lg:block">
        {label}
      </span>
    </Link>
  );
};

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { useGetNotificationsPaged } = useNotificationQueries();
  const { useGetConversations } = useMessageQueries();
  
  const t = useTranslations('Nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  // Badge data
  const { data: notificationsPaged } = useGetNotificationsPaged({ PageSize: 10 });
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
    { href: `/${locale}/jobs`, icon: Briefcase, label: t('jobs'), badge: 0 },
    { href: `/${locale}/messages`, icon: MessageSquare, label: t('messages'), badge: unreadMessages },
    { href: `/${locale}/notifications`, icon: Bell, label: 'Notifications', badge: unreadNotifications },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 h-[52px] flex items-center gap-2 sm:gap-4">

        {/* Logo & Search */}
        <div className="flex items-center gap-2 flex-1 max-w-[400px]">
          <Link
            href={`/${locale}`}
            className="flex items-center group mr-1"
          >
            <div className="size-8 rounded-sm bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-lg">ai</span>
            </div>
          </Link>

          <div className="relative hidden sm:block flex-1 group">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="Search jobs, people, feed..."
              className="w-full bg-[#edf3f8] dark:bg-muted h-[34px] pl-10 pr-4 rounded-md text-sm border-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="sm:hidden size-9">
            <Search className="size-5" />
          </Button>
        </div>

        {/* Navigation Grid (Center/Right) */}
        <nav className="flex items-center justify-end flex-1 sm:flex-none">
          <div className="flex items-center">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} pathname={pathname} />
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center border-l ml-2 pl-2 gap-1 h-[52px]">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex flex-col items-center justify-center min-w-[64px] h-[52px] group hover:text-foreground text-muted-foreground transition-colors">
                    <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Me" className="size-full object-cover" />
                      ) : (
                        <User className="size-4" />
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 mt-1 hidden lg:flex">
                      <span className="text-[0.75rem] font-medium leading-[1]">Me</span>
                      <ChevronDown className="size-3 opacity-60" />
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-bold truncate">{user.fullName || user.userName}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(`/${locale}/profile`)}>
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(user.role === 'Organization' ? `/${locale}/organization/dashboard` : `/${locale}/candidate/dashboard`)}>
                    Manage Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {/* Appearance Submenu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                      <div className="flex items-center justify-between w-full px-2 py-1.5 text-sm hover:bg-muted rounded-sm cursor-default">
                        <div className="flex items-center">
                          {theme === 'dark' ? <Moon className="mr-2 size-4" /> : <Sun className="mr-2 size-4" />}
                          Appearance
                        </div>
                        <ChevronDown className="size-3 -rotate-90" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left" className="w-40 mr-1">
                      <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Language Submenu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                      <div className="flex items-center justify-between w-full px-2 py-1.5 text-sm hover:bg-muted rounded-sm cursor-default">
                        <div className="flex items-center">
                          <Globe className="mr-2 size-4" />
                          Language
                        </div>
                        <ChevronDown className="size-3 -rotate-90" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left" className="w-44 mr-1">
                      <DropdownMenuItem onClick={() => changeLocale('en')}>English</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeLocale('ru')}>Русский</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeLocale('tj')}>Тоҷикӣ</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 size-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2 px-2">
                <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/login`)}>Join Now</Button>
                <Button variant="outline" size="sm" onClick={() => router.push(`/${locale}/register`)}>Sign In</Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
