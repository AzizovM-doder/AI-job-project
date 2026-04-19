"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  CreateAiPromptDto,
  AiCvAnalysisRequestDto,
  AiCvAnalysisResultDtoResponse,
  AiSkillGapResultDtoResponse,
  AiJobImproveRequestDto,
  AiJobImproveResultDtoResponse,
  AiDraftCoverLetterRequestDto,
  AiDraftMessageRequestDto,
  AiDraftResultDtoResponse,
} from "@/types/ai";

export const useAiQueries = () => {
  const queryClient = useQueryClient();

  // 1. Ask AI (Generic Prompt)
  const useAiAsk = () => {
    return useMutation({
      mutationFn: async (data: CreateAiPromptDto) => {
        const res = await api.post("/Ai/ask", data);
        return res.data;
      },
    });
  };

  // 2. CV Analyzer
  const useAiAnalyzeCv = () => {
    return useMutation({
      mutationFn: async (data: AiCvAnalysisRequestDto) => {
        const res = await api.post<AiCvAnalysisResultDtoResponse>(
          "/Ai/analyze-cv",
          data,
        );
        return res.data;
      },
      onSuccess: () => {
        // Invalidate profile query to show updated skills if sync was true
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      },
    });
  };

  // 3. Skill Gap Analysis
  const useAiSkillGap = (userId: number, jobId: number) => {
    return useQuery({
      queryKey: ["ai", "skill-gap", userId, jobId],
      queryFn: async () => {
        const res = await api.get<AiSkillGapResultDtoResponse>(
          `/Ai/skill-gap/${userId}/${jobId}`,
        );
        return res.data;
      },
      enabled: !!userId && !!jobId,
    });
  };

  // 4. Improve Job Post
  const useAiImproveJob = () => {
    return useMutation({
      mutationFn: async (data: AiJobImproveRequestDto) => {
        const res = await api.post<AiJobImproveResultDtoResponse>(
          "/Ai/improve-job",
          data,
        );
        return res.data;
      },
    });
  };

  // 5. Draft Cover Letter
  const useAiDraftCoverLetter = () => {
    return useMutation({
      mutationFn: async (data: AiDraftCoverLetterRequestDto) => {
        const res = await api.post<AiDraftResultDtoResponse>(
          "/Ai/draft-cover-letter",
          data,
        );
        return res.data;
      },
    });
  };

  // 6. Draft Message
  const useAiDraftMessage = () => {
    return useMutation({
      mutationFn: async (data: AiDraftMessageRequestDto) => {
        const res = await api.post<AiDraftResultDtoResponse>(
          "/Ai/draft-message",
          data,
        );
        return res.data;
      },
    });
  };

  return {
    useAiAsk,
    useAiAnalyzeCv,
    useAiSkillGap,
    useAiImproveJob,
    useAiDraftCoverLetter,
    useAiDraftMessage,
  };
};
