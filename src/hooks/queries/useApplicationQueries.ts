"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  JobApplication,
  JobApplicationPagedResult,
  ApplicationStatus,
} from "@/types/job";

export const useApplicationQueries = () => {
  const queryClient = useQueryClient();

  // GET /api/JobApplication/paged — org-side paged view with filters
  const useApplicationsPaged = (params?: {
    status?: ApplicationStatus;
    jobId?: number;
    userId?: number;
    pageNumber?: number;
    pageSize?: number;
  }) => {
    return useQuery<JobApplicationPagedResult>({
      queryKey: ["applications", "paged", params],
      queryFn: async () => {
        const response = await api.get("/JobApplication/paged", { params });
        return response.data.data ?? response.data ?? null;
      },
    });
  };

  // GET /api/JobApplication/by-job/:jobId — all applicants for a job
  const useApplicationsByJob = (jobId: number | null) => {
    return useQuery<JobApplication[]>({
      queryKey: ["applications", "by-job", jobId],
      queryFn: async () => {
        const response = await api.get(`/JobApplication/by-job/${jobId}`);
        return response.data.data ?? response.data ?? null;
      },
      enabled: !!jobId,
    });
  };

  // GET /api/JobApplication/by-user/:userId — all applications from a user
  const useApplicationsByUser = (userId: number | null) => {
    return useQuery<JobApplication[]>({
      queryKey: ["applications", "by-user", userId],
      queryFn: async () => {
        const response = await api.get(`/JobApplication/by-user/${userId}`);
        return response.data.data ?? response.data ?? null;
      },
      enabled: !!userId,
    });
  };

  // GET /api/JobApplication/:id — single application
  const useApplication = (id: number | null) => {
    return useQuery<JobApplication>({
      queryKey: ["application", id],
      queryFn: async () => {
        const response = await api.get(`/JobApplication/${id}`);
        return response.data.data ?? response.data ?? null;
      },
      enabled: !!id,
    });
  };

  // POST /api/JobApplication — submit a new application
  const useApplyForJob = () => {
    return useMutation({
      mutationFn: async (data: { jobId: number; coverLetter?: string }) => {
        const response = await api.post("/JobApplication", data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["applications"] });
      },
      meta: { toast: true, action: "sync" },
    });
  };

  // PATCH /api/JobApplication/:id/status — org reviews an application
  const useUpdateApplicationStatus = () => {
    return useMutation({
      mutationFn: async ({
        id,
        status,
      }: {
        id: number;
        status: ApplicationStatus;
      }) => {
        const response = await api.patch(
          `/JobApplication/${id}/status`,
          JSON.stringify(status),
          {
            headers: { "Content-Type": "application/json" },
          },
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["applications"] });
      },
      meta: { toast: true, action: "sync" },
    });
  };

  // DELETE /api/JobApplication/:id — withdraw application
  const useWithdrawApplication = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.delete(`/JobApplication/${id}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["applications"] });
      },
      meta: { toast: true, action: "delete" },
    });
  };

  return {
    useApplicationsPaged,
    useApplicationsByJob,
    useApplicationsByUser,
    useApplication,
    useApplyForJob,
    useUpdateApplicationStatus,
    useWithdrawApplication,
  };
};
