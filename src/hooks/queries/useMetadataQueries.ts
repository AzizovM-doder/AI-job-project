"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { JobCategory } from "@/types/job";
import { Language } from "@/types/skill";

export const useMetadataQueries = () => {
  // GET /api/JobCategory — all categories
  const useJobCategories = () => {
    return useQuery<JobCategory[]>({
      queryKey: ["metadata", "jobCategories"],
      queryFn: async () => {
        const response = await api.get("/JobCategory");
        return response.data.data ?? response.data ?? null;
      },
      staleTime: 10 * 60 * 1000,
    });
  };

  // GET /api/Language — all languages
  const useLanguages = () => {
    return useQuery<Language[]>({
      queryKey: ["metadata", "languages"],
      queryFn: async () => {
        const response = await api.get("/Language");
        return response.data.data ?? response.data ?? null;
      },
      staleTime: 10 * 60 * 1000,
    });
  };

  // GET /api/Language/search?name=...
  const useLanguageSearch = (name: string) => {
    return useQuery<Language[]>({
      queryKey: ["metadata", "languages", "search", name],
      queryFn: async () => {
        const response = await api.get("/Language/search", {
          params: { name },
        });
        return response.data.data ?? response.data ?? null;
      },
      enabled: name.length > 1,
    });
  };

  // GET /api/JobSkill/by-job/:jobId
  const useJobSkills = (jobId: number | null) => {
    return useQuery({
      queryKey: ["jobSkills", jobId],
      queryFn: async () => {
        const response = await api.get(`/JobSkill/by-job/${jobId}`);
        return response.data.data ?? response.data ?? null;
      },
      enabled: !!jobId,
    });
  };

  return {
    useJobCategories,
    useLanguages,
    useLanguageSearch,
    useJobSkills,
  };
};
