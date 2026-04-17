'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, MoreHorizontal, Check, Settings } from 'lucide-react';
import { useNotificationQueries } from '@/hooks/queries/useNotificationQueries';
import NotificationItem from './NotificationItem';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationDropdown({ userId }: { userId: number }) {
  const { useGetNotificationsPaged, useMarkAsRead } = useNotificationQueries();
  const { data: notificationsPaged, isLoading } = useGetNotificationsPaged({ userId, PageSize: 5 });
  const markAsRead = useMarkAsRead();
  const locale = useLocale();

  const unreadCount = notificationsPaged?.items.filter(n => !n.isRead).length || 0;

  const handleMarkAsRead = (id: number) => {
    markAsRead.mutate(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex flex-col items-center justify-center min-w-[64px] h-[52px] group hover:text-foreground text-muted-foreground transition-colors group">
          <div className="relative">
            <Bell className="size-6 md:size-5 transition-transform group-active:scale-95" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] flex items-center justify-center bg-destructive text-[10px] font-bold text-destructive-foreground rounded-full px-1 border-2 border-background animate-in zoom-in">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          {/* Label removed for desktop, shown in mobile menu via separate logic or tooltip will handle desktop */}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[360px] p-0 mt-1 shadow-2xl rounded-xl overflow-hidden border-border/60">
        <div className="flex items-center justify-between p-4 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <h3 className="font-bold text-sm tracking-tight">Notifications</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="size-8">
              <Settings className="size-4" />
            </Button>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notificationsPaged?.items.length ? (
            notificationsPaged.items.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onClick={handleMarkAsRead}
              />
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="bg-muted/30 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="size-8 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-bold text-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground mt-1">We'll notify you when something happens.</p>
            </div>
          )}
        </div>

        <Link
          href={`/${locale}/notifications`}
          className="block p-3 text-center text-xs font-bold text-primary hover:bg-primary/5 transition-colors border-t border-border/60"
        >
          View all notifications
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
