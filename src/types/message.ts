export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string | null;
  createdAt: string;
}

export interface ConversationListItemDto {
  id: number;
  user1Id: number;
  user2Id: number;
  createdAt: string;
  unreadCount: number;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  otherUser?: {
    id: number;
    fullName: string;
    avatarUrl?: string | null;
  };
}

export type Conversation = ConversationListItemDto;

export interface CreateConversationDto {
  otherUserId: number;
}

export interface CreateMessageDto {
  conversationId: number;
  content: string | null;
}

export interface MessageResponse {
  statusCode: number;
  description: string[] | null;
  data: Message;
}

export interface MessageListResponse {
  statusCode: number;
  description: string[] | null;
  data: Message[];
}

export interface ConversationListItemDtoResponse {
  statusCode: number;
  description: string[] | null;
  data: ConversationListItemDto;
}

export interface ConversationListItemDtoListResponse {
  statusCode: number;
  description: string[] | null;
  data: ConversationListItemDto[];
}
