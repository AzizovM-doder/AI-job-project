"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Message,
  ConversationListItemDto,
  CreateConversationDto,
  CreateMessageDto,
} from "@/types/message";

export const useMessageQueries = () => {
  const queryClient = useQueryClient();

  // GET /api/Conversation
  const useGetConversations = () => {
    return useQuery<ConversationListItemDto[]>({
      queryKey: ["conversations"],
      queryFn: async () => {
        const res = await api.get("/Conversation");
        // Unpacking standard response structure { statusCode: 200, data: [...] }
        return res.data?.data ?? res.data ?? [];
      },
    });
  };

  // GET /api/Conversation/{id}
  const useGetConversation = (id: number) => {
    return useQuery<ConversationListItemDto>({
      queryKey: ["conversations", id],
      queryFn: async () => {
        const res = await api.get(`/Conversation/${id}`);
        return res.data?.data ?? res.data ?? null;
      },
      enabled: id !== null && id !== undefined,
    });
  };

  // GET /api/Conversation/by-user/{userId} - Get or create conversation with specific user
  const useGetConversationByUser = (userId: number | null) => {
    return useQuery<ConversationListItemDto>({
      queryKey: ["conversations", "by-user", userId],
      queryFn: async () => {
        const res = await api.get(`/Conversation/by-user/${userId}`);
        return res.data?.data ?? res.data ?? null;
      },
      enabled: !!userId,
    });
  };

  // POST /api/Conversation
  const useCreateConversation = () => {
    return useMutation<ConversationListItemDto, Error, CreateConversationDto>({
      mutationFn: async (data) => {
        const res = await api.post("/Conversation", data);
        return res.data?.data ?? res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
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
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
    });
  };

  // POST /api/Conversation/{id}/delete - Permanent/Hard delete
  const useHardDeleteConversation = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (id) => {
        const res = await api.post(`/Conversation/${id}/delete`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
    });
  };

  // GET /api/Message/by-conversation/{conversationId}
  const useGetMessages = (conversationId: number) => {
    return useQuery<Message[]>({
      queryKey: ["messages", conversationId],
      queryFn: async () => {
        const res = await api.get(`/Message/by-conversation/${conversationId}`);
        return res.data?.data ?? res.data ?? [];
      },
      enabled: conversationId !== null && conversationId !== undefined,
    });
  };

  // GET /api/Message/{id} - Get single message by ID
  const useGetMessage = (id: number | null) => {
    return useQuery<Message>({
      queryKey: ["messages", "single", id],
      queryFn: async () => {
        const res = await api.get(`/Message/${id}`);
        return res.data?.data ?? res.data ?? null;
      },
      enabled: id !== null && id !== undefined,
    });
  };

  // POST /api/Message
  const useSendMessage = () => {
    return useMutation<Message, Error, CreateMessageDto>({
      mutationFn: async (data) => {
        const res = await api.post("/Message", data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["messages", variables.conversationId],
        });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
    });
  };

  // DELETE /api/Message/{id} - Delete a message
  const useDeleteMessage = () => {
    return useMutation<void, Error, { id: number; conversationId: number }, { previousMessages: Message[] | undefined }>({
      mutationFn: async ({ id }) => {
        const res = await api.delete(`/Message/${id}`);
        return res.data;
      },
      // 3. Message Deletion - Optimistic Update
      onMutate: async ({ id, conversationId }) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: ["messages", conversationId] });

        // Snapshot the previous value
        const previousMessages = queryClient.getQueryData<Message[]>(["messages", conversationId]);

        // Optimistically update to the new value
        if (previousMessages) {
          queryClient.setQueryData<Message[]>(
            ["messages", conversationId],
            previousMessages.filter((msg) => msg.id !== id)
          );
        }

        // Return a context object with the snapshotted value
        return { previousMessages } as { previousMessages: Message[] | undefined };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (_err, variables, context) => {
        if (context && 'previousMessages' in context) {
          queryClient.setQueryData(
            ["messages", variables.conversationId],
            context.previousMessages
          );
        }
      },
      // Always refetch after error or success:
      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["messages", variables.conversationId],
        });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      },
    });
  };

  return {
    useGetConversations,
    useGetConversation,
    useGetConversationByUser,
    useCreateConversation,
    useDeleteConversation,
    useHardDeleteConversation,
    useGetMessages,
    useGetMessage,
    useSendMessage,
    useDeleteMessage,
  };
};
