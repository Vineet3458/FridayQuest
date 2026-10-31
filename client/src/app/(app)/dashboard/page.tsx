'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, RefreshCw, Zap } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { connectSocket } from '@/lib/socket';
import { useAuthStore } from '@/stores/useAuthStore';
import { Session } from '@/types';
import PlayerDashboardView from '@/components/dashboard/PlayerDashboardView';
import OrganizerDashboardView from '@/components/dashboard/OrganizerDashboardView';
import OrgAdminDashboardView from '@/components/dashboard/OrgAdminDashboardView';
import SuperAdminDashboardView from '@/components/dashboard/SuperAdminDashboardView';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [realtimeNotice, setRealtimeNotice] = useState<string | null>(null);
  const [vibeEnergy, setVibeEnergy] = useState(4);
  const [vibeStyle, setVibeStyle] = useState<'active' | 'calm' | 'brainy'>('active');
  const [vibeSubmitting, setVibeSubmitting] = useState(false);
  const [vibeSubmitted, setVibeSubmitted] = useState(false);
  const [vibeAttendeeCount, setVibeAttendeeCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await apiRequest<Session[]>('/sessions');
      if (response.success && Array.isArray(response.data)) {
        setSessions(response.data);
      } else {
        setSessions([]);
      }
    } catch (error) {
      setSessions([]);
      setLoadError(error instanceof Error ? error.message : 'Unable to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboardData();
  }, [loadDashboardData]);

  const nextSession = sessions[0];

  useEffect(() => {
    if (!nextSession?._id) {
      setVibeAttendeeCount(0);
      return;
    }

    let active = true;
    apiRequest(`/sessions/${nextSession._id}/vibe`)
      .then((response) => {
        if (active && response.success) {
          setVibeAttendeeCount(response.data?.totals?.attendingCount || 0);
        }
      })
      .catch(() => {
        if (active) setVibeAttendeeCount(0);
      });

    return () => {
      active = false;
    };
  }, [nextSession?._id]);

  useEffect(() => {
    const socket = connectSocket();
    const handleConnect = () => socket.emit('dashboard:join');
    const handleDashboardUpdate = () => void loadDashboardData();
    const handleLiveUpdate = (data?: { title?: string; summary?: { totals?: { attendingCount?: number } } }) => {
      const attendeeCount = data?.summary?.totals?.attendingCount;
      if (typeof attendeeCount === 'number') setVibeAttendeeCount(attendeeCount);
      setRealtimeNotice(data?.title ? `Session updated: ${data.title}` : 'Live session data updated');
      window.setTimeout(() => setRealtimeNotice(null), 4000);
      void loadDashboardData();
    };

    socket.on('connect', handleConnect);
    socket.on('dashboard:connected', handleConnect);
    socket.on('dashboard:update', handleDashboardUpdate);
    socket.on('session:created', handleLiveUpdate);
    socket.on('session:updated', handleLiveUpdate);
    socket.on('session:started', handleLiveUpdate);
    socket.on('vibe:updated', handleLiveUpdate);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('dashboard:connected', handleConnect);
      socket.off('dashboard:update', handleDashboardUpdate);
      socket.off('session:created', handleLiveUpdate);
      socket.off('session:updated', handleLiveUpdate);
      socket.off('session:started', handleLiveUpdate);
      socket.off('vibe:updated', handleLiveUpdate);
    };
  }, [loadDashboardData]);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setLoadError('Clipboard access is unavailable in this browser.');
    }
  };

  const handleQuickVibe = async () => {
    if (!nextSession?._id) {
      setLoadError('There is no upcoming session to submit a vibe check for.');
      return;
    }

    setVibeSubmitting(true);
    try {
      await apiRequest(`/sessions/${nextSession._id}/vibe`, {
        method: 'POST',
        body: JSON.stringify({
          attending: 'yes',
          energy: vibeEnergy,
          style: vibeStyle,
          skipGameIds: [],
        }),
      });
      setVibeSubmitted(true);
      setVibeAttendeeCount((count) => count + 1);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to submit your vibe check.');
    } finally {
      setVibeSubmitting(false);
    }
  };

  // Strictly route by authenticated user role
  const dashboardView = (() => {
    switch (user?.role) {
      case 'player':
        return (
          <PlayerDashboardView
            user={user}
            nextSession={nextSession}
            vibeAttendeeCount={vibeAttendeeCount}
            copiedCode={copiedCode}
            onCopyCode={handleCopyCode}
            vibeEnergy={vibeEnergy}
            setVibeEnergy={setVibeEnergy}
            vibeStyle={vibeStyle}
            setVibeStyle={setVibeStyle}
            vibeSubmitting={vibeSubmitting}
            vibeSubmitted={vibeSubmitted}
            onQuickVibe={handleQuickVibe}
          />
        );
      case 'organizer':
        return (
          <OrganizerDashboardView
            user={user}
            nextSession={nextSession}
            sessions={sessions}
          />
        );
      case 'orgAdmin':
        return (
          <OrgAdminDashboardView
            user={user}
          />
        );
      case 'superAdmin':
        return (
          <SuperAdminDashboardView
            user={user}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <div className="flex w-full flex-1 flex-col">
      {realtimeNotice && (
        <div role="status" className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg animate-in fade-in slide-in-from-top-2">
          <Zap className="h-4 w-4" />
          {realtimeNotice}
        </div>
      )}

      {loadError && (
        <div role="alert" className="m-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={() => void loadDashboardData()}
            className="inline-flex items-center gap-1.5 font-bold underline cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-[80vh] items-center justify-center" aria-live="polite">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" aria-label="Loading dashboard" />
        </div>
      ) : dashboardView ? (
        dashboardView
      ) : (
        <div role="alert" className="m-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          Your account role is not recognized. Contact your organization administrator.
        </div>
      )}
    </div>
  );
}
