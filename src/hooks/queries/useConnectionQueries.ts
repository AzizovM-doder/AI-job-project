"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Connection, ConnectionStatus } from "@/types/connection";
import { useAuthStore } from "@/store/authStore";

export const useConnectionQueries = () => {
  const queryClient = useQueryClient();

  // GET /api/Connection/my
  const useGetMyConnections = () => {
    return useQuery<Connection[]>({
      queryKey: ["connections", "my"],
      queryFn: async () => {
        const res = await api.get("/Connection/my");
        return res.data?.data ?? res.data ?? [];
      },
    });
  };

  // GET /api/Connection/pending
  const useGetPendingConnections = () => {
    return useQuery<Connection[]>({
      queryKey: ["connections", "pending"],
      queryFn: async () => {
        const res = await api.get("/Connection/pending");
        return res.data?.data ?? res.data ?? [];
      },
    });
  };

  // GET /api/Connection/all
  const useGetAllConnections = () => {
    return useQuery<Connection[]>({
      queryKey: ["connections", "all"],
      queryFn: async () => {
        const res = await api.get("/Connection/all");
        return res.data?.data ?? res.data ?? [];
      },
    });
  };

  // POST /api/Connection/send/{addresseeId}
  const useSendRequest = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (addresseeId) => {
        const res = await api.post(`/Connection/send/${addresseeId}`);
        return res.data?.data ?? res.data;
      },
      onMutate: async (addresseeId) => {
        await queryClient.cancelQueries({ queryKey: ["connections", "all"] });
        const previousConnections = queryClient.getQueryData<Connection[]>(["connections", "all"]);
        
        if (previousConnections) {
          const { user } = useAuthStore.getState();
          const myId = user?.userId ? Number(user.userId) : 0;
          
          queryClient.setQueryData<Connection[]>(["connections", "all"], [
            ...previousConnections,
            {
              id: Math.random(), // Temporary ID
              requesterId: myId,
              addresseeId: addresseeId,
              status: ConnectionStatus.Pending,
              createdAt: new Date().toISOString()
            }
          ]);
        }
        return { previousConnections };
      },
      onError: (err, variables, context) => {
        if (context?.previousConnections) {
          queryClient.setQueryData(["connections", "all"], context.previousConnections);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["connections"] });
      },
      meta: { toast: true, action: "sync" },
    });
  };

  // POST /api/Connection/send-by-email
  const useSendRequestByEmail = () => {
    return useMutation<void, Error, string>({
      mutationFn: async (email) => {
        const res = await api.post("/Connection/send-by-email", { email });
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["connections"] });
      },
      meta: { toast: true, action: "sync" },
    });
  };

  // PUT /api/Connection/{connectionId}/respond
  const useRespondRequest = () => {
    return useMutation<
      void,
      Error,
      { connectionId: number; status: ConnectionStatus }
    >({
      mutationFn: async ({ connectionId, status }) => {
        const res = await api.put(`/Connection/${connectionId}/respond`, {
          status,
        });
        return res.data;
      },
      onMutate: async ({ connectionId, status }) => {
        await queryClient.cancelQueries({ queryKey: ["connections", "all"] });
        const previousConnections = queryClient.getQueryData<Connection[]>(["connections", "all"]);
        
        if (previousConnections) {
          queryClient.setQueryData<Connection[]>(
            ["connections", "all"],
            previousConnections.map(c => 
              c.id === connectionId ? { ...c, status } : c
            )
          );
        }
        return { previousConnections };
      },
      onError: (err, variables, context) => {
        if (context?.previousConnections) {
          queryClient.setQueryData(["connections", "all"], context.previousConnections);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["connections"] });
      },
      meta: { toast: true, action: "sync" },
    });
  };

  // DELETE /api/Connection/{connectionId}
  const useDeleteConnection = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (connectionId) => {
        const res = await api.delete(`/Connection/${connectionId}`);
        return res.data;
      },
      onMutate: async (connectionId) => {
        await queryClient.cancelQueries({ queryKey: ["connections", "all"] });
        const previousConnections = queryClient.getQueryData<Connection[]>(["connections", "all"]);
        
        if (previousConnections) {
          queryClient.setQueryData<Connection[]>(
            ["connections", "all"],
            previousConnections.filter(c => c.id !== connectionId)
          );
        }
        return { previousConnections };
      },
      onError: (err, variables, context) => {
        if (context?.previousConnections) {
          queryClient.setQueryData(["connections", "all"], context.previousConnections);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["connections"] });
      },
      meta: { toast: true, action: "delete" },
    });
  };

  return {
    useGetMyConnections,
    useGetPendingConnections,
    useGetAllConnections,
    useSendRequest,
    useSendRequestByEmail,
    useRespondRequest,
    useDeleteConnection,
  };
};