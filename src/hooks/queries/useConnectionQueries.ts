'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { 
  Connection,  
  ConnectionStatus
} from '@/types/connection';

export const useConnectionQueries = () => {
  const queryClient = useQueryClient();

  // GET /api/Connection/my
  const useGetMyConnections = () => {
    return useQuery<Connection[]>({
      queryKey: ['connections', 'my'],
      queryFn: async () => {
        const res = await api.get('/Connection/my');
        return res.data?.data ?? res.data ?? [];
      },
    });
  };

  // GET /api/Connection/pending
  const useGetPendingConnections = () => {
    return useQuery<Connection[]>({
      queryKey: ['connections', 'pending'],
      queryFn: async () => {
        const res = await api.get('/Connection/pending');
        return res.data?.data ?? res.data ?? [];
      },
    });
  };

  // GET /api/Connection/all
  const useGetAllConnections = () => {
    return useQuery<Connection[]>({
      queryKey: ['connections', 'all'],
      queryFn: async () => {
        const res = await api.get('/Connection/all');
        return res.data?.data ?? res.data ?? [];
      },
    });
  };

  // POST /api/Connection/send/{addresseeId}
  const useSendRequest = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (addresseeId) => {
        const res = await api.post(`/Connection/send/${addresseeId}`);
        return res.data?.data ?? res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connections'] });
      },
    });
  };

  // POST /api/Connection/send-by-email
  const useSendRequestByEmail = () => {
    return useMutation<void, Error, string>({
      mutationFn: async (email) => {
        const res = await api.post('/Connection/send-by-email', { email });
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connections'] });
      },
    });
  };

  // PUT /api/Connection/{connectionId}/respond
  const useRespondRequest = () => {
    return useMutation<void, Error, { connectionId: number; status: ConnectionStatus }>({
      mutationFn: async ({ connectionId, status }) => {
        const res = await api.put(`/Connection/${connectionId}/respond`, { status });
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connections'] });
      },
    });
  };

  // DELETE /api/Connection/{connectionId}
  const useDeleteConnection = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (connectionId) => {
        const res = await api.delete(`/Connection/${connectionId}`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['connections'] });
      },
    });
  };

  return {
    useGetMyConnections,
    useGetPendingConnections,
    useGetAllConnections,
    useSendRequest,
    useSendRequestByEmail,
    useRespondRequest,
    useDeleteConnection,
  };
};
