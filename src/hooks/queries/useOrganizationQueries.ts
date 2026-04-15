'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/lib/api';
import {
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationMember,
  CreateOrganizationMemberDto,
  UpdateOrganizationMemberDto,
  OrganizationPagedResult,
} from '@/src/types/organization';

export const useOrganizationQueries = () => {
  const queryClient = useQueryClient();

  // GET /api/Organization/mine — current user's organizations
  const useMyOrganizations = () => {
    return useQuery<Organization[]>({
      queryKey: ['organizations', 'mine'],
      queryFn: async () => {
        const response = await api.get('/Organization/mine');
        return response.data.data ?? response.data ?? null;
      },
    });
  };

  // GET /api/Organization/:id
  const useOrganization = (id: number | null) => {
    return useQuery<Organization>({
      queryKey: ['organization', id],
      queryFn: async () => {
        const response = await api.get(`/Organization/${id}`);
        return response.data.data ?? response.data ?? null;
      },
      enabled: !!id,
    });
  };

  // GET /api/Organization/paged
  const useOrganizationsPaged = (name?: string, pageNumber = 1, pageSize = 10) => {
    return useQuery<OrganizationPagedResult>({
      queryKey: ['organizations', 'paged', name, pageNumber, pageSize],
      queryFn: async () => {
        const response = await api.get('/Organization/paged', {
          params: { Name: name, PageNumber: pageNumber, PageSize: pageSize },
        });
        return response.data.data ?? response.data ?? null;
      },
    });
  };

  // POST /api/Organization
  const useCreateOrganization = () => {
    return useMutation({
      mutationFn: async (data: CreateOrganizationDto) => {
        const response = await api.post('/Organization', data);
        return response.data.data ?? response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['organizations'] });
      },
    });
  };

  // PUT /api/Organization/:id
  const useUpdateOrganization = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: UpdateOrganizationDto }) => {
        const response = await api.put(`/Organization/${id}`, data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['organizations'] });
      },
    });
  };

  // DELETE /api/Organization/:id
  const useDeleteOrganization = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.delete(`/Organization/${id}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['organizations'] });
      },
    });
  };

  // --- OrganizationMember ---

  // GET /api/OrganizationMember/by-organization/:organizationId
  const useOrganizationMembers = (organizationId: number | null) => {
    return useQuery<OrganizationMember[]>({
      queryKey: ['orgMembers', organizationId],
      queryFn: async () => {
        const response = await api.get(`/OrganizationMember/by-organization/${organizationId}`);
        return response.data.data ?? response.data ?? null;
      },
      enabled: !!organizationId,
    });
  };

  // POST /api/OrganizationMember/invite
  const useInviteMember = () => {
    return useMutation({
      mutationFn: async (data: CreateOrganizationMemberDto) => {
        const response = await api.post('/OrganizationMember/invite', data);
        return response.data;
      },
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['orgMembers', variables.organizationId] });
      },
    });
  };

  // PUT /api/OrganizationMember/invitation/:invitationId/respond
  const useRespondInvitation = () => {
    return useMutation({
      mutationFn: async ({ invitationId, accept }: { invitationId: number; accept: boolean }) => {
        const response = await api.put(`/OrganizationMember/invitation/${invitationId}/respond`, {
          isAccepted: accept,
        });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orgMembers'] });
      },
    });
  };

  // PUT /api/OrganizationMember/:id
  const useUpdateMember = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: UpdateOrganizationMemberDto }) => {
        const response = await api.put(`/OrganizationMember/${id}`, data);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orgMembers'] });
      },
    });
  };

  // DELETE /api/OrganizationMember/:id
  const useRemoveMember = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.delete(`/OrganizationMember/${id}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orgMembers'] });
      },
    });
  };

  return {
    useMyOrganizations,
    useOrganization,
    useOrganizationsPaged,
    useCreateOrganization,
    useUpdateOrganization,
    useDeleteOrganization,
    useOrganizationMembers,
    useInviteMember,
    useRespondInvitation,
    useUpdateMember,
    useRemoveMember,
  };
};
