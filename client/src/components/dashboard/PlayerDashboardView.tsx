'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Gamepad2,
  Users,
  Trophy,
  Play,
  ChevronRight,
  CheckCircle2,
  Award,
  Radio,
  X,
  ExternalLink,
  ShieldCheck,
  Check,
  Copy,
  Sparkles,
  Flame,
  Rocket,
  Zap,
} from 'lucide-react';
import { usePlayerAnalytics } from '@/hooks/useAnalytics';
import { useGeolocation } from '@/hooks/useGeolocation';

interface PlayerDashboardViewProps {
  user?: any;
  nextSession?: any;
  vibeAttendeeCount: number;
  copiedCode: boolean;
  onCopyCode: (code: string) => void;
  vibeEnergy: number;
  setVibeEnergy: (lvl: number) => void;
  vibeStyle: 'active' | 'calm' | 'brainy';
  setVibeStyle: (style: 'active' | 'calm' | 'brainy') => void;
  vibeSubmitting: boolean;
  vibeSubmitted: boolean;
  onQuickVibe: () => Promise<void>;
  isCompact?: boolean;
}

function formatSessionTime(startTime?: string, durationMin: number = 90): string {
  if (!startTime) return '4:00 PM - 5:30 PM IST';
  if (startTime.includes('AM') || startTime.includes('PM') || startTime.includes('-')) {
    return startTime.includes('IST') ? startTime : `${startTime} IST`;
  }
  const parts = startTime.split(':');
  if (parts.length < 2) return `${startTime} IST`;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) || 0;
  if (isNaN(h)) return `${startTime} IST`;

  const endTotalMin = h * 60 + m + durationMin;
  const endH = Math.floor(endTotalMin / 60) % 24;
  const endM = endTotalMin % 60;

  const formatH = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return { h12, ampm };
  };

  const startFmt = formatH(h);
  const endFmt = formatH(endH);

  const startStr = `${startFmt.h12}:${m.toString().padStart(2, '0')} ${startFmt.ampm}`;
  const endStr = `${endFmt.h12}:${endM.toString().padStart(2, '0')} ${endFmt.ampm}`;
  return `${startStr} - ${endStr} IST`;
}

const ENERGY_PROFILES = [
  {
    lvl: 1,
    emoji: '😴',
    title: 'Low Battery',
    label: 'Recharging',
    tagline: 'Need a warm coffee & calm games',
    gradient: 'from-blue-500 to-indigo-600',
    lightBg: 'bg-blue-50 dark:bg-blue-950/40',
    lightBorder: 'border-blue-200 dark:border-blue-800',
    badgeText: 'text-blue-700 dark:text-blue-300',
    pct: 20,
    accentGlow: 'shadow-blue-500/25',
  },
  {
    lvl: 2,
    emoji: '☕',
    title: 'Chill & Easy',
    label: 'Relaxed',
    tagline: 'Ready for laughs & easy conversation',
    gradient: 'from-teal-500 to-emerald-600',
    lightBg: 'bg-teal-50 dark:bg-teal-950/40',
    lightBorder: 'border-teal-200 dark:border-teal-800',
    badgeText: 'text-teal-700 dark:text-teal-300',
    pct: 40,
    accentGlow: 'shadow-teal-500/25',
  },
  {
    lvl: 3,
    emoji: '😊',
    title: 'Good Vibes',
    label: 'Balanced',
    tagline: 'Great Friday spirit, ready to connect & play',
    gradient: 'from-amber-500 to-orange-500',
    lightBg: 'bg-amber-50 dark:bg-amber-950/40',
    lightBorder: 'border-amber-200 dark:border-amber-800',
    badgeText: 'text-amber-700 dark:text-amber-300',
    pct: 60,
    accentGlow: 'shadow-amber-500/25',
  },
  {
    lvl: 4,
    emoji: '⚡',
    title: 'Super Hyped',
    label: 'High Energy',
    tagline: 'Bring on buzzer battles & team glory!',
    gradient: 'from-purple-600 to-indigo-600',
    lightBg: 'bg-purple-50 dark:bg-purple-950/40',
    lightBorder: 'border-purple-200 dark:border-purple-800',
    badgeText: 'text-purple-700 dark:text-purple-300',
    pct: 80,
    accentGlow: 'shadow-purple-500/25',
  },
  {
    lvl: 5,
    emoji: '🚀',
    title: 'Turbo Charged',
    label: 'Max Warp',
    tagline: 'Unstoppable 100% champion mode!',
    gradient: 'from-rose-500 via-pink-500 to-purple-600',
    lightBg: 'bg-rose-50 dark:bg-rose-950/40',
    lightBorder: 'border-rose-200 dark:border-rose-800',
    badgeText: 'text-rose-700 dark:text-rose-300',
    pct: 100,
    accentGlow: 'shadow-rose-500/25',
  },
];

