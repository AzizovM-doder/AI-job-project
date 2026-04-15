'use client';

import { useAuthStore } from '@/src/store/authStore';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Briefcase, Rss, Sparkles, MessageSquare,
  Globe, Sun, Moon, User, LogOut, ChevronDown, Bell, Network
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
import { useNotifications } from '@/src/hooks/useNotifications';

const NavLink = ({ href, icon: Icon, label, pathname }: {
  href: string; icon: React.ElementType; label: string; pathname: string;
}) => {
  const isActive = pathname === href || pathname.startsWith(href + '/');
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </Link>
  );
};

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { useGetNotifications } = useNotifications();
  const t = useTranslations('Nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  const { data: notifications } = useGetNotifications();
  const unreadCount = notifications?.items.filter(n => !n.isRead).length || 0;

  const changeLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath || `/${newLocale}`);
  };

  const navLinks = [
    { href: `/${locale}/jobs`, icon: Briefcase, label: t('jobs') },
    { href: `/${locale}/feed`, icon: Rss, label: t('feed') },
    { href: `/${locale}/networking`, icon: Network, label: 'NET' },
    { href: `/${locale}/ai/tools`, icon: Sparkles, label: t('ai_tools') },
    { href: `/${locale}/messages`, icon: MessageSquare, label: t('messages') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b glass">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="size-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-xs">ai</span>
          </div>
          <span className="font-black tracking-tight text-sm hidden sm:block">
            AIJOB<span className="text-primary">_SYS</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} pathname={pathname} />
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Notifications */}
          <div className="relative mr-1">
            <Button variant="ghost" size="icon" className="size-8" onClick={() => router.push(`/${locale}/notifications`)}>
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 size-2 bg-primary animate-pulse rounded-full border border-background"></span>
              )}
            </Button>
          </div>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs font-mono min-w-[120px]">
              <DropdownMenuItem onClick={() => setTheme('light')} className={theme === 'light' ? 'text-primary font-bold' : ''}>
                <Sun className="mr-2 size-3.5" /> {t('theme_light')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className={theme === 'dark' ? 'text-primary font-bold' : ''}>
                <Moon className="mr-2 size-3.5" /> {t('theme_dark')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme('system')}>{t('theme_system')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 h-8 px-2 text-xs font-bold">
                <Globe className="size-3.5" />
                {locale.toUpperCase()}
                <ChevronDown className="size-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs font-mono min-w-[140px]">
              <DropdownMenuItem onClick={() => changeLocale('en')} className={locale === 'en' ? 'text-primary font-bold' : ''}>EN — English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLocale('ru')} className={locale === 'ru' ? 'text-primary font-bold' : ''}>RU — Русский</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLocale('tj')} className={locale === 'tj' ? 'text-primary font-bold' : ''}>TJ — Тоҷикӣ</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Controls */}
          <div className="flex items-center gap-1.5 pl-1.5 ml-1 border-l border-border">
            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-bold gap-1.5"
                  onClick={() => router.push(user.role === 'Organization' ? `/${locale}/organization/dashboard` : `/${locale}/candidate/dashboard`)}
                >
                  <User className="size-3.5" />
                  <span className="hidden sm:inline">{t('portal')}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-destructive"
                  onClick={logout}
                  title={t('logout')}
                >
                  <LogOut className="size-3.5" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs font-bold"
                  onClick={() => router.push(`/${locale}/login`)}
                >
                  {t('login')}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 text-xs font-bold"
                  onClick={() => router.push(`/${locale}/register`)}
                >
                  {t('register')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-2 scrollbar-none">
        {navLinks.map((link) => (
          <NavLink key={link.href} {...link} pathname={pathname} />
        ))}
      </div>
    </header>
  );
}
