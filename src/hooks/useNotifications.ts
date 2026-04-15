'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { NotificationPagedResult } from '@/src/types/notification';
import { useAuthStore } from '../store/authStore';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const useGetNotifications = (pageNumber = 1, pageSize = 10) => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    
    return useQuery<NotificationPagedResult>({
      queryKey: ['notifications', pageNumber, pageSize],
      queryFn: async () => {
        const response = await api.get('/Notification/paged', { params: { pageNumber, pageSize } });
        return response.data.data ?? response.data ?? null;
      },
      enabled: isAuthenticated,
      refetchInterval: isAuthenticated ? 60000 : false,
    });
  };

  // PATCH /api/Notification/:id/read
  const useMarkAsRead = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.patch(`/Notification/${id}/read`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    });
  };

  // No mark-all-read endpoint in swagger — use by-user delete or skip
  const useDeleteNotification = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.delete(`/Notification/${id}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    });
  };

  return {
    useGetNotifications,
    useMarkAsRead,
    useDeleteNotification,
  };
};
