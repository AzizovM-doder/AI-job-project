'use client';

import { useMessages } from '@/src/hooks/useMessages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User, ChevronRight, Terminal } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const { useGetConversations, useGetMessages, useSendMessage } = useMessages();
  const [messageInput, setMessageInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: convsLoading } = useGetConversations();
  const { data: messages, isLoading: messagesLoading } = useGetMessages(activeConvId);
  const sendMutation = useSendMessage(activeConvId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeConvId && messageInput.trim()) {
      sendMutation.mutate(messageInput, {
        onSuccess: () => setMessageInput(''),
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 flex gap-4 h-[calc(100vh-12rem)] min-h-[500px]">
        {/* Sidebar */}
        <Card className="w-80 flex flex-col border-primary/30">
          <CardHeader className="border-b border-primary/20 shrink-0">
            <CardTitle className="text-sm flex items-center">
              <Terminal className="size-4 mr-2" /> ACTIVE_CHANNELS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto flex-1">
            {convsLoading ? (
              <div className="p-4 animate-pulse uppercase text-[10px]">SCANNING_FREQUENCIES...</div>
            ) : conversations?.length ? (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={cn(
                    "p-4 border-b border-primary/10 cursor-pointer transition-colors flex items-center justify-between group",
                    activeConvId === conv.id ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-primary/5"
                  )}
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold">{conv.participantName.toUpperCase()}</p>
                    <p className="text-[10px] text-muted-foreground truncate w-48">{conv.lastMessage}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-[8px] font-bold px-1 animate-pulse">
                      NEW
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-[10px] text-muted-foreground uppercase text-center">NO_ACTIVE_CHANNELS</div>
            )}
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="flex-1 flex flex-col border-primary/30 overflow-hidden">
          {activeConvId ? (
            <>
              <CardHeader className="border-b border-primary/20 shrink-0">
                <CardTitle className="text-sm flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="size-2 bg-primary rounded-full animate-ping mr-3" />
                    CHANNEL_ACTIVE: {conversations?.find(c => c.id === activeConvId)?.participantName.toUpperCase()}
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
                {messagesLoading ? (
                  <div className="text-center p-10 opacity-50 uppercase tracking-widest">DECRYPTING_DATA...</div>
                ) : messages?.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-primary font-bold">[{new Date(msg.createdAt).toLocaleTimeString([], { hour12: false })}]</span>
                      <span className="text-muted-foreground">{msg.senderName.toUpperCase()}:</span>
                    </div>
                    <div className="pl-14 break-words">
                      {msg.content}
                    </div>
                  </div>
                ))}
              </CardContent>

              <div className="p-4 border-t border-primary/30">
                <form onSubmit={handleSend} className="flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="ENTER_TRANSMISSION..."
                    className="flex-1"
                    autoComplete="off"
                  />
                  <Button type="submit" disabled={sendMutation.isPending || !messageInput.trim()}>
                    <Send className="size-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col space-y-4">
              <Terminal className="size-12 opacity-20" />
              <p className="text-xs uppercase tracking-widest animate-pulse">SELECT_CHANNEL_TO_INITIALIZE_COMMS</p>
            </div>
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
}
