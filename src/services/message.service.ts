import api from '@/src/lib/api';

export interface Conversation {
  id: string;
  participantName: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export const messageService = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get('/Conversations');
    return response.data.data;
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await api.get(`/Conversations/${conversationId}/Messages`);
    return response.data.data;
  },

  sendMessage: async (conversationId: string, content: string): Promise<Message> => {
    const response = await api.post(`/Conversations/${conversationId}/Messages`, { content });
    return response.data.data;
  },
};
