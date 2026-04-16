'use client';

import { useMessageQueries } from '@/src/hooks/queries/useMessageQueries';
import { useAiQueries } from '@/src/hooks/queries/useAiQueries';
import { useAuthStore } from '@/src/store/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Send, Sparkles, MoreHorizontal, User, Paperclip, Smile, Image as ImageIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface ChatWindowProps {
  conversationId: number | null;
}

export default function ChatWindow({ conversationId }: ChatWindowProps) {
  const { user } = useAuthStore();
  const { useGetMessages, useSendMessage, useGetConversation } = useMessageQueries();
  const { useDraftMessage } = useAiQueries();
  
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversation } = useGetConversation(conversationId!);
  const { data: messages, isLoading } = useGetMessages(conversationId!);
  const sendMutation = useSendMessage();
  const aiDraftMutation = useDraftMessage();

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
      userId: user.id,
      purpose: "Professional follow-up",
      tone: "Professional but friendly",
      extraContext: "Discussing job opportunity"
    }, {
      onSuccess: (data) => {
        if (data.content) setInput(data.content);
      }
    });
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background">
        <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <MessageSquare className="size-10 text-muted-foreground/40" />
        </div>
        <h3 className="text-xl font-bold">Select a message</h3>
        <p className="text-muted-foreground mt-1 max-w-xs text-sm">
          Choose from your existing conversations or start a new one to reach out to your network.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="h-14 px-4 border-b border-border/60 flex items-center justify-between bg-card z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center border font-bold text-xs uppercase overflow-hidden">
            {conversation?.otherUser?.avatarUrl ? (
              <img src={conversation.otherUser.avatarUrl} alt="User" className="size-full object-cover" />
            ) : (
              <User className="size-4 text-primary" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold leading-tight">
              {conversation?.otherUser?.fullName || 'User'}
            </h3>
            <p className="text-[11px] text-muted-foreground">Active now</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground"><MoreHorizontal className="size-5" /></Button>
        </div>
      </div>

      {/* Message Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-48 rounded-2xl" />
            <Skeleton className="h-10 w-64 rounded-2xl ml-auto" />
            <Skeleton className="h-10 w-32 rounded-2xl" />
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === user?.userId;
            const prevMsg = messages[idx - 1];
            const isNewGroup = !prevMsg || prevMsg.senderId !== msg.senderId;

            return (
              <div key={idx} className={cn("flex group", isMe ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[80%] space-y-1", isMe ? "items-end" : "items-start")}>
                  {isNewGroup && (
                    <span className={cn("text-[11px] font-bold px-1 text-muted-foreground", isMe ? "text-right block" : "")}>
                       {isMe ? 'You' : conversation?.otherUser?.fullName || 'Other'} • {format(new Date(msg.createdAt), 'HH:mm')}
                    </span>
                  )}
                  <div className={cn(
                    "px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed",
                    isMe 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-[#f4f2ee] dark:bg-muted text-foreground rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-10">
             <div className="size-16 rounded-full border-2 border-dashed flex items-center justify-center mb-4">
               <User className="size-8" />
             </div>
             <p className="text-sm font-bold uppercase tracking-widest">Initialization Complete</p>
             <p className="text-xs">Secure channel established. Ready for transmission.</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-card shrink-0">
        <form onSubmit={handleSend} className="bg-background border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all border-border/80">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Write a message..."
            className="w-full bg-transparent p-3 text-sm focus:outline-none resize-none min-h-[60px] max-h-[150px]"
          />
          <div className="px-2 py-1.5 flex items-center justify-between border-t border-border/40 bg-muted/20">
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-primary">
                <ImageIcon className="size-5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-primary">
                <Paperclip className="size-5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-primary">
                <Smile className="size-5" />
              </Button>
              <div className="w-[1px] h-4 bg-border mx-1" />
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={handleAiDraft}
                disabled={aiDraftMutation.isPending}
                className="text-xs font-bold gap-1.5 text-primary bg-primary/5 hover:bg-primary/10 h-7"
              >
                <Sparkles className={cn("size-3.5", aiDraftMutation.isPending && "animate-spin")} />
                {aiDraftMutation.isPending ? 'Generating...' : 'AI Draft'}
              </Button>
            </div>
            <Button 
              type="submit" 
              disabled={!input.trim() || sendMutation.isPending}
              className={cn("h-7 rounded-sm px-4 font-bold text-xs transition-transform active:scale-95")}
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { MessageSquare } from 'lucide-react';
