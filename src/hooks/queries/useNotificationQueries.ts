'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Notification, NotificationPagedResult } from '@/types/notification';

export const useNotificationQueries = () => {
  const queryClient = useQueryClient();

  const useGetNotification = (id: number) => {
    return useQuery<Notification>({
      queryKey: ['notifications', id],
      queryFn: async () => {
        const res = await api.get(`/Notification/${id}`);
        return res.data.data ?? res.data ?? null;
      },
      enabled: !!id,
    });
  };

  const useGetNotificationsPaged = (params?: { userId?: number; PageNumber?: number; PageSize?: number }) => {
    return useQuery<NotificationPagedResult>({
      queryKey: ['notifications', 'paged', params],
      queryFn: async () => {
        const res = await api.get('/Notification/paged', { params });
        return res.data; // Paged result is usually in data or directly returned
      },
      enabled: true,
    });
  };

  const useGetUserNotifications = (userId: number) => {
    return useQuery<Notification[]>({
      queryKey: ['notifications', 'user', userId],
      queryFn: async () => {
        const res = await api.get(`/Notification/by-user/${userId}`);
        const data = res.data?.data ?? res.data;
        return Array.isArray(data) ? data : [];
      },
      enabled: !!userId,
    });
  };

  const useCreateNotification = () => {
    return useMutation<Notification, Error, any>({
      mutationFn: async (data) => {
        const res = await api.post('/Notification', data);
        return res.data?.data ?? res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    });
  };

  const useMarkAsRead = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (id: number) => {
        await api.patch(`/Notification/${id}/read`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    });
  };

  const useDeleteNotification = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (id: number) => {
        const res = await api.delete(`/Notification/${id}`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    });
  };

  return {
    useGetNotification,
    useGetNotificationsPaged,
    useGetUserNotifications,
    useCreateNotification,
    useMarkAsRead,
    useDeleteNotification,
  };
};
