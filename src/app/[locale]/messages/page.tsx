'use client';

import ProtectedRoute from '@/src/components/ProtectedRoute';
import { PageTransition } from '@/src/components/PageTransition';
import ConversationList from '@/src/components/messages/ConversationList';
import ChatWindow from '@/src/components/messages/ChatWindow';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

  return (
    <ProtectedRoute>
      <PageTransition className="flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:h-[calc(100vh-140px)] min-h-[600px] mb-8">
          <Card className="flex-1 flex flex-col md:flex-row overflow-hidden border-border/60 shadow-lg">
            {/* Conversations Sidebar (Hidden on mobile if chat is active) */}
            <div className={cn(
               "w-full md:w-80 lg:w-96 flex-col overflow-hidden",
               activeConversationId ? "hidden md:flex" : "flex"
            )}>
              <ConversationList 
                activeId={activeConversationId} 
                onSelect={setActiveConversationId} 
              />
            </div>

            {/* Chat Area (Hidden on mobile if list is shown) */}
            <div className={cn(
               "flex-1 flex flex-col overflow-hidden bg-card",
               activeConversationId ? "flex" : "hidden md:flex"
            )}>
              {activeConversationId ? (
                <div className="flex-1 flex flex-col relative">
                  {/* Mobile Back Button */}
                  <button 
                    onClick={() => setActiveConversationId(null)}
                    className="md:hidden absolute top-3 left-2 z-20 p-2 text-primary font-bold text-sm"
                  >
                    ← Back
                  </button>
                  <ChatWindow conversationId={activeConversationId} />
                </div>
              ) : (
                <ChatWindow conversationId={null} />
              )}
            </div>
          </Card>
        </div>
      </PageTransition>
    </ProtectedRoute>
  );
}

import { cn } from '@/lib/utils';
