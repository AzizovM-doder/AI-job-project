'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/src/lib/api';
import {
  JobWithMatchDtoPagedResult,
  ApplicantWithMatchDtoPagedResult,
} from '@/src/types/job';

export const useJobMatchingQueries = () => {
  // GET /api/JobMatching/recommended-jobs/:userId
  const useRecommendedJobs = (
    userId: number | null,
    params?: {
      Title?: string;
      Location?: string;
      SalaryMin?: number;
      SalaryMax?: number;
      PageNumber?: number;
      PageSize?: number;
    }
  ) => {
    return useQuery<JobWithMatchDtoPagedResult>({
      queryKey: ['jobMatching', 'recommended', userId, params],
      queryFn: async () => {
        const response = await api.get(`/JobMatching/recommended-jobs/${userId}`, { params });
        return response.data.data ?? response.data ?? null;
      },
      enabled: !!userId,
      staleTime: 2 * 60 * 1000, // 2 min
    });
  };

  // GET /api/JobMatching/recommended-applicants/:jobId
  const useRecommendedApplicants = (
    jobId: number | null,
    params?: { PageNumber?: number; PageSize?: number }
  ) => {
    return useQuery<ApplicantWithMatchDtoPagedResult>({
      queryKey: ['jobMatching', 'applicants', jobId, params],
      queryFn: async () => {
        const response = await api.get(`/JobMatching/recommended-applicants/${jobId}`, { params });
        return response.data.data ?? response.data ?? null;
      },
      enabled: !!jobId,
    });
  };

  // GET /api/JobMatching/match-explanation/:userId/:jobId
  const useMatchExplanation = (userId: number | null, jobId: number | null, useAi = false) => {
    return useQuery<string>({
      queryKey: ['jobMatching', 'explanation', userId, jobId, useAi],
      queryFn: async () => {
        const response = await api.get(`/JobMatching/match-explanation/${userId}/${jobId}`, {
          params: { useAi },
        });
        return response.data.data ?? response.data ?? null;
      },
      enabled: !!userId && !!jobId,
    });
  };

  return {
    useRecommendedJobs,
    useRecommendedApplicants,
    useMatchExplanation,
  };
};
