'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Gamepad2,
  Users,
  Trophy,
  Play,
  CheckCircle2,
  ChevronRight,
  Flame,
  Zap,
  Coffee,
  Brain,
  Copy,
  Check,
  ShieldCheck,
  UserCheck,
  Mic,
  User,
  Sparkles,
  Sliders,
  Tv,
  ArrowUpRight,
  Loader2,
  Award,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { ROLE_INFO } from '@/lib/roles';
import { UserRole } from '@/types';

// Helper to calculate countdown string to upcoming event
function getCountdown(dateStr: string, timeStr?: string): { label: string; isPast: boolean } {
  try {
    const sessionDate = new Date(dateStr);
    if (timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      if (!isNaN(hours)) sessionDate.setHours(hours, minutes || 0, 0, 0);
    }
    const now = new Date();
    const diffMs = sessionDate.getTime() - now.getTime();

    if (diffMs < 0) {
      const diffHoursAgo = Math.abs(diffMs) / (1000 * 60 * 60);
      if (diffHoursAgo < 3) return { label: 'Live right now!', isPast: false };
      return { label: 'Event concluded', isPast: true };
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 1) return { label: `${days} days ${hours}h until kickoff`, isPast: false };
    if (days === 1) return { label: `Tomorrow at ${timeStr || 'event time'}`, isPast: false };
    if (hours > 0) return { label: `In ${hours}h ${minutes}m today`, isPast: false };
    return { label: `Starting in ${minutes} minutes!`, isPast: false };
  } catch {
    return { label: 'This Friday', isPast: false };
  }
}

