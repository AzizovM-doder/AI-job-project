'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { 
  UserProfile, 
  MemberProfileDto,
  Experience,
  Education,
  ProfileSkill,
  ProfileLanguage,
  Endorsement,
  Recommendation,
  CreateUserProfileDto,
  UpdateUserProfileDto,
  CreateUserEducationDto,
  CreateUserExperienceDto,
  CreateProfileSkillDto,
  CreateProfileLanguageDto,
  CreateEndorsementDto,
  CreateRecommendationDto
} from '@/src/types/profile';

export const useProfileQueries = () => {
  const queryClient = useQueryClient();

  // --- CORE PROFILE ---

  const useGetProfile = (id: number) => {
    return useQuery<UserProfile>({
      queryKey: ['profiles', id],
      queryFn: async () => {
        const res = await api.get(`/Profile/${id}`);
        return res.data?.data ?? res.data;
      },
      enabled: !!id,
    });
  };

  const useGetProfileByUserId = (userId: number) => {
    return useQuery<UserProfile>({
      queryKey: ['profiles', 'user', userId],
      queryFn: async () => {
        const res = await api.get(`/Profile/by-user/${userId}`);
        return res.data?.data ?? res.data;
      },
      enabled: !!userId,
    });
  };

  const useCreateProfile = () => {
    return useMutation<UserProfile, Error, CreateUserProfileDto>({
      mutationFn: async (data) => {
        const res = await api.post('/Profile', data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['profiles'] });
      },
    });
  };

  const useUpdateProfile = () => {
    return useMutation<UserProfile, Error, UpdateUserProfileDto>({
      mutationFn: async (data) => {
        const res = await api.put(`/Profile/${data.id}`, data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['profiles', data.id] });
        queryClient.invalidateQueries({ queryKey: ['profiles', 'user', data.userId] });
      },
    });
  };

  // --- EDUCATION ---

  const useGetEducationsByProfile = (profileId: number) => {
    return useQuery<Education[]>({
      queryKey: ['profiles', profileId, 'education'],
      queryFn: async () => {
        const res = await api.get(`/Education/by-profile/${profileId}`);
        return res.data?.data ?? res.data ?? [];
      },
      enabled: !!profileId,
    });
  };

  const useAddEducation = () => {
    return useMutation<Education, Error, CreateUserEducationDto>({
      mutationFn: async (data) => {
        const res = await api.post('/Education', data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['profiles'] });
      },
    });
  };

  const useDeleteEducation = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (id) => {
        await api.delete(`/Education/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profiles'] });
      },
    });
  };

  // --- EXPERIENCE ---

  const useGetExperiencesByUser = (userId: number) => {
    return useQuery<Experience[]>({
      queryKey: ['profiles', 'user', userId, 'experience'],
      queryFn: async () => {
        const res = await api.get(`/UserExperience/by-user/${userId}`);
        return res.data?.data ?? res.data ?? [];
      },
      enabled: !!userId,
    });
  };

  const useAddExperience = () => {
    return useMutation<Experience, Error, CreateUserExperienceDto>({
      mutationFn: async (data) => {
        const res = await api.post('/UserExperience', data);
        return res.data?.data ?? res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profiles'] });
      },
    });
  };

  const useDeleteExperience = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (id) => {
        await api.delete(`/UserExperience/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profiles'] });
      },
    });
  };

  // --- SKILLS & ENDORSEMENTS ---

  const useGetProfileSkills = (profileId: number) => {
    return useQuery<ProfileSkill[]>({
      queryKey: ['profiles', profileId, 'skills'],
      queryFn: async () => {
        const res = await api.get(`/ProfileSkill/by-profile/${profileId}`);
        return res.data?.data ?? res.data ?? [];
      },
      enabled: !!profileId,
    });
  };

  const useAddProfileSkill = () => {
    return useMutation<ProfileSkill, Error, CreateProfileSkillDto>({
      mutationFn: async (data) => {
        const res = await api.post('/ProfileSkill', data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['profiles', variables.profileId, 'skills'] });
      },
    });
  };

  const useDeleteProfileSkill = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (id) => {
        await api.delete(`/ProfileSkill/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profiles'] });
      },
    });
  };

  const useAddEndorsement = () => {
    return useMutation<Endorsement, Error, CreateEndorsementDto>({
      mutationFn: async (data) => {
        const res = await api.post('/Endorsement', data);
        return res.data?.data ?? res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profiles'] });
      },
    });
  };

  const useDeleteEndorsement = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (id) => {
        await api.delete(`/Endorsement/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profiles'] });
      },
    });
  };

  // --- LANGUAGES ---

  const useGetProfileLanguages = (profileId: number) => {
    return useQuery<ProfileLanguage[]>({
      queryKey: ['profiles', profileId, 'languages'],
      queryFn: async () => {
        const res = await api.get(`/ProfileLanguage/by-profile/${profileId}`);
        return res.data?.data ?? res.data ?? [];
      },
      enabled: !!profileId,
    });
  };

  const useAddProfileLanguage = () => {
    return useMutation<ProfileLanguage, Error, CreateProfileLanguageDto>({
      mutationFn: async (data) => {
        const res = await api.post('/ProfileLanguage', data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['profiles', variables.profileId, 'languages'] });
      },
    });
  };

  const useDeleteProfileLanguage = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (id) => {
        await api.delete(`/ProfileLanguage/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profiles'] });
      },
    });
  };

  // --- RECOMMENDATIONS ---

  const useGetRecommendations = (recipientId: number) => {
    return useQuery<Recommendation[]>({
      queryKey: ['profiles', 'user', recipientId, 'recommendations'],
      queryFn: async () => {
        const res = await api.get(`/Recommendation/by-recipient/${recipientId}`);
        return res.data?.data ?? res.data ?? [];
      },
      enabled: !!recipientId,
    });
  };

  const useAddRecommendation = () => {
    return useMutation<Recommendation, Error, CreateRecommendationDto>({
      mutationFn: async (data) => {
        const res = await api.post('/Recommendation', data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['profiles', 'user', variables.recipientId, 'recommendations'] });
      },
    });
  };

  return {
    useGetProfile,
    useGetProfileByUserId,
    useCreateProfile,
    useUpdateProfile,
    useGetEducationsByProfile,
    useAddEducation,
    useGetExperiencesByUser,
    useAddExperience,
    useGetProfileSkills,
    useAddProfileSkill,
    useAddEndorsement,
    useGetProfileLanguages,
    useAddProfileLanguage,
    useDeleteProfileLanguage,
    useGetRecommendations,
    useAddRecommendation,
    useDeleteEducation,
    useDeleteExperience,
    useDeleteProfileSkill,
    useDeleteEndorsement,
  };
};
