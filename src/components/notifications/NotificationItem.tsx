'use client';

import { Notification, NotificationType } from '@/src/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Briefcase, MessageSquare, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onClick?: (id: number) => void;
  className?: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case NotificationType.JobMatched:
      return <Briefcase className="size-4 text-blue-500" />;
    case NotificationType.NewMessage:
      return <MessageSquare className="size-4 text-green-500" />;
    case NotificationType.ApplicationStatusChanged:
      return <CheckCircle className="size-4 text-orange-500" />;
    default:
      return <Bell className="size-4 text-primary" />;
  }
};

export default function NotificationItem({ notification, onClick, className }: NotificationItemProps) {
  return (
    <div
      onClick={() => onClick?.(notification.id)}
      className={cn(
        "flex gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50 border-b last:border-0",
        !notification.isRead && "bg-primary/5",
        className
      )}
    >
      <div className={cn(
        "size-10 rounded-full flex items-center justify-center shrink-0 border",
        !notification.isRead ? "bg-background border-primary/20" : "bg-muted/20 border-transparent"
      )}>
        {getIcon(notification.type)}
      </div>

      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={cn(
            "text-sm leading-tight truncate",
            !notification.isRead ? "font-bold text-foreground" : "text-muted-foreground"
          )}>
            {notification.title || 'Notification'}
          </p>
          {!notification.isRead && (
            <div className="size-2 rounded-full bg-primary shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-medium">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
