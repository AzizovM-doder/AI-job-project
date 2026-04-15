'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { useJobStore } from '@/src/store/jobStore';
import { Job, JobPagedResult, CreateJobDto, UpdateJobDto } from '@/src/types/job';
import { JobSkill, CreateJobSkillDto } from '@/src/types/skill';

export const useJobQueries = () => {
  const queryClient = useQueryClient();
  const { filters } = useJobStore();

  const useJobs = (params?: { PageNumber?: number; PageSize?: number; SearchTerm?: string }) => {
    const queryParams = {
      Title: params?.SearchTerm || filters.title || undefined,
      SalaryMin: (filters as any).minSalary,
      SalaryMax: (filters as any).maxSalary,
      JobType: filters.jobType,
      ExperienceLevel: filters.experienceLevel,
      PageNumber: params?.PageNumber || filters.page,
      PageSize: params?.PageSize || filters.pageSize,
    };

    return useQuery<JobPagedResult>({
      queryKey: ['jobs', queryParams],
      queryFn: async () => {
        const response = await api.get('/Job/paged', { params: queryParams });
        return response.data.data ?? response.data ?? null;
      },
      staleTime: 60 * 1000,
    });
  };

  const useJobDetail = (id: number | string | null) => {
    return useQuery<Job>({
      queryKey: ['job', id],
      queryFn: async () => {
        const response = await api.get(`/Job/${id}`);
        return response.data.data ?? response.data ?? null;
      },
      enabled: !!id,
    });
  };

  const useMyJobs = () => {
    return useQuery<Job[]>({
      queryKey: ['jobs', 'mine'],
      queryFn: async () => {
        const response = await api.get('/Job/mine');
        return response.data.data ?? response.data ?? null;
      },
    });
  };

  const useJobsByOrganization = (organizationId: number | null) => {
    return useQuery<Job[]>({
      queryKey: ['jobs', 'by-org', organizationId],
      queryFn: async () => {
        const response = await api.get(`/Job/by-organization/${organizationId}`);
        return response.data.data ?? response.data ?? null;
      },
      enabled: !!organizationId,
    });
  };

  // GET /api/JobApplication/paged — candidate's own applications
  const useMyApplications = () => {
    return useQuery({
      queryKey: ['jobApplications', 'mine'],
      queryFn: async () => {
        const response = await api.get('/JobApplication/paged');
        return response.data.data?.items ?? response.data?.items ?? response.data ?? null;
      },
    });
  };

  // POST /api/Job
  const useCreateJob = () => {
    return useMutation({
      mutationFn: async (data: CreateJobDto) => {
        const response = await api.post('/Job', data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
      },
    });
  };

  // PUT /api/Job/:id
  const useUpdateJob = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: UpdateJobDto }) => {
        const response = await api.put(`/Job/${id}`, data);
        return response.data;
      },
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
        queryClient.invalidateQueries({ queryKey: ['job', variables.id] });
      },
    });
  };

  // DELETE /api/Job/:id
  const useDeleteJob = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.delete(`/Job/${id}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
      },
    });
  };

  // GET /api/JobSkill/by-job/:jobId
  const useJobSkills = (jobId: number | null) => {
    return useQuery<JobSkill[]>({
      queryKey: ['jobSkills', jobId],
      queryFn: async () => {
        const response = await api.get(`/JobSkill/by-job/${jobId}`);
        return response.data.data ?? response.data ?? null;
      },
      enabled: !!jobId,
    });
  };

  // POST /api/JobSkill
  const useAddJobSkill = () => {
    return useMutation({
      mutationFn: async (data: CreateJobSkillDto) => {
        const response = await api.post('/JobSkill', data);
        return response.data;
      },
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['jobSkills', variables.jobId] });
      },
    });
  };

  // DELETE /api/JobSkill/:id
  const useDeleteJobSkill = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.delete(`/JobSkill/${id}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['jobSkills'] });
      },
    });
  };

  return {
    useJobs,
    useJobDetail,
    useMyJobs,
    useJobsByOrganization,
    useMyApplications,
    useCreateJob,
    useUpdateJob,
    useDeleteJob,
    useJobSkills,
    useAddJobSkill,
    useDeleteJobSkill,
  };
};
