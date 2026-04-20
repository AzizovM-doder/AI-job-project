'use client';

import { useMessageQueries } from '@/hooks/queries/useMessageQueries';
import { useAiQueries } from '@/hooks/queries/useAiQueries';
import { useUserQueries } from '@/hooks/queries/useUserQueries';
import { useProfileQueries } from '@/hooks/queries/useProfileQueries';
import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { 
  Send, Sparkles, MoreHorizontal, User, Paperclip, 
  Trash2, MessageSquare, AlertCircle, Zap, Trash
} from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuPortal,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import EmojiPicker from './EmojiPicker';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ChatWindowProps {
  conversationId: number | null;
  onDelete?: () => void;
}

/**
 * SenderProfile component to fetch and display profile data for a specific user.
 * Leverages TanStack Query's caching to avoid multiple network requests for the same user.
 */
const SenderProfile = ({ userId, showName = true, className }: { userId: number; showName?: boolean; className?: string }) => {
  const { useGetProfileByUserId } = useProfileQueries();
  const { data: profile } = useGetProfileByUserId(userId);
  const { locale } = useParams();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Link href={`/${locale}/profile/${userId}`} className="hover:opacity-80 transition-opacity">
        <div className="size-10 rounded-full bg-muted flex items-center justify-center border border-border/40 overflow-hidden shrink-0 shadow-sm">
          {profile?.photoUrl ? (
            <img src={profile.photoUrl} alt="User" className="size-full object-cover" />
          ) : (
            <User className="size-5 text-muted-foreground" />
          )}
        </div>
      </Link>
      {showName && (
        <Link href={`/${locale}/profile/${userId}`} className="hover:text-primary transition-colors truncate max-w-[120px]">
          <span className="text-xs font-bold text-foreground">
            {profile ? (profile.fullName || (profile.firstName ? `${profile.firstName} ${profile.lastName || ''}` : `User ${userId}`)) : `User ${userId}`}
          </span>
        </Link>
      )}
    </div>
  );
};