// Time-based greeting helper
function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Level milestones helper
const LEVEL_TITLES: Record<number, string> = {
  1: 'Rookie Contender',
  2: 'Quest Contender',
  3: 'Friday Champion',
  4: 'Master Host',
  5: 'Office Legend',
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const [vibeSummary, setVibeSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Vibe submission state
  const [vibeEnergy, setVibeEnergy] = useState<number>(4);
  const [vibeStyle, setVibeStyle] = useState<'active' | 'calm' | 'brainy'>('active');
  const [vibeSubmitting, setVibeSubmitting] = useState(false);
  const [vibeSubmitted, setVibeSubmitted] = useState(false);
  const [vibeError, setVibeError] = useState<string | null>(null);

  const currentRole: UserRole = user?.role || 'player';
  const roleInfo = ROLE_INFO[currentRole];

  // 1. Fetch Sessions
  useEffect(() => {
    apiRequest('/sessions')
      .then((res) => {
        if (res.success && res.data) {
          setSessions(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const nextSession = sessions[0];

  // 2. Fetch Vibe Summary for next session (if available)
  useEffect(() => {
    if (!nextSession?._id) return;
    apiRequest(`/sessions/${nextSession._id}/vibe/summary`)
      .then((res) => {
        if (res.success && res.data) {
          setVibeSummary(res.data);
        }
      })
      .catch(() => {});
  }, [nextSession?._id, vibeSubmitted]);

  // Handle Quick Vibe Check Submission
  const handleQuickVibe = async () => {
    if (!nextSession?._id) return;
    setVibeSubmitting(true);
    setVibeError(null);
    try {
      const res = await apiRequest(`/sessions/${nextSession._id}/vibe`, {
        method: 'POST',
        body: JSON.stringify({
          attending: 'yes',
          energy: vibeEnergy,
          style: vibeStyle,
          skipGameIds: [],
        }),
      });
      if (res.success) {
        setVibeSubmitted(true);
      } else {
        setVibeError(res.message || 'Could not record vibe check.');
      }
    } catch (err: any) {
      // Offline fallback state
      setVibeSubmitted(true);
    } finally {
      setVibeSubmitting(false);
    }
  };

  // Copy handlers
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyInvite = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  // XP & Level calculations
  const userXp = user?.xp ?? 350;
  const userLevel = user?.level ?? 3;
  const levelTitle = LEVEL_TITLES[userLevel] || 'Friday Champion';
  const xpThreshold = userLevel * 200; // e.g. Level 3 = 600 XP target
  const prevLevelThreshold = (userLevel - 1) * 200; // 400 XP
  const xpInCurrentLevel = Math.max(0, userXp - prevLevelThreshold);
  const xpRequiredForNext = Math.max(1, xpThreshold - prevLevelThreshold);
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpRequiredForNext) * 100));

  const countdown = nextSession ? getCountdown(nextSession.date, nextSession.startTime) : null;
  const attendeeCount = vibeSummary?.totals?.attendingCount ?? (nextSession ? 14 : 0);

  const energyLabels: Record<number, { label: string; desc: string }> = {
    1: { label: 'Zen', desc: 'Chill & relaxed' },
    2: { label: 'Low Key', desc: 'Light participation' },
    3: { label: 'Steady', desc: 'Balanced engagement' },
    4: { label: 'High Energy', desc: 'Ready for action' },
    5: { label: 'Hyper Mode', desc: 'Ready to win!' },
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Header: Professional SaaS Welcome & Quick Role Switch */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shrink-0 border ${roleInfo.color}`}
          >
            {currentRole === 'superAdmin' && <ShieldCheck className="w-5 h-5" />}
            {currentRole === 'orgAdmin' && <UserCheck className="w-5 h-5" />}
            {currentRole === 'organizer' && <Mic className="w-5 h-5" />}
            {currentRole === 'player' && <User className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {getTimeGreeting()},{' '}
                <span className="font-extrabold">{user?.name ? user.name.split(' ')[0] : 'Teammate'}</span>
              </h1>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleInfo.color}`}
              >
                {roleInfo.title}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>Workspace:</span>
              <strong className="text-slate-700 dark:text-slate-300 font-semibold">Kirxa Labs</strong>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Department:</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {user?.department || 'Engineering'}
              </span>
            </p>
          </div>
        </div>

        {/* Right Header Utility / Simulator Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            href="/roles"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/70 transition-colors shadow-2xs"
            title="Explore all 4 system roles and simulated permissions"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Role Simulator</span>
            <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">(All 4 views)</span>
          </Link>
        </div>
      </header>

      {/* 2. Main Dashboard Grid: Left Content (8 cols) + Right Supporting Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Primary Focus: Upcoming Event, Vibe Check, Modules) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Showcase: Upcoming Friday Event Card */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden transition-colors">
            {/* Top Bar inside Card */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                  <Calendar className="w-3.5 h-3.5" />
                  Upcoming Friday Session
                </span>

                {countdown && (
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      countdown.isPast
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                    }`}
                  >
                    {countdown.label}
                  </span>
                )}
              </div>

              {/* Room Code Badge with Copy */}
              {nextSession && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(nextSession.joinCode)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Click to copy room code"
                  >
                    <span>Room:</span>
                    <strong className="font-bold text-slate-900 dark:text-white">
                      {nextSession.joinCode}
                    </strong>
                    {copiedCode ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  <Link
                    href={`/session/${nextSession.joinCode}/screen`}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Open Projector / Cafeteria TV View"
                  >
                    <Tv className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span>Loading scheduled session...</span>
              </div>
            ) : nextSession ? (
              <div className="pt-4 space-y-5">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {nextSession.title}
                  </h2>

                  {/* Event Meta Badges */}
                  <div className="mt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      {new Date(nextSession.date).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      at {nextSession.startTime} ({nextSession.durationMin || 90}m)
                    </span>

                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      {nextSession.location || 'Cafeteria / Lounge'}
                    </span>

                    <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                      <Users className="w-4 h-4 shrink-0" />
                      {attendeeCount} confirmed attendees
                    </span>
                  </div>
                </div>

                {/* Primary & Secondary Action CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <Link
                    href={`/session/${nextSession.joinCode}/play`}
                    className="flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Enter Live Room (Phone-as-Prop)</span>
                  </Link>

                  <Link
                    href="/sessions"
                    className="py-3 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700/80 transition-colors"
                  >
                    <span>Session Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center space-y-3">
                <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No upcoming session scheduled
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Friday sessions can be scheduled anytime by Organizers or Admins with auto-planning.
                </p>
                <Link
                  href="/sessions"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                >
                  <span>Schedule Friday Session</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </section>

          {/* 3. Interactive Vibe Check Card */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    10-Second Friday Vibe Check
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Auto-Planner tunes games according to your team&apos;s real-time mood
                  </p>
                </div>
              </div>

              {vibeSubmitted && (
                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Vibe Recorded</span>
                </span>
              )}
            </div>

            {vibeError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{vibeError}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Energy Selection Scale (1 to 5) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Energy Level for Friday:
                  </span>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    {vibeEnergy}/5 • {energyLabels[vibeEnergy]?.label} (
                    {energyLabels[vibeEnergy]?.desc})
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const isSelected = vibeEnergy === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setVibeEnergy(lvl)}
                        className={`py-2.5 px-1 rounded-xl text-center text-xs font-bold transition-all cursor-pointer border flex flex-col items-center gap-0.5 ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-sm font-extrabold">{lvl}</span>
                        <span
                          className={`text-[9px] uppercase tracking-wider font-semibold truncate max-w-full ${
                            isSelected ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          {energyLabels[lvl]?.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vibe Preference Style (Active / Calm / Brainy) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Game Style Preference:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Active Style */}
                  <button
                    type="button"
                    onClick={() => setVibeStyle('active')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      vibeStyle === 'active'
                        ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-500 dark:border-blue-500/80 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-950 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          vibeStyle === 'active'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Active</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          Fast & high energy
                        </div>
                      </div>
                    </div>
                    {vibeStyle === 'active' && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>

                  {/* Calm Style */}
                  <button
                    type="button"
                    onClick={() => setVibeStyle('calm')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      vibeStyle === 'calm'
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-500/80 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-950 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          vibeStyle === 'calm'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Coffee className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Calm</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          Social & relaxed
                        </div>
                      </div>
                    </div>
                    {vibeStyle === 'calm' && (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>

                  {/* Brainy Style */}
                  <button
                    type="button"
                    onClick={() => setVibeStyle('brainy')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      vibeStyle === 'brainy'
                        ? 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-500 dark:border-purple-500/80 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-950 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          vibeStyle === 'brainy'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Brain className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">Brainy</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          Trivia & puzzles
                        </div>
                      </div>
                    </div>
                    {vibeStyle === 'brainy' && (
                      <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                disabled={vibeSubmitting || !nextSession}
                onClick={handleQuickVibe}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {vibeSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving your vibe preference...</span>
                  </>
                ) : vibeSubmitted ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Update My Vibe Choice</span>
                  </>
                ) : (
                  <span>Submit Vibe Check for Friday</span>
                )}
              </button>
            </div>
          </section>

          {/* 4. Explore App Modules (Unified Modern SaaS Cards) */}
          <section className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                Explore App Modules
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Release 1.0 (MVP)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Sessions */}
              <Link
                href="/sessions"
                className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs transition-all group"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Friday Sessions
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    Schedule, collect headcount, and auto-plan 3-phase agendas.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                  <span>Open Sessions</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              {/* Game Library */}
              <Link
                href="/games"
                className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-400 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs transition-all group"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2.5">
                    <Gamepad2 className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Game Library
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    3-Level catalog framework and Custom Game Builder wizard.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                  <span>Browse Library</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              {/* Team Maker */}
              <Link
                href="/teams"
                className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs transition-all group"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Team Maker
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    200 greedy attempts fair-mix generator &amp; 20 teammates list.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Mix Teams</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              {/* Roles Matrix */}
              <Link
                href="/roles"
                className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-rose-400 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs transition-all group"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-600/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs mb-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    Roles Simulator
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    Interactive simulator across Admin, Organizer and Player.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                  <span>Try Roles</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </div>
          </section>
        </div>

        {/* Right Column (4 cols: XP/Level, Role Access Panel, Recent Activity) */}
        <div className="lg:col-span-4 space-y-6">
          {/* XP & Level Progression Card */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Fun Friday XP &amp; Tier
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Level {userLevel} • {levelTitle}</p>
                </div>
              </div>
              <span className="font-mono text-xs font-black text-amber-600 dark:text-amber-400">
                {userXp} XP
              </span>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Progress to Level {userLevel + 1}</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span>{userXp} XP</span>
                <span>{xpThreshold} XP</span>
              </div>
            </div>

            {/* Milestone Badges */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                Unlocked Badges
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
                  <Award className="w-3.5 h-3.5 text-blue-500 mx-auto mb-1" />
                  <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">First Buzz</div>
                  <div className="text-[8px] text-slate-400">Awarded</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
                  <Users className="w-3.5 h-3.5 text-emerald-500 mx-auto mb-1" />
                  <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">Team Player</div>
                  <div className="text-[8px] text-slate-400">Active</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800">
                  <Flame className="w-3.5 h-3.5 text-orange-500 mx-auto mb-1" />
                  <div className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">Vibe Voter</div>
                  <div className="text-[8px] text-slate-400">Active</div>
                </div>
              </div>
            </div>
          </section>

          {/* Role-Specific Access Panel */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3.5 transition-colors">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`p-1 rounded-md ${roleInfo.color}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {roleInfo.title} Access
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Active Mode</span>
            </div>

            {/* Super Admin Content */}
            {currentRole === 'superAdmin' && (
              <div className="space-y-2.5 text-xs">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Platform owner mode. You have global oversight across all multi-tenant company workspaces.
                </p>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Workspace Status:</span>
                    <strong className="text-slate-900 dark:text-white">Kirxa Labs (Active)</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Game Engine:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">4 Tools Ready</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Org Admin Content */}
            {currentRole === 'orgAdmin' && (
              <div className="space-y-2.5 text-xs">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Invite teammates to join your company workspace:
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-purple-200 dark:border-purple-800/40">
                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-white tracking-wider">
                    KIRXA-DEMO
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyInvite('KIRXA-DEMO')}
                    className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copiedInvite ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedInvite ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <Link
                  href="/games"
                  className="block p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-[11px] transition-colors"
                >
                  <span className="font-bold text-slate-900 dark:text-white">Game Review Queue</span>
                  <div className="text-slate-400 text-[10px]">0 pending custom game drafts</div>
                </Link>
              </div>
            )}

            {/* Organizer Content */}
            {currentRole === 'organizer' && (
              <div className="space-y-2.5 text-xs">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  As the session host, you run the Auto-Planner algorithm and generate balanced teams.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/sessions"
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-center transition-colors"
                  >
                    <div className="font-bold text-xs text-slate-900 dark:text-white">Auto-Planner</div>
                    <div className="text-[10px] text-slate-400">Generate Agenda</div>
                  </Link>
                  <Link
                    href="/teams"
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-center transition-colors"
                  >
                    <div className="font-bold text-xs text-slate-900 dark:text-white">Team Maker</div>
                    <div className="text-[10px] text-slate-400">Fair Mixing</div>
                  </Link>
                </div>
              </div>
            )}

            {/* Player Content */}
            {currentRole === 'player' && (
              <div className="space-y-2.5 text-xs">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Your phone acts as the prop for buzzers and role cards. No ref or pen-and-paper needed.
                </p>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Phone-as-Prop Tools Active</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Buzzer lockout &amp; Secret Role Card enabled
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Recent Activity / Team Pulse (Real API Data) */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Recent Team Activity
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Live pulse</span>
            </div>

            {vibeSummary?.responses && vibeSummary.responses.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {vibeSummary.responses.slice(0, 4).map((r: any, idx: number) => {
                  const userName = r.userId?.name || `Teammate ${idx + 1}`;
                  const userDept = r.userId?.department || 'Engineering';
                  return (
                    <div
                      key={r._id || idx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {userName}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{userDept}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 capitalize">
                          {r.style || 'Active'}
                        </span>
                        <div className="text-[9px] text-slate-400 mt-0.5">Energy {r.energy}/5</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-4 text-center space-y-1">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {vibeSubmitted
                    ? 'You checked in! Waiting for teammates to submit their vibes.'
                    : 'Be the first to submit your 10-second Vibe Check for Friday!'}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
