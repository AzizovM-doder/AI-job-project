'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { Connection } from '@/src/types/connection';

export const useConnections = () => {
  const queryClient = useQueryClient();

  // GET /api/Connection/my
  const useGetMyConnections = () => {
    return useQuery<Connection[]>({
      queryKey: ['connections', 'my'],
      queryFn: async () => {
        const response = await api.get('/Connection/my');
        return response.data.data ?? response.data ?? null;
      },
    });
  };

  // GET /api/Connection/pending
  const useGetPendingRequests = () => {
    return useQuery<Connection[]>({
      queryKey: ['connections', 'pending'],
      queryFn: async () => {
        const response = await api.get('/Connection/pending');
        return response.data.data ?? response.data ?? null;
      },
    });
  };

  // POST /api/Connection/send/:addresseeId
  const useSendRequest = () => {
    return useMutation({
      mutationFn: async (addresseeId: number) => {
        const response = await api.post(`/Connection/send/${addresseeId}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connections'] });
      },
    });
  };

  // PUT /api/Connection/:connectionId/respond
  const useRespondRequest = () => {
    return useMutation({
      mutationFn: async ({ requestId, accept }: { requestId: number; accept: boolean }) => {
        const response = await api.put(`/Connection/${requestId}/respond`, { isAccepted: accept });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connections'] });
      },
    });
  };

  // DELETE /api/Connection/:connectionId
  const useDeleteConnection = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.delete(`/Connection/${id}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connections'] });
      },
    });
  };

  // POST /api/Connection/send-by-email
  const useSendRequestByEmail = () => {
    return useMutation({
      mutationFn: async (email: string) => {
        const response = await api.post('/Connection/send-by-email', { email });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connections'] });
      },
    });
  };

  return {
    useGetMyConnections,
    useGetPendingRequests,
    useSendRequest,
    useSendRequestByEmail,
    useRespondRequest,
    useDeleteConnection,
  };
};
