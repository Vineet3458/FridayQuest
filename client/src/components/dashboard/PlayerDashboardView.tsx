'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Gamepad2,
  Users,
  Trophy,
  Play,
  ChevronRight,
  Flame,
  Search,
  Bell,
  Settings,
  TrendingUp,
  Award,
  User,
  Tv,
  LayoutDashboard,
  ArrowRight,
  CheckCircle2,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import MobileExperienceShowcase from './MobileExperienceShowcase';
import { useAuthStore } from '@/stores/useAuthStore';

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

export default function PlayerDashboardView({
  user,
  nextSession,
  vibeAttendeeCount,
  copiedCode,
  onCopyCode,
  vibeEnergy,
  setVibeEnergy,
  vibeStyle,
  setVibeStyle,
  vibeSubmitting,
  vibeSubmitted,
  onQuickVibe,
  isCompact = false,
}: PlayerDashboardViewProps) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const displayName = user?.name || 'Kirxa';
  const userInitials = displayName.slice(0, 2).toUpperCase();
  const joinCode = nextSession?.joinCode || '';

  // Live countdown state (starting at 2 days, 4 hours, 12 mins, 30 secs)
  const [countdown, setCountdown] = useState({
    days: 2,
    hours: 4,
    mins: 12,
    secs: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full">
      {/* HERO BANNER CARD - Gamified, Celebratory, Lavender & Sky Blue Theme */}
          <div className="bg-gradient-to-r from-[#EEF2FF] via-[#F5F3FF] to-[#EDE9FE] dark:from-slate-900/90 dark:via-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-3xl p-6 shadow-sm relative overflow-hidden">
            {/* Ambient background sparkle decorative circles */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-purple-400/10 rounded-full blur-2xl pointer-events-none"></div>

            {/* Top row: Greeting on left, Quote on right */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-extrabold text-xl sm:text-2xl tracking-tight">
                  <span className="text-2xl animate-bounce">👋</span>
                  <span>Hi, {displayName}!</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold ml-1">
                    Ready for some Fun Friday?
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
                  Let's play together, connect better and make this Friday amazing!
                </p>
              </div>

              {/* Quote card matching top right of reference */}
              <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-indigo-100 dark:border-indigo-900/40 text-center shadow-xs self-start shrink-0 max-w-xs">
                <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 italic leading-snug">
                  “Good teams. Great people. Happier Fridays!”
                </div>
              </div>
            </div>

            {/* Main Event Showcase & Live Celebration Illustration */}
            <div className="mt-6 pt-5 border-t border-indigo-200/50 dark:border-indigo-900/40 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              {/* Event Details & Countdown */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#2563EB] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
                    Next Friday Event
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {nextSession?.status === 'live' ? '🔴 Live Right Now' : 'Upcoming Session'}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {nextSession?.title || 'Fun Friday Kickoff'} 🎉
                  </h3>
                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs font-medium text-slate-600 dark:text-slate-400 mt-2">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      {nextSession?.date ? new Date(nextSession.date).toLocaleDateString() : 'Fri, Oct 30, 2026'}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      {nextSession?.startTime || '4:00 PM - 5:30 PM'}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      {nextSession?.location || 'Cafeteria, Noida'}
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        <span className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-slate-900 bg-blue-500 text-white text-[9px] font-bold text-center leading-5">K</span>
                        <span className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-slate-900 bg-purple-500 text-white text-[9px] font-bold text-center leading-5">R</span>
                        <span className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-slate-900 bg-amber-500 text-white text-[9px] font-bold text-center leading-5">A</span>
                      </div>
                      <span>{85 + vibeAttendeeCount} joining</span>
                    </span>
                  </div>
                </div>

                {/* Live Countdown Timer Boxes matching reference */}
                <div className="flex items-center gap-2 pt-1">
                  {[
                    { val: countdown.days, label: 'Days' },
                    { val: countdown.hours, label: 'Hours' },
                    { val: countdown.mins, label: 'Mins' },
                    { val: countdown.secs, label: 'Secs' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="w-14 sm:w-16 py-2 px-1 rounded-2xl bg-white dark:bg-slate-900/90 border border-indigo-100 dark:border-indigo-900/50 text-center shadow-xs"
                    >
                      <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono leading-none">
                        {String(item.val).padStart(2, '0')}
                      </div>
                      <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-wider">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={joinCode ? `/session/${encodeURIComponent(joinCode)}/play` : '/sessions'}
                    className="px-6 py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Enter Live Room (Buzzer & Card)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/sessions"
                    className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>View Details</span>
                  </Link>
                </div>
              </div>

              {/* Celebratory Characters & Trophy Illustration Graphic */}
              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <div className="relative w-64 h-56 flex items-center justify-center">
                  <svg viewBox="0 0 260 220" className="w-full h-full drop-shadow-md">
                    <defs>
                      <linearGradient id="trophyGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FBBF24" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#D97706" />
                      </linearGradient>
                      <linearGradient id="characterGrad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#1D4ED8" />
                      </linearGradient>
                      <linearGradient id="characterGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#BE185D" />
                      </linearGradient>
                    </defs>

                    {/* Confetti particles */}
                    <circle cx="30" cy="40" r="4" fill="#3B82F6" />
                    <rect x="50" y="25" width="6" height="6" fill="#F59E0B" rx="1" transform="rotate(25 50 25)" />
                    <circle cx="100" cy="15" r="3.5" fill="#EC4899" />
                    <rect x="180" y="20" width="7" height="4" fill="#10B981" rx="1" transform="rotate(-30 180 20)" />
                    <circle cx="230" cy="50" r="4" fill="#8B5CF6" />
                    <rect x="220" y="90" width="6" height="6" fill="#FBBF24" rx="1" transform="rotate(45 220 90)" />

                    {/* Cheerful Player 1 (Left - Blue shirt) */}
                    <circle cx="95" cy="115" r="20" fill="#FCD34D" />
                    <path d="M 85 105 Q 95 95 105 105" stroke="#1F2937" strokeWidth="3" fill="none" />
                    <circle cx="90" cy="115" r="2.5" fill="#1F2937" />
                    <circle cx="100" cy="115" r="2.5" fill="#1F2937" />
                    <path d="M 90 125 Q 95 132 100 125" stroke="#1F2937" strokeWidth="2.5" fill="none" />
                    {/* Body */}
                    <path d="M 75 140 Q 95 135 115 140 L 125 210 L 65 210 Z" fill="url(#characterGrad1)" />
                    {/* Raised arm holding trophy */}
                    <path d="M 105 145 Q 125 110 135 80" stroke="#FCD34D" strokeWidth="12" strokeLinecap="round" fill="none" />

                    {/* Cheerful Player 2 (Right - Pink dress) */}
                    <circle cx="165" cy="120" r="19" fill="#FCD34D" />
                    {/* Hair */}
                    <path d="M 145 125 Q 165 95 185 125 Q 190 150 180 155" stroke="#78350F" strokeWidth="8" fill="none" />
                    <circle cx="160" cy="120" r="2.5" fill="#1F2937" />
                    <circle cx="170" cy="120" r="2.5" fill="#1F2937" />
                    <path d="M 160 128 Q 165 135 170 128" stroke="#E11D48" strokeWidth="2.5" fill="none" />
                    {/* Body */}
                    <path d="M 145 145 Q 165 140 185 145 L 195 210 L 135 210 Z" fill="url(#characterGrad2)" />
                    {/* Raised cheering arm */}
                    <path d="M 175 145 Q 200 125 210 100" stroke="#FCD34D" strokeWidth="10" strokeLinecap="round" fill="none" />

                    {/* Golden Trophy held up high in the middle */}
                    <g transform="translate(125, 40)">
                      <path d="M 5 15 L 25 15 L 20 40 Q 15 48 10 48 Q 5 48 0 40 Z" fill="url(#trophyGrad)" />
                      {/* Trophy handles */}
                      <path d="M 3 20 Q -8 26 0 35 Q 2 37 5 35" stroke="#F59E0B" strokeWidth="3" fill="none" />
                      <path d="M 22 20 Q 33 26 25 35 Q 23 37 20 35" stroke="#F59E0B" strokeWidth="3" fill="none" />
                      {/* Base */}
                      <rect x="7" y="48" width="11" height="8" fill="#D97706" />
                      <rect x="2" y="56" width="21" height="6" fill="#92400E" rx="2" />
                      {/* Star on trophy */}
                      <polygon points="12,22 14,28 20,28 15,32 17,38 12,34 7,38 9,32 4,28 10,28" fill="#FFFBEB" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 3 MIDDLE CARDS: VIBE CHECK, JOURNEY XP, QUICK ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Vibe Check */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600">
                      <Flame className="w-4 h-4 fill-current" />
                    </span>
                    <span>Vibe Check</span>
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400">10s Quick</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">How are you feeling for Friday?</p>
              </div>

              {/* Energy Selector (1 - 5) */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Your energy tomorrow?
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setVibeEnergy(lvl)}
                      className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        vibeEnergy === lvl
                          ? 'bg-[#7C3AED] text-white shadow-sm ring-2 ring-purple-400/40'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Tags (Active, Calm, Brainy) */}
              <div className="grid grid-cols-3 gap-1.5">
                {(['active', 'calm', 'brainy'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setVibeStyle(s)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      vibeStyle === s
                        ? 'bg-[#7C3AED] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Submit Vibe Button */}
              <button
                type="button"
                onClick={onQuickVibe}
                disabled={vibeSubmitting || vibeSubmitted}
                className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer disabled:opacity-80 flex items-center justify-center gap-1.5"
              >
                {vibeSubmitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>✓ Vibe Submitted</span>
                  </>
                ) : (
                  <span>Submit Vibe</span>
                )}
              </button>
            </div>

            {/* Card 2: Your FridayQuest Journey */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Your FridayQuest Journey
                </h4>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Level 3
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
                    350 XP
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 mt-1">150 XP to next level</div>
                </div>
                <span className="text-3xl animate-pulse">🌟</span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full w-[70%] rounded-full"></div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
                  <div className="text-base font-extrabold text-slate-900 dark:text-white">5</div>
                  <div className="text-[9px] font-semibold text-slate-400">Games Played</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
                  <div className="text-base font-extrabold text-emerald-600">2</div>
                  <div className="text-[9px] font-semibold text-slate-400">Wins</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
                  <div className="text-base font-extrabold text-purple-600">3</div>
                  <div className="text-[9px] font-semibold text-slate-400">Badges</div>
                </div>
              </div>
            </div>

            {/* Card 3: Quick Actions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                Quick Actions
              </h4>

              <div className="space-y-2">
                <Link
                  href="/games"
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600">
                      <Gamepad2 className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600">
                        Browse Game Library
                      </div>
                      <div className="text-[10px] text-slate-400">Discover fun games</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/teams"
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                      <Users className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600">
                        View My Team
                      </div>
                      <div className="text-[10px] text-slate-400">See your team members</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/sessions"
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-purple-600">
                        Past Sessions
                      </div>
                      <div className="text-[10px] text-slate-400">Check recaps & photos</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/roles"
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600">
                      <Award className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-600">
                        Achievements
                      </div>
                      <div className="text-[10px] text-slate-400">Your badges & milestones</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* FEATURED GAMES FOR YOU SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Featured Games for You
              </h4>
              <Link href="/games" className="text-xs font-bold text-blue-600 hover:text-blue-500 hover:underline flex items-center gap-1">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Two Truths & a Lie', time: '10 min • 4-10 players', tag: 'Popular', tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300', emoji: '🎭', gradient: 'from-amber-400 to-orange-500' },
                { title: 'Chor-Police', time: '20 min • 6+ players', tag: 'High Energy', tagColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300', emoji: '👑', gradient: 'from-rose-500 to-red-600' },
                { title: 'Antakshari', time: '15 min • 4-8 players', tag: 'Team Game', tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300', emoji: '🎵', gradient: 'from-blue-500 to-indigo-600' },
                { title: 'QR Treasure Hunt', time: '25 min • 6-12 players', tag: 'Outdoor/Indoor', tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300', emoji: '🔍', gradient: 'from-purple-500 to-pink-600' },
              ].map((g, idx) => (
                <Link
                  key={idx}
                  href="/games"
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 flex flex-col justify-between space-y-3 group transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${g.gradient} flex items-center justify-center text-xl shadow-xs`}>
                      {g.emoji}
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${g.tagColor}`}>
                      {g.tag}
                    </span>
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {g.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{g.time}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* BOTTOM ROW: Mobile Experience (Player) Showcase */}
          <MobileExperienceShowcase
            nextSession={nextSession}
            liveBuzzerLocked={false}
            buzzerWinner=""
            liveScores={{ 'Team Alpha': 80, 'Team Bravo': 60, 'Team Charlie': 40, 'Team Delta': 20 }}
            onLiveBuzz={() => {}}
            onResetBuzzer={() => {}}
          />
    </div>
  );
}
