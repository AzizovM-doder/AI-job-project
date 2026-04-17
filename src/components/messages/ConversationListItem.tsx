'use client';

import { useProfileQueries } from '@/hooks/queries/useProfileQueries';
import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { ConversationListItemDto } from '@/types/message';

interface ConversationListItemProps {
  conversation: ConversationListItemDto;
  isActive: boolean;
  onSelect: (id: number) => void;
}

/**
 * Individual conversation item that handles its own profile fetching.
 * Leverages TanStack Query caching to avoid redundant network requests.
 */
export default function ConversationListItem({
  conversation,
  isActive,
  onSelect
}: ConversationListItemProps) {
  const { user: currentUser } = useAuthStore();
  const { useGetProfileByUserId } = useProfileQueries();

  const currentUserId = parseInt(currentUser?.userId || '0');
  const otherUserId = conversation.user1Id === currentUserId ? conversation.user2Id : conversation.user1Id;

  // Individual fetch per item - TanStack Query handles caching
  const { data: profile, isLoading } = useGetProfileByUserId(otherUserId);
  const hasUnread = conversation.unreadCount > 0;

  return (
    <div
      onClick={() => onSelect(conversation.id)}
      className={cn(
        "px-5 py-4 flex gap-3 cursor-pointer transition-all duration-200 relative",
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
          <span className="text-[11px] font-medium text-muted-foreground/60 tabular-nums ml-2 shrink-0">
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

          {hasUnread && (
            <div className="size-2 rounded-full bg-primary shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
}