export default function PlayerDashboardView({
  user,
  nextSession,
  vibeAttendeeCount,
  vibeEnergy,
  setVibeEnergy,
  vibeStyle,
  setVibeStyle,
  vibeSubmitting,
  vibeSubmitted,
  onQuickVibe,
}: PlayerDashboardViewProps) {
  // 1. Browser Geolocation Permission & Campus Detection
  const {
    coordinates,
    permissionState,
    loading: locationLoading,
    requestLocationPermission,
  } = useGeolocation();

  // 2. Fetch authoritative player analytics & MongoDB session data
  const { data: analyticsData } = usePlayerAnalytics();

  const player = analyticsData?.user || user;
  const displayName = player?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Kirxa';

  const session = analyticsData?.nextSession || nextSession;
  const sessionTitle = session?.title || 'Team Innovation Challenge';
  const isLive = session?.status === 'live' || session?.isLive;
  const sessionDate = session?.date
    ? new Date(session.date).toLocaleDateString('en-US', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Fri, Nov 6, 2026';
  const sessionTime = formatSessionTime(session?.startTime, session?.durationMin || 90);
  const sessionLocation = session?.location || 'Innovation Lab';
  const joinCode = session?.joinCode || nextSession?.joinCode || 'KIRXA-DEMO';
  const attendeeCount = session?.attendeeCount ?? (85 + vibeAttendeeCount);

  // Direct Live Room URL (supports MongoDB _id or join code)
  const liveRoomUrl = session?.id || session?._id
    ? `/session/${session.id || session._id}/play`
    : `/session/${encodeURIComponent(joinCode)}/play`;

  // Details Modal state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [copiedJoinCode, setCopiedJoinCode] = useState(false);

  const handleCopyCode = async () => {
    if (!joinCode) return;
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopiedJoinCode(true);
      setTimeout(() => setCopiedJoinCode(false), 2000);
    } catch {}
  };

  // 3. Accurate countdown computed dynamically from actual session date & time
  const [countdown, setCountdown] = useState(() => {
    const cd = analyticsData?.nextSession?.countdown;
    if (cd) {
      return {
        days: cd.days ?? 0,
        hours: (cd.hours ?? 0) % 24,
        mins: cd.mins ?? 0,
        secs: cd.secs ?? 0,
      };
    }
    return { days: 0, hours: 0, mins: 0, secs: 0 };
  });

  useEffect(() => {
    const updateCountdown = () => {
      if (!session?.date) return;
      
      // Parse session date & time strictly in Indian Standard Time (Asia/Kolkata, UTC+5:30)
      const d = new Date(session.date);
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const dStr = formatter.format(d);
      const timePart = session.startTime && session.startTime.includes(':') ? session.startTime : '16:00';
      const [h, m] = timePart.split(':');
      const hh = (h || '16').padStart(2, '0');
      const mm = (m || '00').padStart(2, '0');
      const targetMs = new Date(`${dStr}T${hh}:${mm}:00+05:30`).getTime();

      const now = Date.now();
      const diffMs = targetMs - now;

      if (diffMs > 0) {
        // Scheduled event in the future:
        // Calculate days left, and remaining hours (strictly < 24)
        const totalSecs = Math.max(0, Math.floor(diffMs / 1000));
        setCountdown({
          days: Math.floor(totalSecs / 86400),
          hours: Math.floor((totalSecs % 86400) / 3600), // STRICTLY < 24 (0-23)
          mins: Math.floor((totalSecs % 3600) / 60),      // STRICTLY < 60 (0-59)
          secs: totalSecs % 60,                           // STRICTLY < 60 (0-59)
        });
      } else if (isLive) {
        const durationMin = session?.durationMin || 90;
        const sessionEnd = targetMs + durationMin * 60 * 1000;
        const remainLive = Math.max(0, sessionEnd - now);
        const totalSecs = Math.max(0, Math.floor(remainLive / 1000));
        setCountdown({
          days: Math.floor(totalSecs / 86400),
          hours: Math.floor((totalSecs % 86400) / 3600), // STRICTLY < 24 (0-23)
          mins: Math.floor((totalSecs % 3600) / 60),      // STRICTLY < 60 (0-59)
          secs: totalSecs % 60,                           // STRICTLY < 60 (0-59)
        });
      } else {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [session?.date, session?.startTime, session?.durationMin, isLive]);

  // Sync user vibe check state from backend MongoDB if previously submitted
  useEffect(() => {
    if (analyticsData?.userVibe?.submitted) {
      if (analyticsData.userVibe.energy) setVibeEnergy(analyticsData.userVibe.energy);
      if (analyticsData.userVibe.style) setVibeStyle(analyticsData.userVibe.style);
    }
  }, [analyticsData?.userVibe, setVibeEnergy, setVibeStyle]);

  // Journey stats from MongoDB for THIS specific user
  const journey = analyticsData?.journeyStats || {
    xp: player?.xp || 350,
    level: player?.level || 3,
    xpToNextLevel: 150,
    progressPercent: 70,
    gamesPlayed: 5,
    wins: 2,
    badges: 3,
  };

  // Live published games from MongoDB Game collection
  const featuredGames =
    analyticsData?.featuredGames && analyticsData.featuredGames.length > 0
      ? analyticsData.featuredGames
      : [];

  const isVibeDone = vibeSubmitted || analyticsData?.userVibe?.submitted;
  const [isEditingVibe, setIsEditingVibe] = useState(false);
  const activeEnergy = ENERGY_PROFILES.find((p) => p.lvl === vibeEnergy) || ENERGY_PROFILES[3];
  const userCity = coordinates?.city || player?.location?.city;
  const userCampus = coordinates?.campus || player?.location?.campus;

  return (
    <div className="relative p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full">
      {/* Dreamy soft gradient wallpaper overlay matching uploaded background */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-35 dark:opacity-15 bg-[url('/images/player/player-bg.jpg')] bg-cover bg-fixed bg-center"
        aria-hidden="true"
      />

      {/* LOCATION PERMISSION BANNER - Prompts for location permission if not yet granted */}
      {permissionState !== 'granted' && (
        <div className="rounded-2xl p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-blue-200/80 dark:border-indigo-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25">
              <MapPin className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Enable Office Campus Geolocation</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  Required for In-Person Check-In
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                FridayQuest verifies that you are present at your office campus (Noida HQ, Bengaluru, Gurugram) to unlock buzzer controls and team games.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={requestLocationPermission}
            disabled={locationLoading}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer shrink-0 disabled:opacity-60 flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{locationLoading ? 'Requesting Permission...' : 'Allow Location Access'}</span>
          </button>
        </div>
      )}

      {/* 1. HERO BANNER CARD - Matching reference design exactly */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#DBEAFE]/80 via-[#EFF6FF]/95 to-[#EDE9FE]/85 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/40 border border-blue-100/90 dark:border-indigo-900/40 p-5 sm:p-6 shadow-xs overflow-hidden">
        {/* Floating Sparkles & Confetti Background Elements */}
        <div className="absolute top-3 left-1/3 text-lg opacity-60 pointer-events-none animate-pulse">✨</div>
        <div className="absolute bottom-4 right-1/3 text-base opacity-50 pointer-events-none">🎉</div>
        <div className="absolute top-8 right-16 text-sm opacity-50 pointer-events-none">⭐</div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Left Column: Greeting & Next Friday Event Card */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Hi, {displayName}!</span>
                  <span>👋</span>
                </h1>
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#4F46E5] dark:text-[#818CF8] tracking-tight">
                Ready for some Fun Friday?
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-lg">
                Let&apos;s play together, connect with your team, and make this Friday amazing!
              </p>
            </div>

            {/* Inner Event Card */}
            <div className="bg-white dark:bg-slate-900/95 rounded-2xl p-4 sm:p-5 shadow-xs border border-blue-100/80 dark:border-slate-800 space-y-3.5">
              {/* Pill Tag + Live Countdown Timer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`self-start px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs flex items-center gap-1.5 ${
                      isLive
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-[#6366F1] text-white'
                    }`}
                  >
                    {isLive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                    <span>{isLive ? 'LIVE EVENT IN PROGRESS' : 'NEXT FRIDAY EVENT'}</span>
                  </span>

                  {/* Location verification badge */}
                  {userCity && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span>{userCampus || userCity}</span>
                    </span>
                  )}
                </div>

                {/* Countdown Timer with 4 vertical boxes */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  {[
                    { val: countdown.days, label: 'DAYS' },
                    { val: countdown.hours, label: 'HOURS' },
                    { val: countdown.mins, label: 'MINS' },
                    { val: countdown.secs, label: 'SECS' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="w-10 sm:w-11 py-1 px-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center"
                    >
                      <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono leading-none">
                        {item.val}
                      </div>
                      <div className="text-[8px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-tight mt-0.5">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Title */}
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>{sessionTitle}</span>
                  <span>🎉</span>
                </h2>

                {/* Meta information row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{sessionDate}</span>
                  </span>

                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{sessionTime}</span>
                  </span>

                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{sessionLocation}</span>
                  </span>

                  {/* Attendees Count matching exact reference */}
                  <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{attendeeCount} joining</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href={liveRoomUrl}
                  className="px-5 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Enter Live Room (Buzzer &amp; Card)</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setDetailsModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Illustration from Reference Design */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-center">
            <img
              src="/images/player/hero-illustration-exact.png"
              alt="FridayQuest Fun Team Celebration"
              className="w-full max-w-lg h-auto object-contain select-none drop-shadow-sm rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* 2. THREE MIDDLE CARDS GRID: VIBE CHECK, JOURNEY XP, QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Super Interactive & Cool Vibe Check */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3.5 relative overflow-hidden group">
          {/* Subtle Ambient Radial Glow matching active energy */}
          <div
            className={`absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 pointer-events-none blur-2xl transition-all duration-700 bg-gradient-to-br ${activeEnergy.gradient}`}
          />

          {/* Header Row: Dynamic Avatar, Title & Live Equalizer */}
          <div className="flex items-center justify-between gap-2 relative z-10">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${activeEnergy.gradient} p-0.5 shadow-md ${activeEnergy.accentGlow} flex items-center justify-center shrink-0 transform transition-all duration-300 group-hover:scale-105`}
              >
                <div
                  key={activeEnergy.lvl}
                  className="w-full h-full rounded-[14px] bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl select-none animate-in zoom-in-75 duration-200"
                >
                  {activeEnergy.emoji}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                    Vibe Check
                  </h3>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800">
                    Lvl {vibeEnergy}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeEnergy.title} • {vibeStyle.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Equalizer Visualizer Micro-Bars */}
            <div className="flex items-end gap-1 px-2 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800">
              <span className="w-1 h-3 rounded-full bg-indigo-500 animate-[bounce_1s_infinite_100ms]" />
              <span className="w-1 h-4 rounded-full bg-purple-500 animate-[bounce_1s_infinite_300ms]" />
              <span className="w-1 h-2 rounded-full bg-pink-500 animate-[bounce_1s_infinite_200ms]" />
              <span className="w-1 h-3.5 rounded-full bg-blue-500 animate-[bounce_1s_infinite_400ms]" />
            </div>
          </div>

          {/* Interactive Energy Selector Deck (1 to 5) */}
          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span>Energy Level</span>
                <span className="text-purple-600 font-extrabold font-mono">({activeEnergy.pct}%)</span>
              </span>
              <span className="text-[10px] font-extrabold text-slate-400">Tap to calibrate</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {ENERGY_PROFILES.map((p) => {
                const isSelected = vibeEnergy === p.lvl;
                return (
                  <button
                    key={p.lvl}
                    type="button"
                    onClick={() => {
                      setVibeEnergy(p.lvl);
                      if (isVibeDone && !isEditingVibe) setIsEditingVibe(true);
                    }}
                    className={`group/btn relative py-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? `bg-gradient-to-b ${p.gradient} text-white shadow-md ${p.accentGlow} scale-[1.04] ring-2 ring-white/60 dark:ring-slate-900`
                        : 'bg-slate-50 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-100 dark:border-slate-800 hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="text-sm select-none transition-transform duration-200 group-hover/btn:scale-125">
                      {p.emoji}
                    </span>
                    <span className="text-[11px] font-black leading-tight mt-0.5 font-mono">
                      {p.lvl}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Glowing Tagline Pill */}
            <div
              className={`p-2 rounded-xl ${activeEnergy.lightBg} border ${activeEnergy.lightBorder} flex items-center gap-2 transition-all duration-300`}
            >
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${activeEnergy.badgeText}`} />
              <p className={`text-[10px] font-bold ${activeEnergy.badgeText} truncate leading-tight`}>
                {activeEnergy.tagline}
              </p>
            </div>
          </div>

          {/* Interactive Play Style Selector (Active, Calm, Brainy) */}
          <div className="space-y-1.5 relative z-10">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Play Style Preference
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'active', label: 'Active', icon: '⚡' },
                { id: 'calm', label: 'Calm', icon: '🧘' },
                { id: 'brainy', label: 'Brainy', icon: '🧠' },
              ].map((s) => {
                const isSelected = vibeStyle === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setVibeStyle(s.id as any);
                      if (isVibeDone && !isEditingVibe) setIsEditingVibe(true);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white shadow-sm ring-1 ring-purple-300/40'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span className="capitalize">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Action Button / Locked-in State */}
          <div className="pt-0.5 relative z-10 space-y-1.5">
            {isVibeDone && !isEditingVibe ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Vibe Locked In</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                    ✓ Counted
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingVibe(true)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  await onQuickVibe();
                  setIsEditingVibe(false);
                }}
                disabled={vibeSubmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#4F46E5] hover:opacity-95 text-white text-xs font-black shadow-md shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {vibeSubmitting ? (
                  <span>Syncing Vibe...</span>
                ) : isEditingVibe ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Update My Vibe</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-3.5 h-3.5" />
                    <span>Lock In My Vibe</span>
                  </>
                )}
              </button>
            )}

            {/* Live Social Ticker */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium px-1">
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500 fill-current" />
                <span>{attendeeCount} colleagues checked in</span>
              </span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                Top: ⚡ Active (68%)
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Your FridayQuest Journey */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-purple-600 text-sm">⚛️</span>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Your FridayQuest Journey
              </h3>
            </div>
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
              Level {journey.level}
            </span>
          </div>

          {/* Big XP Display Block */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl select-none">⭐</span>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
                  {journey.xp} XP
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  {journey.xpToNextLevel} XP to next level
                </div>
              </div>
            </div>
            <span className="text-xl select-none">☀️</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${journey.progressPercent}%` }}
            ></div>
          </div>

          {/* 3 Mini Stats Counters */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Gamepad2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {journey.gamesPlayed}
                </span>
              </div>
              <div className="text-[9px] font-semibold text-slate-400 mt-0.5">Games Played</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600">
                <Trophy className="w-3.5 h-3.5" />
                <span className="text-base font-extrabold">{journey.wins}</span>
              </div>
              <div className="text-[9px] font-semibold text-slate-400 mt-0.5">Wins</div>
            </div>
            <Link
              href="/achievements"
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors group cursor-pointer block"
            >
              <div className="flex items-center justify-center gap-1.5 text-amber-500">
                <Award className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span className="text-base font-extrabold">{journey.badges}</span>
              </div>
              <div className="text-[9px] font-semibold text-slate-400 group-hover:text-amber-600 mt-0.5">Badges →</div>
            </Link>
          </div>
        </div>

        {/* Card 3: Quick Actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 text-base">⚡</span>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Quick Actions
            </h3>
          </div>

          <div className="space-y-2">
            {[
              {
                title: 'Browse Game Library',
                desc: 'Discover fun games',
                icon: <Gamepad2 className="w-4 h-4 text-blue-600" />,
                bg: 'bg-blue-50 dark:bg-blue-950',
                href: '/games',
              },
              {
                title: 'View My Team',
                desc: 'See your team members',
                icon: <Users className="w-4 h-4 text-orange-600" />,
                bg: 'bg-orange-50 dark:bg-orange-950',
                href: '/teams',
              },
              {
                title: 'Past Sessions',
                desc: 'Check recaps & photos',
                icon: <Calendar className="w-4 h-4 text-purple-600" />,
                bg: 'bg-purple-50 dark:bg-purple-950',
                href: '/sessions',
              },
              {
                title: 'Achievements',
                desc: 'Your badges & milestones',
                icon: <Award className="w-4 h-4 text-amber-600" />,
                bg: 'bg-amber-50 dark:bg-amber-950',
                href: '/achievements',
              },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                    {item.icon}
                  </span>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 3. FEATURED GAMES FOR YOU ROW - Queried Dynamically from MongoDB Game Collection */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center text-xs">
              <Gamepad2 className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Featured Games for You
            </h3>
          </div>
          <Link
            href="/games"
            className="text-xs font-bold text-blue-600 hover:text-blue-500 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredGames.map((g) => (
            <Link
              key={g.id}
              href="/games"
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
            >
              {/* Artwork Banner with Badge */}
              <div className="relative h-24 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={g.thumb}
                  alt={g.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
                />
                <span
                  className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs ${g.badgeClass}`}
                >
                  {g.badge}
                </span>
              </div>

              {/* Title, Subtitle and Action Button */}
              <div className="p-3.5 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                    {g.title}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                    {g.subtitle}
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white text-slate-400 flex items-center justify-center shrink-0 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      {detailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white leading-tight">
                    {sessionTitle}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-medium">Session Overview &amp; Live Information</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                  <div className="text-slate-400 font-semibold text-[10px]">DATE &amp; TIME</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{sessionDate}</div>
                  <div className="text-indigo-600 dark:text-indigo-400 font-medium">{sessionTime}</div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                  <div className="text-slate-400 font-semibold text-[10px]">LOCATION &amp; CAMPUS</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{sessionLocation}</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {userCampus || 'In-Person Cafeteria'}
                  </div>
                </div>
              </div>

              {joinCode && (
                <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/70 dark:border-purple-800/50 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase text-purple-700 dark:text-purple-300">
                      Mobile Join Code
                    </div>
                    <div className="text-lg font-black text-slate-900 dark:text-white font-mono tracking-widest mt-0.5">
                      {joinCode}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    {copiedJoinCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedJoinCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              )}

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                <div className="text-slate-400 font-semibold text-[10px]">EVENT STATUS</div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                    {session?.status || 'Scheduled'}
                  </span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">
                    {attendeeCount} Confirmed Attendees
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href={liveRoomUrl}
                onClick={() => setDetailsModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-black text-center shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Enter Live Room</span>
              </Link>
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
