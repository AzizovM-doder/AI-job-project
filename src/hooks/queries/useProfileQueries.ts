"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
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
  CreateRecommendationDto,
  UserCandidateProfile,
  CreateCandidateProfileDto,
  Skill,
} from "@/types/profile";

export const useProfileQueries = () => {
  const queryClient = useQueryClient();

  // --- CORE PROFILE (Identity) ---

  const useGetProfile = (id: number) => {
    return useQuery<UserProfile>({
      queryKey: ["profiles", "basic", id],
      queryFn: async () => {
        const res = await api.get(`/Profile/${id}`);
        return res.data?.data ?? res.data;
      },
      enabled: !!id,
    });
  };

  const useGetProfileByUserId = (userId: number) => {
    return useQuery<UserProfile | null>({
      queryKey: ["profiles", "basic", "user", userId],
      queryFn: async () => {
        const res = await api.get(`/Profile/by-user/${userId}`);
        const data = res.data?.data ?? res.data;
        // If the backend returns an envelope with 404 but 200 OK at HTTP level
        if (res.data?.statusCode === 404 || !data || data.statusCode === 404) {
          return null;
        }
        return data;
      },
      enabled: !!userId,
    });
  };

  const useUpdateProfile = () => {
    return useMutation<UserProfile, Error, UpdateUserProfileDto>({
      mutationFn: async (data) => {
        // Fallback to POST if ID is 0 or missing
        if (!data.id || data.id === 0) {
          const res = await api.post("/Profile", data);
          return res.data?.data ?? res.data;
        }
        const res = await api.put(`/Profile/${data.id}`, data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["profiles", "basic"] });
        queryClient.invalidateQueries({
          queryKey: ["profiles", "basic", "user"],
        });
      },
      meta: { toast: true, action: "sync" },
    });
  };

  // --- CANDIDATE PROFILE (Detailed) ---

  const useGetCandidateProfile = (userId: number) => {
    return useQuery<UserCandidateProfile>({
      queryKey: ["profiles", "candidate", userId],
      queryFn: async () => {
        const res = await api.get(`/UserProfile/by-user/${userId}`);
        return res.data?.data ?? res.data;
      },
      enabled: !!userId,
    });
  };

  const useUpdateCandidateProfile = () => {
    return useMutation<UserCandidateProfile, Error, CreateCandidateProfileDto & { id?: number }>({
      mutationFn: async (data) => {
        // If an ID exists, use PUT to update the record
        if (data.id && data.id !== 0) {
          const res = await api.put(`/UserProfile/${data.id}`, data);
          return res.data?.data ?? res.data;
        }
        // Otherwise, use POST to create a new record
        const res = await api.post("/UserProfile", data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["profiles", "candidate", variables.userId],
        });
      },
      meta: { toast: true, action: "sync" },
    });
  };

  // --- EDUCATION ---

  const useGetEducationsByUser = (userId: number) => {
    return useQuery<Education[]>({
      queryKey: ["profiles", "user", userId, "education"],
      queryFn: async () => {
        const res = await api.get(`/UserEducation/by-user/${userId}`);
        return res.data?.data ?? res.data ?? [];
      },
      enabled: !!userId,
    });
  };

  const useAddEducation = () => {
    return useMutation<Education, Error, CreateUserEducationDto>({
      mutationFn: async (data) => {
        const res = await api.post("/UserEducation", data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["profiles", "user", variables.userId, "education"],
        });
      },
      meta: { toast: true, action: "create" },
    });
  };

  const useUpdateEducation = () => {
    return useMutation<Education, Error, Education>({
      mutationFn: async (data) => {
        const res = await api.put(`/UserEducation/${data.id}`, data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["profiles", "user", variables.userId, "education"],
        });
      },
      meta: { toast: true, action: "sync" },
    });
  };

  const useDeleteEducation = () => {
    return useMutation<void, Error, { id: number; userId: number }>({
      mutationFn: async ({ id }) => {
        await api.delete(`/UserEducation/${id}`);
      },
      onSuccess: (_, { userId }) => {
        queryClient.invalidateQueries({
          queryKey: ["profiles", "user", userId, "education"],
        });
      },
      meta: { toast: true, action: "delete" },
    });
  };

  // --- EXPERIENCE ---

  const useGetExperiencesByUser = (userId: number) => {
    return useQuery<Experience[]>({
      queryKey: ["profiles", "user", userId, "experience"],
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
        const res = await api.post("/UserExperience", data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["profiles", "user", variables.userId, "experience"],
        });
      },
      meta: { toast: true, action: "create" },
    });
  };

  const useUpdateExperience = () => {
    return useMutation<Experience, Error, Experience>({
      mutationFn: async (data) => {
        const res = await api.put(`/UserExperience/${data.id}`, data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["profiles", "user", variables.userId, "experience"],
        });
      },
      meta: { toast: true, action: "sync" },
    });
  };

  const useDeleteExperience = () => {
    return useMutation<void, Error, { id: number; userId: number }>({
      mutationFn: async ({ id }) => {
        await api.delete(`/UserExperience/${id}`);
      },
      onSuccess: (_, { userId }) => {
        queryClient.invalidateQueries({
          queryKey: ["profiles", "user", userId, "experience"],
        });
      },
      meta: { toast: true, action: "delete" },
    });
  };

  // --- SKILLS & ENDORSEMENTS ---

  const useGetProfileSkills = (profileId: number) => {
    return useQuery<ProfileSkill[]>({
      queryKey: ["profiles", profileId, "skills"],
      queryFn: async () => {
        const res = await api.get(`/ProfileSkill/by-profile/${profileId}`);
        return res.data?.data ?? res.data ?? [];
      },
      enabled: !!profileId,
    });
  };

  const useSearchSkills = (name: string) => {
    return useQuery<Skill[]>({
      queryKey: ["skills", "search", name],
      queryFn: async () => {
        const res = await api.get("/Skill/search", { params: { name } });
        return res.data?.data ?? res.data ?? [];
      },
      enabled: name.length > 1,
    });
  };

  const useAddProfileSkill = () => {
    return useMutation<ProfileSkill, Error, CreateProfileSkillDto>({
      mutationFn: async (data) => {
        const res = await api.post("/ProfileSkill", data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["profiles", variables.profileId, "skills"],
        });
      },
      meta: { toast: true, action: "sync" },
    });
  };

  const useDeleteProfileSkill = () => {
    return useMutation<void, Error, { id: number; profileId: number }>({
      mutationFn: async ({ id }) => {
        await api.delete(`/ProfileSkill/${id}`);
      },
      onSuccess: (_, { profileId }) => {
        queryClient.invalidateQueries({
          queryKey: ["profiles", profileId, "skills"],
        });
      },
      meta: { toast: true, action: "delete" },
    });
  };

  const useAddEndorsement = () => {
    return useMutation<Endorsement, Error, { profileSkillId: number; profileId: number }, { previousSkills: ProfileSkill[] | undefined }>({
      mutationFn: async ({ profileSkillId }) => {
        const res = await api.post("/Endorsement", { profileSkillId });
        return res.data?.data ?? res.data;
      },
      onMutate: async ({ profileSkillId, profileId }) => {
        await queryClient.cancelQueries({ queryKey: ["profiles", profileId, "skills"] });
        const previousSkills = queryClient.getQueryData<ProfileSkill[]>(["profiles", profileId, "skills"]);

        if (previousSkills) {
          queryClient.setQueryData<ProfileSkill[]>(
            ["profiles", profileId, "skills"],
            previousSkills.map(s => 
              s.id === profileSkillId ? { ...s, endorsementsCount: (s.endorsementsCount || 0) + 1 } : s
            )
          );
        }
        return { previousSkills };
      },
      onError: (err, variables, context) => {
        if (context?.previousSkills) {
          queryClient.setQueryData(["profiles", variables.profileId, "skills"], context.previousSkills);
        }
      },
      onSettled: (data, error, variables) => {
        queryClient.invalidateQueries({ queryKey: ["profiles", variables.profileId, "skills"] });
      },
      meta: { toast: true, action: "sync" },
    });
  };

  // --- LANGUAGES ---

  const useGetProfileLanguages = (profileId: number) => {
    return useQuery<ProfileLanguage[]>({
      queryKey: ["profiles", profileId, "languages"],
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
        const res = await api.post("/ProfileLanguage", data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["profiles", variables.profileId, "languages"],
        });
      },
      meta: { toast: true, action: "sync" },
    });
  };

  const useDeleteProfileLanguage = () => {
    return useMutation<void, Error, { id: number; profileId: number }>({
      mutationFn: async ({ id }) => {
        await api.delete(`/ProfileLanguage/${id}`);
      },
      onSuccess: (_, { profileId }) => {
        queryClient.invalidateQueries({
          queryKey: ["profiles", profileId, "languages"],
        });
      },
      meta: { toast: true, action: "delete" },
    });
  };

  // --- RECOMMENDATIONS ---

  const useGetRecommendations = (recipientId: number) => {
    return useQuery<Recommendation[]>({
      queryKey: ["profiles", "user", recipientId, "recommendations"],
      queryFn: async () => {
        const res = await api.get(
          `/Recommendation/by-recipient/${recipientId}`,
        );
        return res.data?.data ?? res.data ?? [];
      },
      enabled: !!recipientId,
    });
  };

  const useGetRecommendationById = (id: number) => {
    return useQuery<Recommendation>({
      queryKey: ["recommendations", id],
      queryFn: async () => {
        const res = await api.get(`/Recommendation/${id}`);
        return res.data?.data ?? res.data;
      },
      enabled: !!id,
    });
  };

  const useAddRecommendation = () => {
    return useMutation<Recommendation, Error, CreateRecommendationDto>({
      mutationFn: async (data) => {
        const res = await api.post("/Recommendation", data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: [
            "profiles",
            "user",
            variables.recipientId,
            "recommendations",
          ],
        });
      },
      meta: { toast: true, action: "sync" },
    });
  };

  const useDeleteRecommendation = (recipientId: number) => {
    return useMutation<void, Error, number>({
      mutationFn: async (id) => {
        await api.delete(`/Recommendation/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["profiles", "user", recipientId, "recommendations"],
        });
      },
      meta: { toast: true, action: "delete" },
    });
  };

  // --- UPLOAD ---

  const useUploadPhoto = () => {
    return useMutation<string, Error, File>({
      mutationFn: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await api.post("/Upload/photo", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data?.data ?? res.data;
      },
      meta: { toast: true, action: "sync" },
    });
  };

  const useUploadCV = () => {
    return useMutation<string, Error, File>({
      mutationFn: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await api.post("/Upload/cv", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data?.data ?? res.data;
      },
      meta: { toast: true, action: "sync" },
    });
  };

  return {
    useGetProfile,
    useGetProfileByUserId,
    useUpdateProfile,
    useGetCandidateProfile,
    useUpdateCandidateProfile,
    useGetEducationsByUser,
    useAddEducation,
    useUpdateEducation,
    useDeleteEducation,
    useGetExperiencesByUser,
    useAddExperience,
    useUpdateExperience,
    useDeleteExperience,
    useGetProfileSkills,
    useSearchSkills,
    useAddProfileSkill,
    useDeleteProfileSkill,
    useGetProfileLanguages,
    useAddProfileLanguage,
    useDeleteProfileLanguage,
    useGetRecommendations,
    useGetRecommendationById,
    useAddRecommendation,
    useDeleteRecommendation,
    useAddEndorsement,
    useUploadPhoto,
    useUploadCV,
  };
};
