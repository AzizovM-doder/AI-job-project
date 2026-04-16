'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { 
  User, 
  UserSettingsDto, 
  UpdateUserSettingsDto, 
  UserPublicProfileDto 
} from '@/src/types/user';

export const useUserQueries = () => {
  const queryClient = useQueryClient();

  // GET /api/User/me
  const useGetMe = () => {
    return useQuery<User>({
      queryKey: ['users', 'me'],
      queryFn: async () => {
        const res = await api.get('/User/me');
        return res.data?.data ?? res.data;
      },
    });
  };

  // GET /api/User/directory
  const useGetDirectory = (searchTerm?: string) => {
    return useQuery<UserPublicProfileDto[]>({
      queryKey: ['users', 'directory', searchTerm],
      queryFn: async () => {
        const res = await api.get('/User/directory', { params: { searchTerm } });
        return res.data?.data ?? res.data ?? [];
      },
    });
  };

  // GET /api/User/settings
  const useGetSettings = () => {
    return useQuery<UserSettingsDto>({
      queryKey: ['users', 'settings'],
      queryFn: async () => {
        const res = await api.get('/User/settings');
        return res.data?.data ?? res.data;
      },
    });
  };

  // PUT /api/User/settings
  const useUpdateSettings = () => {
    return useMutation<UserSettingsDto, Error, UpdateUserSettingsDto>({
      mutationFn: async (data) => {
        const res = await api.put('/User/settings', data);
        return res.data?.data ?? res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users', 'settings'] });
      },
    });
  };

  return {
    useGetMe,
    useGetDirectory,
    useGetSettings,
    useUpdateSettings,
  };
};
