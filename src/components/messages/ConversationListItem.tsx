'use client';

import { useProfileQueries } from '@/hooks/queries/useProfileQueries';
import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { User, Archive, ArchiveRestore } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { ConversationListItemDto } from '@/types/message';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface ConversationListItemProps {
  conversation: ConversationListItemDto;
  isActive: boolean;
  onSelect: (id: number) => void;
  isArchived?: boolean;
  onToggleArchive?: (id: number) => void;
}

/**
 * Individual conversation item that handles its own profile fetching.
 * Leverages TanStack Query caching to avoid redundant network requests.
 * Includes smooth motion animations for archiving transitions.
 */
export default function ConversationListItem({
  conversation,
  isActive,
  onSelect,
  isArchived,
  onToggleArchive
}: ConversationListItemProps) {
  const t = useTranslations('Messages');
  const { user: currentUser } = useAuthStore();
  const { useGetProfileByUserId } = useProfileQueries();

  const currentUserId = parseInt(currentUser?.userId || '0');
  const otherUserId = conversation.user1Id === currentUserId ? conversation.user2Id : conversation.user1Id;

  // Individual fetch per item - TanStack Query handles caching
  const { data: profile, isLoading } = useGetProfileByUserId(otherUserId);
  const hasUnread = conversation.unreadCount > 0;

  const handleArchiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleArchive) {
      onToggleArchive(conversation.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ 
        opacity: 0, 
        x: isArchived ? -20 : 20, 
        height: 0,
        transition: { duration: 0.3, ease: "easeInOut" }
      }}
      onClick={() => onSelect(conversation.id)}
      className={cn(
        "px-5 py-4 flex gap-3 cursor-pointer transition-all duration-200 relative group overflow-hidden",
        isActive
          ? "bg-primary/5 dark:bg-primary/10"
          : "hover:bg-muted/40"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      )}

      <div className="relative shrink-0">
        <div className={cn(
          "size-12 rounded-full flex items-center justify-center overflow-hidden border border-border/40 bg-muted",
          isActive && "border-primary/50"
        )}>
          {isLoading ? (
            <Skeleton className="size-full rounded-full" />
          ) : profile?.photoUrl ? (
            <img src={profile.photoUrl} alt="User" className="size-full object-cover" />
          ) : (
            <div className="size-full flex items-center justify-center text-muted-foreground">
              <User className="size-6" />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          {isLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <span className={cn(
              "text-[0.9375rem] truncate",
              hasUnread ? "font-bold text-foreground" : "font-semibold text-foreground/90"
            )}>
              {profile ? (profile.fullName || (profile.firstName ? `${profile.firstName} ${profile.lastName || ''}` : `User ${otherUserId}`)) : `User ${otherUserId}`}
            </span>
          )}
          <span className="text-[11px] font-medium text-muted-foreground/60 tabular-nums ml-2 shrink-0 group-hover:opacity-0 transition-opacity">
            {conversation.lastMessageAt ? formatDistanceToNowStrict(new Date(conversation.lastMessageAt)) : ''}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <p className={cn(
            "text-xs truncate flex-1",
            hasUnread ? "font-bold text-primary" : "text-muted-foreground/70"
          )}>
            {conversation.lastMessagePreview || '...'}
          </p>

          {hasUnread && !isArchived && (
            <div className="size-2 rounded-full bg-primary shrink-0 group-hover:opacity-0 transition-opacity" />
          )}
        </div>
      </div>

      {/* Archive/Unarchive Action Button */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
        <Button
          onClick={handleArchiveClick}
          size="sm"
          variant="outline"
          className="size-8 p-0 rounded-full bg-background/80 backdrop-blur-sm border-border/40 hover:bg-primary hover:text-primary-foreground shadow-sm"
          title={isArchived ? t('unarchive') : t('archive')}
        >
          {isArchived ? (
            <ArchiveRestore className="size-3.5" />
          ) : (
            <Archive className="size-3.5" />
          )}
        </Button>
      </div>
    </motion.div>
  );
}

