'use client';

import { useMessageQueries } from '@/src/hooks/queries/useMessageQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Search, User } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';

interface ConversationListProps {
  activeId: number | null;
  onSelect: (id: number) => void;
}

export default function ConversationList({ activeId, onSelect }: ConversationListProps) {
  const { useGetConversations } = useMessageQueries();
  const { data: conversations, isLoading } = useGetConversations();

  return (
    <div className="flex flex-col h-full border-r border-border/60 bg-background">
      {/* Header & Search */}
      <div className="p-4 border-b border-border/60">
        <h2 className="text-base font-bold mb-3">Messaging</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages"
            className="w-full bg-[#edf3f8] dark:bg-muted h-[34px] pl-10 pr-4 rounded-md text-sm border-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="p-4 flex gap-3 border-b border-border/40">
              <Skeleton className="size-12 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))
        ) : conversations && conversations.length > 0 ? (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                "p-4 flex gap-3 cursor-pointer transition-colors relative border-b border-border/40",
                activeId === conv.id 
                  ? "bg-primary/5 border-l-4 border-l-primary" 
                  : "hover:bg-muted/50 border-l-4 border-l-transparent"
              )}
            >
              <div className="size-12 rounded-full bg-primary/10 shrink-0 overflow-hidden border">
                {conv.otherUser?.avatarUrl ? (
                  <img src={conv.otherUser.avatarUrl} alt="User" className="size-full object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center bg-muted text-muted-foreground">
                    <User className="size-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className={cn("text-sm truncate", conv.unreadCount > 0 ? "font-bold text-foreground" : "font-medium text-foreground")}>
                    {conv.otherUser?.fullName || `User ${conv.user1Id === conv.user2Id ? conv.user2Id : (conv.user1Id)}`}
                  </span>
                  <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
                    {conv.lastMessageAt ? formatDistanceToNowStrict(new Date(conv.lastMessageAt)) : ''}
                  </span>
                </div>
                <p className={cn(
                  "text-[12px] truncate pr-4",
                  conv.unreadCount > 0 ? "font-bold text-foreground" : "text-muted-foreground"
                )}>
                  {conv.lastMessagePreview || 'Start a conversation'}
                </p>
              </div>
              {conv.unreadCount > 0 && (
                <div className="absolute right-4 bottom-5 size-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
              )}
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-muted-foreground">
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs mt-1">Direct messages appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
