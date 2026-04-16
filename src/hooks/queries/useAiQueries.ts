'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/src/lib/api';
import { 
  CreateAiPromptDto,
  AiCvAnalysisRequestDto,
  AiCvAnalysisResultDto,
  AiSkillGapResultDto,
  AiJobImproveRequestDto,
  AiJobImproveResultDto,
  AiDraftCoverLetterRequestDto,
  AiDraftMessageRequestDto,
  AiDraftResultDto
} from '@/src/types/ai';

export const useAiQueries = () => {
  
  // POST /api/Ai/ask
  const useAiAsk = () => {
    return useMutation<string, Error, CreateAiPromptDto>({
      mutationFn: async (data) => {
        const res = await api.post('/Ai/ask', data);
        return res.data?.data ?? res.data;
      },
    });
  };

  // POST /api/Ai/analyze-cv
  const useAnalyzeCv = () => {
    return useMutation<AiCvAnalysisResultDto, Error, AiCvAnalysisRequestDto>({
      mutationFn: async (data) => {
        const res = await api.post('/Ai/analyze-cv', data);
        return res.data?.data ?? res.data;
      },
    });
  };

  // GET /api/Ai/skill-gap/{userId}/{jobId}
  const useGetSkillGap = (userId: number, jobId: number) => {
    return useQuery<AiSkillGapResultDto>({
      queryKey: ['ai', 'skill-gap', userId, jobId],
      queryFn: async () => {
        const res = await api.get(`/Ai/skill-gap/${userId}/${jobId}`);
        return res.data?.data ?? res.data;
      },
      enabled: !!userId && !!jobId,
    });
  };

  // POST /api/Ai/improve-job
  const useImproveJob = () => {
    return useMutation<AiJobImproveResultDto, Error, AiJobImproveRequestDto>({
      mutationFn: async (data) => {
        const res = await api.post('/Ai/improve-job', data);
        return res.data?.data ?? res.data;
      },
    });
  };

  // POST /api/Ai/draft-cover-letter
  const useDraftCoverLetter = () => {
    return useMutation<AiDraftResultDto, Error, AiDraftCoverLetterRequestDto>({
      mutationFn: async (data) => {
        const res = await api.post('/Ai/draft-cover-letter', data);
        return res.data?.data ?? res.data;
      },
    });
  };

  // POST /api/Ai/draft-message
  const useDraftMessage = () => {
    return useMutation<AiDraftResultDto, Error, AiDraftMessageRequestDto>({
      mutationFn: async (data) => {
        const res = await api.post('/api/Ai/draft-message', data);
        return res.data?.data ?? res.data;
      },
    });
  };

  return {
    useAiAsk,
    useAnalyzeCv,
    useGetSkillGap,
    useImproveJob,
    useDraftCoverLetter,
    useDraftMessage,
  };
};
