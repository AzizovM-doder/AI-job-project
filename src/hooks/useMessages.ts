'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { Conversation, Message } from '@/src/types/message';

export const useMessages = () => {
  const queryClient = useQueryClient();

  // GET /api/Conversation
  const useGetConversations = () => {
    return useQuery<Conversation[]>({
      queryKey: ['conversations'],
      queryFn: async () => {
        const response = await api.get('/Conversation');
        return response.data.data ?? response.data ?? null;
      },
      refetchInterval: 10000,
    });
  };

  // POST /api/Conversation
  const useCreateConversation = () => {
    return useMutation({
      mutationFn: async (participantId: number) => {
        const response = await api.post('/Conversation', { participantId });
        return response.data.data ?? response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      },
    });
  };

  // GET /api/Message/by-conversation/:conversationId
  const useGetMessages = (conversationId: number | null) => {
    return useQuery<Message[]>({
      queryKey: ['messages', conversationId],
      queryFn: async () => {
        const response = await api.get(`/Message/by-conversation/${conversationId}`);
        return response.data.data ?? response.data ?? null;
      },
      enabled: !!conversationId,
      refetchInterval: 3000,
    });
  };

  // POST /api/Message
  const useSendMessage = (conversationId: number | null) => {
    return useMutation({
      mutationFn: async (content: string) => {
        const response = await api.post('/Message', { conversationId, content });
        return response.data.data ?? response.data ?? null;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      },
    });
  };

  // DELETE /api/Conversation/:id
  const useDeleteConversation = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.delete(`/Conversation/${id}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      },
    });
  };

  return {
    useGetConversations,
    useCreateConversation,
    useGetMessages,
    useSendMessage,
    useDeleteConversation,
  };
};