export default function ChatWindow({ conversationId, onDelete }: ChatWindowProps) {
  const t = useTranslations('Messages');
  const { user } = useAuthStore();
  const { locale } = useParams();
  const { 
    useGetMessages, 
    useSendMessage, 
    useGetConversation,
    useDeleteConversation,
    useHardDeleteConversation,
    useDeleteMessage
  } = useMessageQueries();
  const { useAiDraftMessage } = useAiQueries();
  const { useGetPublicProfiles } = useUserQueries();

  const [input, setInput] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isHardDelete, setIsHardDelete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversation } = useGetConversation(conversationId!);
  const { data: messages, isLoading: isMessagesLoading } = useGetMessages(conversationId!);
  
  const deleteMutation = useDeleteConversation();
  const hardDeleteMutation = useHardDeleteConversation();
  const deleteMsgMutation = useDeleteMessage();

  const otherUserId = useMemo(() => {
    if (!conversation || !user) return null;
    const currentUserId = parseInt(user.userId);
    return conversation.user1Id === currentUserId ? conversation.user2Id : conversation.user1Id;
  }, [conversation, user]);

  const { data: profiles } = useGetPublicProfiles(otherUserId ? [otherUserId] : []);
  const otherUser = profiles?.[0];

  const sendMutation = useSendMessage();
  const aiDraftMutation = useAiDraftMessage();

  const isLoading = isMessagesLoading;

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!conversationId || !input.trim()) return;

    sendMutation.mutate({ conversationId, content: input }, {
      onSuccess: () => setInput('')
    });
  };

  const handleAiDraft = () => {
    if (!user) return;
    aiDraftMutation.mutate({
      userId: parseInt(user.userId),
      purpose: "Professional follow-up",
      tone: "Professional but friendly",
      extraContext: "Discussing job opportunity"
    }, {
      onSuccess: (data) => {
        if (data.data?.content) setInput(data.data.content);
      }
    });
  };

  const confirmDelete = (hard: boolean) => {
    setIsHardDelete(hard);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!conversationId) return;
    
    const mutation = isHardDelete ? hardDeleteMutation : deleteMutation;
    
    try {
      await mutation.mutateAsync(conversationId);
      toast.success(isHardDelete ? t('chat_deleted') : t('chat_archived'));
      setDeleteConfirmOpen(false);
      if (onDelete) onDelete();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!conversationId) return;
    try {
      await deleteMsgMutation.mutateAsync({ id: messageId, conversationId });
      toast.success(t('message_deleted'));
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  if (conversationId === null || conversationId === undefined) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-background">
        <div className="size-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
          <MessageSquare className="size-10 text-muted-foreground/40" />
        </div>
        <h3 className="text-xl font-bold text-foreground">{t('select_chat')}</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">
          Select a conversation from the list to start messaging with your network.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative border-l border-border/40">
      {/* Modal for Confirmation */}
      <Dialog open={deleteConfirmOpen} onOpenChange={(open) => !open && setDeleteConfirmOpen(false)}>
        <DialogContent className="sm:max-w-md border-none shadow-2xl bg-background/95 backdrop-blur-xl rounded-3xl p-6">
          <DialogHeader className="flex flex-col items-center text-center space-y-4 pt-4">
            <div className={cn("p-4 rounded-full", isHardDelete ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}>
              <AlertCircle className="size-8" />
            </div>
            <DialogTitle className="text-xl font-black tracking-tight">
              {isHardDelete ? t('confirm_delete_title') : t('confirm_archive_title')}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
              {isHardDelete ? t('confirm_delete_desc') : t('confirm_archive_desc')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 w-full pt-4 sm:justify-center">
            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)} className="flex-1 rounded-xl font-bold h-11 min-w-[120px]">
              {t('cancel')}
            </Button>
            <Button 
              variant={isHardDelete ? "destructive" : "default"}
              onClick={handleDelete}
              className="flex-1 rounded-xl font-bold h-11 min-w-[120px] shadow-lg transition-all active:scale-95"
            >
              {isHardDelete ? t('delete') : t('archive')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clean Header */}
      <div className="h-18 px-6 border-b border-border/40 flex items-center justify-between bg-background/95 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-3">
          <SenderProfile userId={otherUserId!} showName={false} />
          <div>
            <Link href={`/${locale}/profile/${otherUserId}`} className="hover:text-primary transition-colors">
              <h3 className="text-[0.9375rem] font-bold text-foreground leading-tight">
                {otherUser?.fullName || (otherUser?.firstName ? `${otherUser.firstName} ${otherUser.lastName || ''}` : (otherUser?.userName || `User ${conversationId}`))}
              </h3>
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="size-1.5 rounded-full bg-green-500" />
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{t('online')}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9 rounded-full">
                <MoreHorizontal className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent align="end" className="w-48 z-[9999]">
              <DropdownMenuItem onClick={() => confirmDelete(false)} className="gap-2">
                <AlertCircle className="size-4" /> {t('archive')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => confirmDelete(true)} className="gap-2 text-destructive focus:text-destructive">
                <Trash2 className="size-4" /> {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
          </DropdownMenu>
        </div>
      </div>

      {/* Message Stream */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/5 dark:bg-transparent max-h-[70vh] custom-scrollbar"
      >
        {isLoading ? (
          <div className="space-y-6">
            <div className="flex gap-3">
              <Skeleton className="size-8 rounded-full bg-muted" />
              <Skeleton className="h-10 w-48 rounded-2xl rounded-tl-none bg-muted" />
            </div>
            <div className="flex gap-3 flex-row-reverse">
              <Skeleton className="size-8 rounded-full bg-muted" />
              <Skeleton className="h-10 w-32 rounded-2xl rounded-tr-none bg-muted" />
            </div>
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === parseInt(user?.userId || '0');
            const prevMsg = messages[idx - 1];
            const isNewGroup = !prevMsg || prevMsg.senderId !== msg.senderId;

            return (
              <div key={idx} className={cn("flex items-end gap-2 group/msg", isMe ? "flex-row-reverse" : "flex-row")}>
                {!isMe && isNewGroup && (
                   <SenderProfile userId={msg.senderId} showName={false} className="mb-1" />
                )}
                {!isMe && !isNewGroup && (
                   <div className="size-8 shrink-0" />
                )}
                
                <div className={cn("max-w-[80%] flex flex-col", isMe ? "items-end" : "items-start")}>
                  {isNewGroup && (
                    <div className={cn("flex items-center gap-2 px-1 mb-1", isMe ? "flex-row-reverse" : "flex-row")}>
                       <span className="text-[10px] font-bold text-muted-foreground/60">
                         {format(new Date(msg.createdAt), 'HH:mm')}
                       </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 group/actions">
                    {isMe && (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="opacity-0 group-hover/msg:opacity-100 p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200"
                        title={t('delete_message')}
                      >
                        <Trash className="size-3.5" />
                      </button>
                    )}
                    
                    <div className={cn(
                      "px-4 py-2.5 text-sm leading-relaxed shadow-sm break-words relative transition-all duration-200 font-medium",
                      isMe
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-br-none"
                        : "bg-card border border-border/40 text-foreground rounded-2xl rounded-bl-none hover:border-primary/30"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 p-12">
            <div className="size-16 rounded-full border-2 border-dashed border-muted-foreground/20 flex items-center justify-center mb-4">
              <Zap className="size-8 text-muted-foreground/20" />
            </div>
            <p className="text-xs font-medium uppercase tracking-widest">{t('start_conversation')}</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t border-border/40 shrink-0 sticky bottom-0">
        <form 
          onSubmit={handleSend} 
          className="flex flex-col bg-muted/30 border border-border/60 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/10 transition-all"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t('type_message')}
            className="w-full bg-transparent p-4 text-sm focus:outline-none resize-none min-h-[50px] max-h-[120px] custom-scrollbar font-medium"
          />
          
          <div className="px-4 py-2 flex items-center justify-between border-t border-border/10">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAiDraft}
                disabled={aiDraftMutation.isPending}
                className="h-8 px-3 rounded-lg text-[11px] font-bold gap-1.5 text-primary hover:bg-white transition-all shadow-sm"
              >
                <Sparkles className={cn("size-3.5", aiDraftMutation.isPending && "animate-spin")} />
                {aiDraftMutation.isPending ? '...' : t('ai_draft')}
              </Button>
              
              <div className="w-px h-3 bg-border/40 mx-1" />
              
              <EmojiPicker 
                onEmojiSelect={(emoji) => setInput(prev => prev + emoji)}
              />
              
              <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground/60 hover:text-foreground">
                <Paperclip className="size-4" />
              </Button>
            </div>

            <Button
              type="submit"
              disabled={!input.trim() || sendMutation.isPending}
              size="sm"
              className="h-8 rounded-lg font-bold text-xs px-5 shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              {t('send')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
