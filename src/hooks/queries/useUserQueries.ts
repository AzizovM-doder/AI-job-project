'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { 
  User, 
  UserSettingsDto, 
  UpdateUserSettingsDto, 
  UserPublicProfileDto 
} from '@/types/user';
import axios from 'axios';

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
        const data = res.data?.data ?? res.data ?? [];
        
        // Normalize response: Map 'id' to 'userId' if 'userId' is missing
        return data.map((user: Record<string, unknown>) => ({
          ...user,
          userId: user.userId ?? user.id
        }));
      },
    });
  };

  // POST /api/UserProfile/public-by-users
  const useGetPublicProfiles = (userIds: number[]) => {
    return useQuery<UserPublicProfileDto[]>({
      queryKey: ['users', 'public-profiles', userIds],
      queryFn: async () => {
        if (!userIds.length) return [];
        const res = await api.post('/UserProfile/public-by-users', userIds);
        return res.data?.data ?? res.data ?? [];
      },
      enabled: userIds.length > 0,
    });
  };

  // GET Smart Profile (Try multiple endpoints to find user data)
  const useGetPublicProfile = (userId: number) => {
    return useQuery<UserPublicProfileDto | null>({
      queryKey: ['users', 'public-profile', userId],
      queryFn: async () => {
        // List of endpoints to try in order of importance/likelihood
        const endpoints = [
          `/Profile/by-user/${userId}`,      // Basic profile (Identity/Photo)
          `/UserProfile/member/${userId}`,   // Member-specific summary
          `/UserProfile/by-user/${userId}`,  // Full candidate profile
        ];

        for (const endpoint of endpoints) {
          try {
            const res = await api.get(endpoint);
            const rawData = res.data?.data ?? res.data;
            
            if (!rawData) continue;

            // Normalize data to standard UserPublicProfileDto
            const normalized: UserPublicProfileDto = {
              userId: Number(rawData.userId ?? rawData.id ?? userId),
              fullName: rawData.fullName || (rawData.firstName ? `${rawData.firstName} ${rawData.lastName || ''}`.trim() : null),
              firstName: rawData.firstName || null,
              lastName: rawData.lastName || null,
              title: rawData.headline || rawData.title || null,
              avatarUrl: rawData.photoUrl || rawData.avatarUrl || null,
              photoUrl: rawData.photoUrl || null,
              headline: rawData.headline || null,
            };

            return normalized;
          } catch (error: unknown) {
            // Ignore 404 and try next endpoint
            if (axios.isAxiosError(error) && error.response?.status === 404) continue;
            console.warn(`Failed to fetch from ${endpoint}:`, error instanceof Error ? error.message : 'Unknown error');
          }
        }

        return null; // All endpoints failed or returned nothing
      },
      enabled: !!userId,
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
    useGetPublicProfiles,
    useGetPublicProfile,
    useGetSettings,
    useUpdateSettings,
  };
};
