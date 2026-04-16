'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { 
  Message, 
  ConversationListItemDto, 
  CreateConversationDto, 
  CreateMessageDto 
} from '@/src/types/message';

export const useMessageQueries = () => {
  const queryClient = useQueryClient();

  // GET /api/Conversation
  const useGetConversations = () => {
    return useQuery<ConversationListItemDto[]>({
      queryKey: ['conversations'],
      queryFn: async () => {
        const res = await api.get('/Conversation');
        // Unpacking standard response structure { statusCode: 200, data: [...] }
        return res.data?.data ?? res.data ?? [];
      },
    });
  };

  // GET /api/Conversation/{id}
  const useGetConversation = (id: number) => {
    return useQuery<ConversationListItemDto>({
      queryKey: ['conversations', id],
      queryFn: async () => {
        const res = await api.get(`/Conversation/${id}`);
        return res.data?.data ?? res.data ?? null;
      },
      enabled: !!id,
    });
  };

  // POST /api/Conversation
  const useCreateConversation = () => {
    return useMutation<ConversationListItemDto, Error, CreateConversationDto>({
      mutationFn: async (data) => {
        const res = await api.post('/Conversation', data);
        return res.data?.data ?? res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      },
    });
  };

  // DELETE /api/Conversation/{id}
  const useDeleteConversation = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (id) => {
        const res = await api.delete(`/Conversation/${id}`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      },
    });
  };

  // GET /api/Message/by-conversation/{conversationId}
  const useGetMessages = (conversationId: number) => {
    return useQuery<Message[]>({
      queryKey: ['messages', conversationId],
      queryFn: async () => {
        const res = await api.get(`/Message/by-conversation/${conversationId}`);
        return res.data?.data ?? res.data ?? [];
      },
      enabled: !!conversationId,
    });
  };

  // POST /api/Message
  const useSendMessage = () => {
    return useMutation<Message, Error, CreateMessageDto>({
      mutationFn: async (data) => {
        const res = await api.post('/Message', data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      },
    });
  };

  return {
    useGetConversations,
    useGetConversation,
    useCreateConversation,
    useDeleteConversation,
    useGetMessages,
    useSendMessage,
  };
};
