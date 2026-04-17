'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { UserProfile, Education, Experience } from '@/types/profile';
import { ProfileSkill, CreateProfileSkillDto, ProfileLanguage, CreateProfileLanguageDto, UpdateProfileLanguageDto, Endorsement, CreateEndorsementDto } from '@/types/skill';

export const useProfile = () => {
  const queryClient = useQueryClient();

  // GET /api/Profile — own profile
  const useGetProfile = () => {
    return useQuery<UserProfile>({
      queryKey: ['profile'],
      queryFn: async () => {
        const response = await api.get('/Profile');
        return response.data.data ?? response.data ?? null;
      },
    });
  };

  // GET /api/Profile/by-user/:userId — public profile view
  const useGetProfileByUser = (userId: number | string | null) => {
    return useQuery<UserProfile>({
      queryKey: ['profile', 'by-user', userId],
      queryFn: async () => {
        const response = await api.get(`/Profile/by-user/${userId}`);
        return response.data.data ?? response.data ?? null;
      },
      enabled: !!userId,
    });
  };

  // PUT /api/Profile — update own profile
  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: async (data: Partial<UserProfile>) => {
        const response = await api.put('/Profile', data);
        return response.data.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      },
    });
  };

  // --- Education ---
  const useAddEducation = () => {
    return useMutation({
      mutationFn: async (data: Omit<Education, 'id'>) => {
        const response = await api.post('/Education', data);
        return response.data;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
    });
  };

  const useUpdateEducation = () => {
    return useMutation({
      mutationFn: async (data: Education) => {
        const response = await api.put(`/Education/${data.id}`, data);
        return response.data;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
    });
  };

  const useDeleteEducation = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.delete(`/Education/${id}`);
        return response.data;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
    });
  };

  // --- Experience ---
  const useAddExperience = () => {
    return useMutation({
      mutationFn: async (data: Omit<Experience, 'id'>) => {
        const response = await api.post('/Experience', data);
        return response.data;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
    });
  };

  const useUpdateExperience = () => {
    return useMutation({
      mutationFn: async (data: Experience) => {
        const response = await api.put(`/Experience/${data.id}`, data);
        return response.data;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
    });
  };

  const useDeleteExperience = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.delete(`/Experience/${id}`);
        return response.data;
      },
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
    });
  };

  // --- ProfileSkill ---

  // GET /api/ProfileSkill — own skills
  const useGetProfileSkills = () => {
    return useQuery<ProfileSkill[]>({
      queryKey: ['profileSkills'],
      queryFn: async () => {
        const response = await api.get('/ProfileSkill');
        return response.data.data ?? response.data ?? null;
      },
    });
  };

  // POST /api/ProfileSkill
  const useAddProfileSkill = () => {
    return useMutation({
      mutationFn: async (data: CreateProfileSkillDto) => {
        const response = await api.post('/ProfileSkill', data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profileSkills'] });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      },
    });
  };

  // DELETE /api/ProfileSkill/:id
  const useDeleteProfileSkill = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.delete(`/ProfileSkill/${id}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profileSkills'] });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      },
    });
  };

  // --- ProfileLanguage ---

  // GET /api/ProfileLanguage — own languages
  const useGetProfileLanguages = () => {
    return useQuery<ProfileLanguage[]>({
      queryKey: ['profileLanguages'],
      queryFn: async () => {
        const response = await api.get('/ProfileLanguage');
        return response.data.data ?? response.data ?? null;
      },
    });
  };

  // POST /api/ProfileLanguage
  const useAddProfileLanguage = () => {
    return useMutation({
      mutationFn: async (data: CreateProfileLanguageDto) => {
        const response = await api.post('/ProfileLanguage', data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profileLanguages'] });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      },
    });
  };

  // PUT /api/ProfileLanguage/:id
  const useUpdateProfileLanguage = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: UpdateProfileLanguageDto }) => {
        const response = await api.put(`/ProfileLanguage/${id}`, data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profileLanguages'] });
      },
    });
  };

  // DELETE /api/ProfileLanguage/:id
  const useDeleteProfileLanguage = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.delete(`/ProfileLanguage/${id}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profileLanguages'] });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      },
    });
  };

  // --- Endorsement ---

  // POST /api/Endorsement
  const useAddEndorsement = () => {
    return useMutation({
      mutationFn: async (data: CreateEndorsementDto) => {
        const response = await api.post('/Endorsement', data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profileSkills'] });
      },
    });
  };

  // DELETE /api/Endorsement/:id
  const useDeleteEndorsement = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.delete(`/Endorsement/${id}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profileSkills'] });
      },
    });
  };

  // GET /api/Endorsement/by-user/:userId
  const useGetEndorsementsByUser = (userId: number | null) => {
    return useQuery<Endorsement[]>({
      queryKey: ['endorsements', 'by-user', userId],
      queryFn: async () => {
        const response = await api.get(`/Endorsement/by-user/${userId}`);
        return response.data.data ?? response.data ?? null;
      },
      enabled: !!userId,
    });
  };

  return {
    useGetProfile,
    useGetProfileByUser,
    useUpdateProfile,
    useAddEducation,
    useUpdateEducation,
    useDeleteEducation,
    useAddExperience,
    useUpdateExperience,
    useDeleteExperience,
    useGetProfileSkills,
    useAddProfileSkill,
    useDeleteProfileSkill,
    useGetProfileLanguages,
    useAddProfileLanguage,
    useUpdateProfileLanguage,
    useDeleteProfileLanguage,
    useAddEndorsement,
    useDeleteEndorsement,
    useGetEndorsementsByUser,
  };
};
