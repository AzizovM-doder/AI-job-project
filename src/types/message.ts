export interface Conversation {
  id: number;
  participantId: number;
  participantName: string;
  lastMessage?: string;
  unreadCount: number;
  createdAt?: string;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: string;
}
