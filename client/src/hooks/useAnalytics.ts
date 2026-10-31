'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { connectSocket } from '@/lib/socket';

export interface AnalyticsKPIs {
  totalEmployees?: number;
  activeParticipantsPct?: number;
  sessionsThisQuarter?: number;
  avgSatisfaction?: number;
  organizations?: number;
  totalSessions?: number;
  totalGames?: number;
  platformRating?: number;
  totalUsers?: number;
}

export interface ParticipationTrendItem {
  month: string;
  year: number;
  sessions: number;
  participants: number;
}

export interface DepartmentParticipationItem {
  name: string;
  count: number;
  pct: number;
  color: string;
}

export interface SystemHealthItem {
  name: string;
  status: string;
  latency?: string;
  uptime?: string;
  connected?: boolean;
  poolSize?: number;
  connections?: number;
  usage?: string;
}

export interface AnalyticsData {
  kpis: AnalyticsKPIs;
  participationTrend?: ParticipationTrendItem[];
  departmentParticipation?: DepartmentParticipationItem[];
  topPerformingDepartments?: { name: string; pct: number }[];
  upcomingSessions?: {
    id: string;
    title: string;
    date: string;
    joining: string;
    status: string;
  }[];
  recentActivities?: {
    icon: string;
    user: string;
    action: string;
    time: string;
  }[];
  userGrowth?: { month: string; users: number }[];
  organizationDistribution?: { name: string; count: number; pct: number; color: string }[];
  recentOrganizations?: { name: string; users: string; status: string; plan: string }[];
  platformActivity?: { org: string; action: string; user: string; time: string }[];
  systemHealth?: SystemHealthItem[];
}

interface UseAnalyticsOptions {
  timeRange?: string;
  department?: string;
  scope?: 'org' | 'platform';
}

export function useAnalytics({ timeRange = 'Last 30 Days', department = 'all', scope = 'org' }: UseAnalyticsOptions = {}) {
  const queryClient = useQueryClient();

  const queryKey = ['analytics', scope, timeRange, department];

  const query = useQuery<AnalyticsData>({
    queryKey,
    queryFn: async () => {
      const endpoint =
        scope === 'platform'
          ? `/analytics/platform?timeRange=${encodeURIComponent(timeRange)}`
          : `/analytics/overview?timeRange=${encodeURIComponent(timeRange)}&department=${encodeURIComponent(department)}`;
      const res = await apiRequest<AnalyticsData>(endpoint);
      if (!res.success || !res.data) {
        throw new Error(res.message || 'Failed to fetch analytics');
      }
      return res.data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });

  // Socket.IO Real-Time Listener
  useEffect(() => {
    const socket = connectSocket();
    socket.emit('dashboard:join');

    const handleRealtimeUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    };

    socket.on('analytics:update', handleRealtimeUpdate);
    socket.on('dashboard:update', handleRealtimeUpdate);
    socket.on('session:created', handleRealtimeUpdate);
    socket.on('session:updated', handleRealtimeUpdate);
    socket.on('session:started', handleRealtimeUpdate);
    socket.on('session:ended', handleRealtimeUpdate);
    socket.on('vibe:updated', handleRealtimeUpdate);
    socket.on('rating:submitted', handleRealtimeUpdate);
    socket.on('user:approved', handleRealtimeUpdate);
    socket.on('game:approved', handleRealtimeUpdate);
    socket.on('approvals:updated', handleRealtimeUpdate);

    return () => {
      socket.off('analytics:update', handleRealtimeUpdate);
      socket.off('dashboard:update', handleRealtimeUpdate);
      socket.off('session:created', handleRealtimeUpdate);
      socket.off('session:updated', handleRealtimeUpdate);
      socket.off('session:started', handleRealtimeUpdate);
      socket.off('session:ended', handleRealtimeUpdate);
      socket.off('vibe:updated', handleRealtimeUpdate);
      socket.off('rating:submitted', handleRealtimeUpdate);
      socket.off('user:approved', handleRealtimeUpdate);
      socket.off('game:approved', handleRealtimeUpdate);
      socket.off('approvals:updated', handleRealtimeUpdate);
    };
  }, [queryClient]);

  return query;
}

