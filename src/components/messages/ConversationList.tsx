'use client';

import { useState, useMemo } from 'react';
import { useMessageQueries } from '@/hooks/queries/useMessageQueries';
import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, MessageSquare, Plus, Inbox, Archive } from 'lucide-react';
import UserSearchModal from './UserSearchModal';
import { UserPublicProfileDto } from '@/types/user';
import { useTranslations } from 'next-intl';
import ConversationListItem from './ConversationListItem';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useArchiveStore } from '@/hooks/useArchiveStore';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

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
  const [view, setView] = useState<'active' | 'archived'>('active');
  const { user: currentUser } = useAuthStore();
  const { useGetConversations } = useMessageQueries();
  const { isArchived, toggleArchive, isLoaded } = useArchiveStore();

  // 1. Fetch Conversations
  const { data: conversations, isLoading } = useGetConversations();

  const filteredConversations = useMemo(() => {
    if (!conversations || !isLoaded) return [];

    return conversations.filter(conv => {
      // Filter by archive status
      const archived = isArchived(conv.id);
      if (view === 'active' && archived) return false;
      if (view === 'archived' && !archived) return false;

      // Filter by search term
      if (!searchTerm) return true;
      const name = (conv.otherUser?.fullName || '').toLowerCase();
      return name.includes(searchTerm.toLowerCase());
    });
  }, [conversations, searchTerm, view, isArchived, isLoaded]);

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
      try {
        await onStartNewConversation(user.userId);
        setIsModalOpen(false);
      } catch (err) {
        console.error('[ConversationList] Error in selection flow:', err);
      }
    }
  };

  const handleToggleArchive = (id: number) => {
    const wasArchived = isArchived(id);
    toggleArchive(id);
    toast.success(wasArchived ? t('chat_unarchived') : t('chat_archived'));
    
    // If the archived conversation was the active one, we might want to clear it
    if (id === activeId) {
      // Optionally deselect if moving to archive
      // onSelect(null); 
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border/40">
      {/* Clean Header */}
      <div className="p-4 space-y-4 pb-2">
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

      {/* Tabs for Active/Archived */}
      <div className="px-4 py-2 border-b border-border/10">
        <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/30 p-1 h-9">
            <TabsTrigger value="active" className="text-xs gap-2 data-[state=active]:bg-background">
              <Inbox className="size-3.5" />
              <span>{t('active_tab')}</span>
            </TabsTrigger>
            <TabsTrigger value="archived" className="text-xs gap-2 data-[state=active]:bg-background">
              <Archive className="size-3.5" />
              <span>{t('archived_tab')}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
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
        {isLoading || !isLoaded ? (
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
            <AnimatePresence initial={false} mode="popLayout">
              {filteredConversations.map((conv) => (
                <ConversationListItem
                  key={conv.id}
                  conversation={conv}
                  isActive={activeId === conv.id}
                  onSelect={onSelect}
                  isArchived={isArchived(conv.id)}
                  onToggleArchive={handleToggleArchive}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-10 text-center space-y-3 opacity-60">
            <MessageSquare className="size-8 mx-auto text-muted-foreground/40" />
            <p className="text-sm font-medium">
              {view === 'active' ? t('void_detected') : 'No archived conversations'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

