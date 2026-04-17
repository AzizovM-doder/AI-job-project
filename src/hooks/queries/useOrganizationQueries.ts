'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { 
  Organization, 
  OrganizationPagedResult, 
  CreateOrganizationDto, 
  UpdateOrganizationDto, 
  OrganizationMember,
  MemberDirectoryEntryDto,
  CreateOrganizationMemberDto,
  UpdateOrganizationMemberDto,
  OrganizationMemberInviteRespondDto
} from '@/types/organization';

export const useOrganizationQueries = () => {
  const queryClient = useQueryClient();

  // --- ORGANIZATION MANAGEMENT ---

  const useGetOrganizationsPaged = (params?: { 
    Name?: string; 
    PageNumber?: number; 
    PageSize?: number; 
  }) => {
    return useQuery<OrganizationPagedResult>({
      queryKey: ['organizations', 'paged', params],
      queryFn: async () => {
        const res = await api.get('/Organization/paged', { params });
        return res.data?.data ?? res.data;
      },
    });
  };

  const useGetOrganization = (id: number) => {
    return useQuery<Organization>({
      queryKey: ['organizations', id],
      queryFn: async () => {
        const res = await api.get(`/Organization/${id}`);
        return res.data?.data ?? res.data;
      },
      enabled: !!id,
    });
  };

  const useGetMyOrganizations = () => {
    return useQuery<Organization[]>({
      queryKey: ['organizations', 'mine'],
      queryFn: async () => {
        const res = await api.get('/Organization/mine');
        return res.data?.data ?? res.data ?? [];
      },
    });
  };

  const useCreateOrganization = () => {
    return useMutation<Organization, Error, CreateOrganizationDto>({
      mutationFn: async (data) => {
        const res = await api.post('/Organization', data);
        return res.data?.data ?? res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['organizations'] });
      },
    });
  };

  const useUpdateOrganization = () => {
    return useMutation<Organization, Error, UpdateOrganizationDto>({
      mutationFn: async (data) => {
        const res = await api.put(`/Organization/${data.id}`, data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['organizations', data.id] });
        queryClient.invalidateQueries({ queryKey: ['organizations'] });
      },
    });
  };

  const useDeleteOrganization = () => {
    return useMutation<void, Error, number>({
      mutationFn: async (id) => {
        const res = await api.delete(`/Organization/${id}`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['organizations'] });
      },
    });
  };

  // --- MEMBERSHIP ---

  const useGetMembersByOrganization = (organizationId: number) => {
    return useQuery<OrganizationMember[]>({
      queryKey: ['organizations', organizationId, 'members'],
      queryFn: async () => {
        const res = await api.get(`/OrganizationMember/by-organization/${organizationId}`);
        return res.data?.data ?? res.data ?? [];
      },
      enabled: !!organizationId,
    });
  };

  const useGetOrganizationDirectory = (organizationId: number) => {
    return useQuery<MemberDirectoryEntryDto[]>({
      queryKey: ['organizations', organizationId, 'directory'],
      queryFn: async () => {
        const res = await api.get(`/OrganizationMember/directory/${organizationId}`);
        return res.data?.data ?? res.data ?? [];
      },
      enabled: !!organizationId,
    });
  };

  const useInviteMember = () => {
    return useMutation<OrganizationMember, Error, CreateOrganizationMemberDto>({
      mutationFn: async (data) => {
        const res = await api.post('/OrganizationMember/invite', data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['organizations', variables.organizationId, 'members'] });
      },
    });
  };

  const useRespondInvitation = (invitationId: number) => {
    return useMutation<void, Error, OrganizationMemberInviteRespondDto>({
      mutationFn: async (data) => {
        const res = await api.put(`/OrganizationMember/invitation/${invitationId}/respond`, data);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['organizations'] });
      },
    });
  };

  const useUpdateMemberRole = () => {
    return useMutation<OrganizationMember, Error, UpdateOrganizationMemberDto>({
      mutationFn: async (data) => {
        const res = await api.put(`/OrganizationMember/${data.id}`, data);
        return res.data?.data ?? res.data;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['organizations', variables.organizationId, 'members'] });
      },
    });
  };

  const useRemoveMember = (id: number, organizationId: number) => {
    return useMutation<void, Error, void>({
      mutationFn: async () => {
        const res = await api.delete(`/OrganizationMember/${id}`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['organizations', organizationId, 'members'] });
      },
    });
  };

  return {
    useGetOrganizationsPaged,
    useGetOrganization,
    useGetMyOrganizations,
    useCreateOrganization,
    useUpdateOrganization,
    useDeleteOrganization,
    useGetMembersByOrganization,
    useGetOrganizationDirectory,
    useInviteMember,
    useRespondInvitation,
    useUpdateMemberRole,
    useRemoveMember,
  };
};
