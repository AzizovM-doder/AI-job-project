'use client';

import { useState, useMemo } from 'react';
import { useMessageQueries } from '@/hooks/queries/useMessageQueries';
import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, MessageSquare, Plus } from 'lucide-react';
import UserSearchModal from './UserSearchModal';
import { UserPublicProfileDto } from '@/types/user';
import { useTranslations } from 'next-intl';
import ConversationListItem from './ConversationListItem';

interface ConversationListProps {
  activeId: number | null;
  onSelect: (id: number) => void;
  onStartNewConversation?: (userId: number) => void;
  isCreating?: boolean;
}

export default function ConversationList({
  activeId,
  onSelect,
  onStartNewConversation,
  isCreating
}: ConversationListProps) {
  const t = useTranslations('Messages');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user: currentUser } = useAuthStore();
  const { useGetConversations } = useMessageQueries();

  // 1. Fetch Conversations
  const { data: conversations, isLoading } = useGetConversations();

  const filteredConversations = useMemo(() => {
    if (!conversations) return [];

    return conversations.filter(conv => {
      if (!searchTerm) return true;
      const name = (conv.otherUser?.fullName || '').toLowerCase();
      return name.includes(searchTerm.toLowerCase());
    });
  }, [conversations, searchTerm]);

  // 3. Compute set of user IDs we already have a chat with
  const existingUserIds = useMemo(() => {
    if (!conversations || !currentUser) return new Set<number>();

    const currentIdNum = parseInt(currentUser.userId);
    const ids = conversations.map(c =>
      c.user1Id === currentIdNum ? c.user2Id : c.user1Id
    );

    return new Set(ids);
  }, [conversations, currentUser]);

  const handleSelectUser = async (user: UserPublicProfileDto) => {
    if (user.userId !== undefined && onStartNewConversation) {
      console.log('[ConversationList] Selecting user for new chat:', user.userId);
      try {
        await onStartNewConversation(user.userId);
        console.log('[ConversationList] Conversation creation flow completed');
        setIsModalOpen(false);
      } catch (err) {
        console.error('[ConversationList] Error in selection flow:', err);
        // Error toast is already handled in the parent MessagesPage
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border/40">
      {/* Clean Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-foreground">{t('title')}</h2>
          <Button
            onClick={() => setIsModalOpen(true)}
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-muted"
            title={t('new_message')}
          >
            <Plus className="size-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full h-10 pl-9 pr-4 text-sm bg-muted/50 border-transparent rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/20 transition-all placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      <UserSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectUser={handleSelectUser}
        isCreating={isCreating}
        existingUserIds={existingUserIds}
      />

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {isLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="p-4 flex gap-3 border-b border-border/10">
              <Skeleton className="size-12 rounded-full shrink-0" />
              <div className="space-y-2 flex-1 py-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))
        ) : filteredConversations.length > 0 ? (
          <div className="divide-y divide-border/10">
            {filteredConversations.map((conv) => (
              <ConversationListItem
                key={conv.id}
                conversation={conv}
                isActive={activeId === conv.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        ) : (
          <div className="p-10 text-center space-y-3 opacity-60">
            <MessageSquare className="size-8 mx-auto text-muted-foreground/40" />
            <p className="text-sm font-medium">{t('void_detected')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
