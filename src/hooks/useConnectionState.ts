'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useConnectionQueries } from '@/hooks/queries/useConnectionQueries';
import { ConnectionStatus } from '@/types/connection';

export type RelationshipState = 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'CONNECTED' | 'SELF';

export const useConnectionState = (targetUserId: number) => {
  const { user: authUser } = useAuthStore();
  const myUserId = authUser?.userId ? Number(authUser.userId) : null;
  
  const { useGetAllConnections } = useConnectionQueries();
  const { data: allConnections, isLoading, isError } = useGetAllConnections();

  const relationship = useMemo(() => {
    if (!myUserId || !targetUserId) return { state: 'NONE' as RelationshipState, connectionId: null };
    if (myUserId === targetUserId) return { state: 'SELF' as RelationshipState, connectionId: null };
    if (!allConnections) return { state: 'NONE' as RelationshipState, connectionId: null };

    // Find connection record involving both users
    const record = allConnections.find(c => 
      (c.requesterId === myUserId && c.addresseeId === targetUserId) ||
      (c.requesterId === targetUserId && c.addresseeId === myUserId)
    );

    if (!record || record.status === ConnectionStatus.Declined) {
      return { state: 'NONE' as RelationshipState, connectionId: null };
    }

    if (record.status === ConnectionStatus.Accepted) {
      return { state: 'CONNECTED' as RelationshipState, connectionId: record.id };
    }

    if (record.status === ConnectionStatus.Pending) {
      if (record.requesterId === myUserId) {
        return { state: 'PENDING_SENT' as RelationshipState, connectionId: record.id };
      } else {
        return { state: 'PENDING_RECEIVED' as RelationshipState, connectionId: record.id };
      }
    }

    return { state: 'NONE' as RelationshipState, connectionId: null };
  }, [allConnections, myUserId, targetUserId]);

  return {
    ...relationship,
    isLoading,
    isError,
    myUserId
  };
};
