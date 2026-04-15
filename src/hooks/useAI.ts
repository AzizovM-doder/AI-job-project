'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/src/lib/api';

export const useAI = () => {
  // POST /api/Ai/analyze-cv
  const useAnalyzeCV = () => {
    return useMutation({
      mutationFn: async (file: File) => {
        const formData = new FormData();
        formData.append('File', file);
        const response = await api.post('/Ai/analyze-cv', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
      },
    });
  };

  // GET /api/Ai/skill-gap/{userId}/{jobId}
  const useSkillGap = (userId: number, jobId: number) => {
    return useQuery({
      queryKey: ['ai-skill-gap', userId, jobId],
      queryFn: async () => {
        const response = await api.get(`/Ai/skill-gap/${userId}/${jobId}`);
        return response.data;
      },
      enabled: !!userId && !!jobId,
    });
  };

  // POST /api/Ai/improve-job
  const useImproveJob = () => {
    return useMutation({
      mutationFn: async (data: { jobTitle: string; currentDescription: string }) => {
        const response = await api.post('/Ai/improve-job', data);
        return response.data;
      },
    });
  };

  // POST /api/Ai/draft-cover-letter
  const useDraftCoverLetter = () => {
    return useMutation({
      mutationFn: async (data: { jobId: number; userId: number; tone?: string }) => {
        const response = await api.post('/Ai/draft-cover-letter', data);
        return response.data;
      },
    });
  };

  // POST /api/Ai/draft-message
  const useDraftMessage = () => {
    return useMutation({
      mutationFn: async (data: { targetUserId: number; context: string }) => {
        const response = await api.post('/Ai/draft-message', data);
        return response.data;
      },
    });
  };

  // POST /api/Ai/ask
  const useAskAI = () => {
    return useMutation({
      mutationFn: async (prompt: string) => {
        const response = await api.post('/Ai/ask', { prompt });
        return response.data;
      },
    });
  };

  return {
    useAnalyzeCV,
    useSkillGap,
    useImproveJob,
    useDraftCoverLetter,
    useDraftMessage,
    useAskAI,
  };
};
