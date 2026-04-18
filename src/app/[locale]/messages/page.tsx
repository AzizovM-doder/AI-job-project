'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { PageTransition } from '@/components/PageTransition';
import ConversationList from '@/components/messages/ConversationList';
import ChatWindow from '@/components/messages/ChatWindow';
import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useMessageQueries } from '@/hooks/queries/useMessageQueries';
import { useConnectionQueries } from '@/hooks/queries/useConnectionQueries';
import { toast } from 'sonner';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import axios from 'axios';

import { Container } from '@/components/ui/Container';

export default function MessagesPage() {
  const { locale } = useParams();
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const { useGetConversations, useCreateConversation } = useMessageQueries();
  const { useSendRequest } = useConnectionQueries();

  const { data: conversations } = useGetConversations();
  const createConversation = useCreateConversation();
  const sendConnection = useSendRequest();

  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Chained Mutation Flow: Connection -> Conversation -> Routing
   * Includes aggressive error catching and visual feedback.
   */
  const handleStartNewConversation = useCallback(async (userId: number) => {
    if (userId === undefined || userId === null) {
      console.error('[NewConv] Invalid userId provided:', userId);
      return;
    }

    console.log(`[NewConv] Starting flow for userId: ${userId}`);

    try {
      // 1. Check local state first to avoid redundant API calls
      const existingConv = conversations?.find(c =>
        c.user1Id === userId || c.user2Id === userId
      );

      if (existingConv) {
        console.log(`[NewConv] Found existing conversation: ${existingConv.id}`);
        setActiveConversationId(existingConv.id);
        return;
      }

      // 2. Chained Step 1: Send/Ensure Connection
      // We wrap this in a sub-try/catch because we want to proceed to conversation creation
      // even if the connection already exists (which the server might flag as an error).
      try {
        console.log('[NewConv] Step 1: Sending connection request...');
        await sendConnection.mutateAsync(userId);
        console.log('[NewConv] Connection request successful');
      } catch (connError: unknown) {
        // If it's a 400/409 (Already exists), we log it but continue
        console.warn('[NewConv] Connection step non-critical failure (may already exist):', connError);
      }

      // 3. Chained Step 2: Create Conversation
      console.log('[NewConv] Step 2: Creating conversation...');
      const result = await createConversation.mutateAsync({ otherUserId: userId });

      if (result && result.id !== undefined && result.id !== null) {
        console.log(`[NewConv] Step 3: Conversation created successfully! ID: ${result.id}`);

        // 4. Invalidate and Route
        setActiveConversationId(result.id);
        toast.success('Conversation started');

        // Push to URL with ID param for state persistence if needed, or just set local state
        router.push(`/${locale}/messages?id=${result.id}`);
      } else {
        throw new Error('Server returned a success status but no conversation ID was found in the payload.');
      }

    } catch (error: unknown) {
      // AGGRESSIVE ERROR BOUNDARY
      const errorMsg = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error ? error.message : 'Unknown error occurred';

      console.error('[NewConv] CRITICAL FAILURE:', {
        message: errorMsg,
        fullError: error,
        response: axios.isAxiosError(error) ? error.response?.data : undefined
      });

      toast.error(`Failed to start chat: ${errorMsg}`);
    }
  }, [conversations, createConversation, locale, router, sendConnection]);

  // Handle URL param for starting conversation with specific user
  useEffect(() => {
    const userIdVal = searchParams.get('userId');
    if (userIdVal) {
      handleStartNewConversation(parseInt(userIdVal));
      
      // Clear the URL param immediately to prevent re-triggering
      const params = new URLSearchParams(searchParams.toString());
      params.delete('userId');
      router.replace(`/${locale}/messages?${params.toString()}`);
    }
  }, [searchParams, router, locale, handleStartNewConversation]);

  const handleSelectConversation = (id: number) => {
    setActiveConversationId(id);
  };

  return (
    <ProtectedRoute>
      <PageTransition className="flex-1 flex flex-col bg-background">
        <Container className="py-6 md:py-10">
          <Card className={cn(
            "flex overflow-hidden border border-border/60 shadow-sm transition-all duration-300",
            "h-[80vh] min-h-[600px] max-h-[1000px]"
          )}>
            {/* Conversations Sidebar */}
            <div className={cn(
              "w-full md:w-80 lg:w-96 flex-col shrink-0 border-r border-border/40 bg-card/50",
              activeConversationId ? "hidden md:flex" : "flex"
            )}>
              <ConversationList
                activeId={activeConversationId}
                onSelect={handleSelectConversation}
                onStartNewConversation={handleStartNewConversation}
                isCreating={createConversation.isPending}
              />
            </div>

            {/* Chat Area */}
            <div className={cn(
              "flex-1 flex flex-col overflow-hidden relative bg-background",
              activeConversationId ? "flex" : "hidden md:flex"
            )}>
              {activeConversationId && (
                <button
                  onClick={() => setActiveConversationId(null)}
                  className="md:hidden absolute top-4 left-4 z-30 p-2 rounded-full bg-background border border-border/60 text-foreground shadow-sm active:scale-95 transition-all"
                >
                  <ChevronLeft className="size-4" />
                </button>
              )}

              <ChatWindow
                conversationId={activeConversationId}
                onDelete={() => setActiveConversationId(null)}
              />
            </div>
          </Card>
        </Container>
      </PageTransition>
    </ProtectedRoute>
  );
}
