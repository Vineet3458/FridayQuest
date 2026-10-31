'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { connectSocket } from '@/lib/socket';

export interface PendingUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  createdAt: string;
  status: string;
  orgId?: { _id: string; name: string };
}

export interface PendingGame {
  _id: string;
  name: string;
  level: number;
  status: string;
  definition?: {
    durationMin?: number;
    players?: { min: number; max: number };
    rulesShort?: string;
  };
  createdBy?: { _id: string; name: string; email: string; department?: string };
  orgId?: { _id: string; name: string };
  createdAt: string;
}

export interface ApprovalsData {
  pendingUsers: PendingUser[];
  pendingGames: PendingGame[];
  totalPending: number;
}

export function useApprovals() {
  const queryClient = useQueryClient();

  const query = useQuery<ApprovalsData>({
    queryKey: ['approvals'],
    queryFn: async () => {
      const res = await apiRequest<ApprovalsData>('/approvals');
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to fetch pending approvals');
      }
      return res.data;
    },
    staleTime: 1000 * 30,
  });

  const approveUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await apiRequest(`/approvals/users/${userId}/approve`, { method: 'POST' });
      if (!res.success) throw new Error(res.message || 'Failed to approve user');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  const rejectUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await apiRequest(`/approvals/users/${userId}/reject`, { method: 'POST' });
      if (!res.success) throw new Error(res.message || 'Failed to reject user');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  const approveGameMutation = useMutation({
    mutationFn: async (gameId: string) => {
      const res = await apiRequest(`/approvals/games/${gameId}/approve`, { method: 'POST' });
      if (!res.success) throw new Error(res.message || 'Failed to approve game');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  const rejectGameMutation = useMutation({
    mutationFn: async ({ gameId, reason }: { gameId: string; reason?: string }) => {
      const res = await apiRequest(`/approvals/games/${gameId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      if (!res.success) throw new Error(res.message || 'Failed to reject game');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  // Socket.IO Real-Time Listener
  useEffect(() => {
    const socket = connectSocket();

    const handleApprovalsUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    };

    socket.on('approvals:updated', handleApprovalsUpdate);
    socket.on('user:approved', handleApprovalsUpdate);
    socket.on('game:approved', handleApprovalsUpdate);

    return () => {
      socket.off('approvals:updated', handleApprovalsUpdate);
      socket.off('user:approved', handleApprovalsUpdate);
      socket.off('game:approved', handleApprovalsUpdate);
    };
  }, [queryClient]);

  return {
    ...query,
    approveUser: approveUserMutation.mutateAsync,
    isApprovingUser: approveUserMutation.isPending,
    rejectUser: rejectUserMutation.mutateAsync,
    isRejectingUser: rejectUserMutation.isPending,
    approveGame: approveGameMutation.mutateAsync,
    isApprovingGame: approveGameMutation.isPending,
    rejectGame: rejectGameMutation.mutateAsync,
    isRejectingGame: rejectGameMutation.isPending,
  };
}

