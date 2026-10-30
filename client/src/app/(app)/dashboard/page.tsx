'use client';

import React, { useState, useEffect } from 'react';
import {
  Zap,
  LayoutGrid,
  User,
  Sparkles,
  Building2,
  Shield,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { connectSocket } from '@/lib/socket';
import PlayerDashboardView from '@/components/dashboard/PlayerDashboardView';
import OrganizerDashboardView from '@/components/dashboard/OrganizerDashboardView';
import OrgAdminDashboardView from '@/components/dashboard/OrgAdminDashboardView';
import SuperAdminDashboardView from '@/components/dashboard/SuperAdminDashboardView';
import MobileExperienceShowcase from '@/components/dashboard/MobileExperienceShowcase';

type ViewMode = 'all' | 'player' | 'organizer' | 'orgAdmin' | 'superAdmin';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // View Mode: 'all' renders the 2x2 grid from Image 1 & Image 2!
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  // Real-Time Socket States
  const [isLiveSocketConnected, setIsLiveSocketConnected] = useState(false);
  const [realtimeNotice, setRealtimeNotice] = useState<string | null>(null);
  const [liveBuzzerLocked, setLiveBuzzerLocked] = useState(false);
  const [buzzerWinner, setBuzzerWinner] = useState('');
  const [liveScores, setLiveScores] = useState<Record<string, number>>({
    'Team Alpha': 80,
    'Team Bravo': 60,
    'Team Charlie': 40,
    'Team Delta': 20,
  });

  // Vibe state for Player view
  const [vibeEnergy, setVibeEnergy] = useState<number>(4);
  const [vibeStyle, setVibeStyle] = useState<'active' | 'calm' | 'brainy'>('active');
  const [vibeSubmitting, setVibeSubmitting] = useState(false);
  const [vibeSubmitted, setVibeSubmitted] = useState(false);
  const [vibeAttendeeCount, setVibeAttendeeCount] = useState<number>(85);
  const [copiedCode, setCopiedCode] = useState(false);

  // Fetch session data & real-time vibes
  const loadDashboardData = () => {
    apiRequest('/sessions')
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setSessions(res.data);
          const activeSess = res.data[0];
          if (activeSess?._id) {
            apiRequest(`/sessions/${activeSess._id}/vibe`)
              .then((vibeRes) => {
                if (vibeRes.success && vibeRes.data?.totals?.attendingCount) {
                  setVibeAttendeeCount(vibeRes.data.totals.attendingCount);
                }
              })
              .catch(() => {});
          }
        } else {
          setSessions([
            {
              _id: 'default-session-1',
              title: 'Fun Friday Kickoff',
              date: '2026-10-30',
              startTime: '16:00',
              durationMin: 90,
              location: 'Cafeteria, Noida',
              joinCode: 'KIRXA-DEMO',
              status: 'live',
              attendeesCount: 85,
              maxCapacity: 120,
            },
          ]);
        }
      })
      .catch(() => {
        setSessions([
          {
            _id: 'default-session-1',
            title: 'Fun Friday Kickoff',
            date: '2026-10-30',
            startTime: '16:00',
            durationMin: 90,
            location: 'Cafeteria, Noida',
            joinCode: 'KIRXA-DEMO',
            status: 'live',
            attendeesCount: 85,
            maxCapacity: 120,
          },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Connect to Real-Time Socket.IO
  useEffect(() => {
    const socket = connectSocket();
    socket.emit('dashboard:join');

    const handleConnect = () => {
      setIsLiveSocketConnected(true);
      socket.emit('dashboard:join');
    };

    const handleDisconnect = () => {
      setIsLiveSocketConnected(false);
    };

    const handleDashboardUpdate = () => {
      loadDashboardData();
    };

    const handleVibeUpdate = (data: any) => {
      if (data?.summary?.totals?.attendingCount) {
        setVibeAttendeeCount(data.summary.totals.attendingCount);
      }
      setRealtimeNotice(`⚡ Live Vibe Check received! (${data?.summary?.totals?.attendingCount || 86} confirmed)`);
      setTimeout(() => setRealtimeNotice(null), 4000);
      loadDashboardData();
    };

    const handleSessionUpdate = (data: any) => {
      setRealtimeNotice(`⚡ Real-time sync: Session "${data?.title || 'Fun Friday'}" updated!`);
      setTimeout(() => setRealtimeNotice(null), 4000);
      loadDashboardData();
    };

    const handleBuzzerLocked = (data: any) => {
      setLiveBuzzerLocked(true);
      setBuzzerWinner(data?.winnerName || data?.userName || 'A Player');
      setRealtimeNotice(`🚨 Real-time: BUZZER LOCKED by ${data?.winnerName || data?.userName || 'Player'}!`);
      setTimeout(() => setRealtimeNotice(null), 4000);
    };

    const handleBuzzerReset = () => {
      setLiveBuzzerLocked(false);
      setBuzzerWinner('');
      setRealtimeNotice(`🔔 Real-time: Buzzer unlocked! Ready for next round.`);
      setTimeout(() => setRealtimeNotice(null), 3000);
    };

    const handleScoreUpdate = (data: any) => {
      if (data?.scores) {
        setLiveScores(data.scores);
      }
      setRealtimeNotice(`🏆 Real-time: Leaderboard scores updated!`);
      setTimeout(() => setRealtimeNotice(null), 4000);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('dashboard:connected', handleConnect);
    socket.on('dashboard:update', handleDashboardUpdate);
    socket.on('vibe:updated', handleVibeUpdate);
    socket.on('session:created', handleSessionUpdate);
    socket.on('session:updated', handleSessionUpdate);
    socket.on('session:started', handleSessionUpdate);
    socket.on('buzzer:locked', handleBuzzerLocked);
    socket.on('buzzer:reset', handleBuzzerReset);
    socket.on('score:update', handleScoreUpdate);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('dashboard:connected', handleConnect);
      socket.off('dashboard:update', handleDashboardUpdate);
      socket.off('vibe:updated', handleVibeUpdate);
      socket.off('session:created', handleSessionUpdate);
      socket.off('session:updated', handleSessionUpdate);
      socket.off('session:started', handleSessionUpdate);
      socket.off('buzzer:locked', handleBuzzerLocked);
      socket.off('buzzer:reset', handleBuzzerReset);
      socket.off('score:update', handleScoreUpdate);
    };
  }, []);

  const nextSession = sessions[0] || {
    _id: 'default-session-1',
    title: 'Fun Friday Kickoff',
    date: '2026-10-30',
    startTime: '16:00',
    durationMin: 90,
    location: 'Cafeteria, Noida',
    joinCode: 'KIRXA-DEMO',
    attendeesCount: 85,
    maxCapacity: 120,
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleQuickVibe = async () => {
    setVibeSubmitting(true);
    try {
      if (nextSession?._id) {
        await apiRequest(`/sessions/${nextSession._id}/vibe`, {
          method: 'POST',
          body: JSON.stringify({
            attending: 'yes',
            energy: vibeEnergy,
            style: vibeStyle,
            skipGameIds: [],
          }),
        });
        setVibeAttendeeCount((prev) => prev + 1);
      }
    } catch {
    } finally {
      setVibeSubmitted(true);
      setVibeSubmitting(false);
    }
  };

  const handleLiveBuzz = () => {
    const socket = connectSocket();
    if (!liveBuzzerLocked && nextSession?._id) {
      socket.emit('player:action', {
        sessionId: nextSession._id,
        type: 'buzz',
      });
      setLiveBuzzerLocked(true);
      setBuzzerWinner(user?.name || 'Kirxa');
    }
  };

  const handleResetBuzzer = () => {
    const socket = connectSocket();
    if (nextSession?._id) {
      socket.emit('host:reset_buzzer', {
        sessionId: nextSession._id,
      });
      setLiveBuzzerLocked(false);
      setBuzzerWinner('');
    }
  };

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-5 space-y-4">
      {/* Real-Time Live Status Bar & View Mode Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 bg-slate-100/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLiveSocketConnected ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isLiveSocketConnected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            ></span>
          </span>
          <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
            {isLiveSocketConnected ? 'Real-Time Sync Active' : 'Connecting to Live Socket...'}
          </span>
          <span className="hidden xl:inline text-[11px] text-slate-500 dark:text-slate-400">
            • Auto-sync enabled across organizers, screens & player phones
          </span>

          {realtimeNotice && (
            <div className="animate-in fade-in duration-200 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px] shadow-xs flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              <span>{realtimeNotice}</span>
            </div>
          )}
        </div>

        {/* View Mode Pills (2x2 Matrix Overview or Single Focused View) */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              viewMode === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All 4 Dashboards (2x2 Matrix)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('player')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              viewMode === 'player'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Player</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('organizer')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              viewMode === 'organizer'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Organizer</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('orgAdmin')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              viewMode === 'orgAdmin'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>3. Org Admin</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('superAdmin')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              viewMode === 'superAdmin'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>4. Super Admin</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2x2 MATRIX LAYOUT (Matches Image 1 and Image 2 Exactly)                  */}
      {/* ========================================================================= */}
      {viewMode === 'all' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {/* Quadrant 1: Player Dashboard */}
          <div className="space-y-2">
            {/* Header Banner (Matches Image 2) */}
            <div className="flex flex-wrap items-center gap-2 px-1">
              <span className="px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-black tracking-wide shadow-xs">
                1. Player Dashboard
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                Employee / Participant
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Fun, engaging and gamified experience
              </span>
            </div>
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
              isCompact={true}
            />
          </div>

          {/* Quadrant 2: Organizer Dashboard */}
          <div className="space-y-2">
            {/* Header Banner (Matches Image 2) */}
            <div className="flex flex-wrap items-center gap-2 px-1">
              <span className="px-3 py-1 rounded-xl bg-purple-600 text-white text-xs font-black tracking-wide shadow-xs">
                2. Organizer Dashboard
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[11px] font-bold">
                Session Organizer
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Plan, organize and run amazing sessions
              </span>
            </div>
            <OrganizerDashboardView user={user} nextSession={nextSession} isCompact={true} />
          </div>

          {/* Quadrant 3: Org Admin Dashboard */}
          <div className="space-y-2">
            {/* Header Banner (Matches Image 2) */}
            <div className="flex flex-wrap items-center gap-2 px-1">
              <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-black tracking-wide shadow-xs">
                3. Org Admin Dashboard
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                HR / Company Administrator
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Manage employees, engagement and fun Fridays
              </span>
            </div>
            <OrgAdminDashboardView user={user} isCompact={true} />
          </div>

          {/* Quadrant 4: Super Admin Dashboard */}
          <div className="space-y-2">
            {/* Header Banner (Matches Image 2) */}
            <div className="flex flex-wrap items-center gap-2 px-1">
              <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-black tracking-wide shadow-xs">
                4. Super Admin Dashboard
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold">
                Platform Owner (Kirxa)
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Platform-wide management and analytics
              </span>
            </div>
            <SuperAdminDashboardView user={user} isCompact={true} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SINGLE FOCUSED ROLE VIEWS (Full desktop width)                            */}
      {/* ========================================================================= */}
      {viewMode === 'player' && (
        <div className="space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 px-1">
            <span className="px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-black">
              1. Player Dashboard
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
              Employee / Participant
            </span>
          </div>
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
            isCompact={false}
          />
        </div>
      )}

      {viewMode === 'organizer' && (
        <div className="space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 px-1">
            <span className="px-3 py-1 rounded-xl bg-purple-600 text-white text-xs font-black">
              2. Organizer Dashboard
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[11px] font-bold">
              Session Organizer
            </span>
          </div>
          <OrganizerDashboardView user={user} nextSession={nextSession} isCompact={false} />
        </div>
      )}

      {viewMode === 'orgAdmin' && (
        <div className="space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 px-1">
            <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-black">
              3. Org Admin Dashboard
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
              HR / Company Administrator
            </span>
          </div>
          <OrgAdminDashboardView user={user} isCompact={false} />
        </div>
      )}

      {viewMode === 'superAdmin' && (
        <div className="space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 px-1">
            <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-black">
              4. Super Admin Dashboard
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold">
              Platform Owner (Kirxa)
            </span>
          </div>
          <SuperAdminDashboardView user={user} isCompact={false} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MOBILE EXPERIENCE & LIVE GAME SHOWCASE (Matches Bottom of Image 1)     */}
      {/* ========================================================================= */}
      <MobileExperienceShowcase
        nextSession={nextSession}
        liveBuzzerLocked={liveBuzzerLocked}
        buzzerWinner={buzzerWinner}
        liveScores={liveScores}
        onLiveBuzz={handleLiveBuzz}
        onResetBuzzer={handleResetBuzzer}
      />
    </div>
  );
}
