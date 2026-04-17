'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { 
  Job, 
  JobPagedResult, 
  CreateJobDto, 
  UpdateJobDto, 
  JobApplication, 
  JobApplicationPagedResult, 
  CreateJobApplicationDto,
  UpdateJobApplicationDto,
  JobWithMatchDto,
  JobWithMatchDtoPagedResult,
  ApplicantWithMatchDtoPagedResult,
  JobCategory,
  CreateJobCategoryDto,
  JobSkill,
  CreateJobSkillDto
} from '@/types/job';

export const useJobQueries = () => {
  const queryClient = useQueryClient();

  // --- JOB MANAGEMENT ---

  const useJobs = (params?: { 
    SearchTerm?: string; 
    Location?: string; 
    JobType?: string; 
    ExperienceLevel?: string; 
    PageNumber?: number; 
    PageSize?: number; 
  }) => {
    return useQuery<JobPagedResult>({
      queryKey: ['jobs', 'paged', params],
      queryFn: async () => {
        const res = await api.get('/Job/paged', { params });
        return res.data?.data ?? res.data;
      },
    });
  };

  const useGetJob = (id: number) => {
    return useQuery<Job>({
      queryKey: ['jobs', id],
      queryFn: async () => {
        const res = await api.get(`/Job/${id}`);
        return res.data?.data ?? res.data;
      },
      enabled: !!id,
    });
  };

  const useGetMyJobs = () => {
    return useQuery<Job[]>({
      queryKey: ['jobs', 'mine'],
      queryFn: async () => {
        const res = await api.get('/Job/mine');
        return res.data?.data ?? res.data ?? [];
      },
    });
  };

  const useGetJobsByOrganization = (organizationId: number) => {
    return useQuery<Job[]>({
      queryKey: ['jobs', 'organization', organizationId],
      queryFn: async () => {
        const res = await api.get(`/Job/by-organization/${organizationId}`);
        return res.data?.data ?? res.data ?? [];
      },
      enabled: !!organizationId,
    });
  };

  const useCreateJob = () => {
    return useMutation<Job, Error, CreateJobDto>({
      mutationFn: async (data) => {
        const res = await api.post('/Job', data);
        return res.data?.data ?? res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
      },
    });
  };

  const useUpdateJob = (id: number) => {
    return useMutation<Job, Error, UpdateJobDto>({
      mutationFn: async (data) => {
        const res = await api.put(`/Job/${id}`, data);
        return res.data?.data ?? res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['jobs', id] });
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
      },
    });
  };

  const useDeleteJob = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (id) => {
        const res = await api.delete(`/Job/${id}`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
      },
    });
  };

  // --- APPLICATIONS ---

  const useGetApplicationsPaged = (params?: { PageNumber?: number; PageSize?: number }) => {
    return useQuery<JobApplicationPagedResult>({
      queryKey: ['applications', 'paged', params],
      queryFn: async () => {
        const res = await api.get('/JobApplication/paged', { params });
        return res.data?.data ?? res.data;
      },
    });
  };

  const useMyApplications = () => {
    return useQuery<JobApplication[]>({
      queryKey: ['applications', 'mine'],
      queryFn: async () => {
        const res = await api.get('/JobApplication');
        return res.data?.data ?? res.data ?? [];
      },
    });
  };

  const useApplyToJob = () => {
    return useMutation<JobApplication, Error, CreateJobApplicationDto>({
      mutationFn: async (data) => {
        const res = await api.post('/JobApplication', data);
        return res.data?.data ?? res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['applications'] });
      },
    });
  };

  const useGetApplicationsByJob = (jobId: number) => {
    return useQuery<JobApplication[]>({
      queryKey: ['applications', 'by-job', jobId],
      queryFn: async () => {
        const res = await api.get(`/JobApplication/by-job/${jobId}`);
        return res.data?.data ?? res.data ?? [];
      },
      enabled: !!jobId,
    });
  };

  const useUpdateApplication = () => {
    return useMutation<JobApplication, Error, UpdateJobApplicationDto>({
      mutationFn: async (data) => {
        const res = await api.put(`/JobApplication/${data.id}`, data);
        return res.data?.data ?? res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['applications'] });
      },
    });
  };

  // --- MATCHING ---

  const useGetMatchesForJob = (jobId: number, params?: { PageNumber?: number; PageSize?: number }) => {
    return useQuery<ApplicantWithMatchDtoPagedResult>({
      queryKey: ['matching', 'job', jobId, params],
      queryFn: async () => {
        const res = await api.get(`/JobMatching/match-for-job/${jobId}`, { params });
        return res.data?.data ?? res.data;
      },
      enabled: !!jobId,
    });
  };

  const useGetMatchesForUser = (userId: number, params?: { PageNumber?: number; PageSize?: number }) => {
    return useQuery<JobWithMatchDtoPagedResult>({
      queryKey: ['matching', 'user', userId, params],
      queryFn: async () => {
        const res = await api.get(`/JobMatching/match-for-user/${userId}`, { params });
        return res.data?.data ?? res.data;
      },
      enabled: !!userId,
    });
  };

  // --- UTILITIES ---

  const useGetCategories = () => {
    return useQuery<JobCategory[]>({
      queryKey: ['jobCategories'],
      queryFn: async () => {
        const res = await api.get('/JobCategory');
        return res.data?.data ?? res.data ?? [];
      },
    });
  };

  const useGetJobSkills = (jobId: number) => {
    return useQuery<JobSkill[]>({
      queryKey: ['jobSkills', jobId],
      queryFn: async () => {
        const res = await api.get(`/JobSkill/by-job/${jobId}`);
        return res.data?.data ?? res.data ?? [];
      },
      enabled: !!jobId,
    });
  };

  const useSearchJobs = (params?: { SearchTerm?: string; PageNumber?: number; PageSize?: number }) => {
    return useQuery<JobPagedResult>({
      queryKey: ['jobs', 'search', params],
      queryFn: async () => {
        const res = await api.get('/Job/search', { params });
        return res.data?.data ?? res.data;
      },
    });
  };

  return {
    useJobs,
    useGetJob,
    useGetMyJobs,
    useGetJobsByOrganization,
    useCreateJob,
    useUpdateJob,
    useDeleteJob,
    useGetApplicationsPaged,
    useMyApplications,
    useApplyToJob,
    useUpdateApplication,
    useGetApplicationsByJob,
    useGetMatchesForJob,
    useGetMatchesForUser,
    useGetCategories,
    useGetJobSkills,
    useSearchJobs,
  };
};
